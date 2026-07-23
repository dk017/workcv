import { ensureAnalyticsTables, getPool } from "@/lib/db";
import { sendConversionAlertEmail } from "@/lib/email";

type AlertContextValue = string | number | boolean | null;

export type ConversionFailureInput = {
  category: string;
  title: string;
  userId?: string | null;
  documentId?: string | null;
  error?: unknown;
  context?: Record<string, AlertContextValue>;
  threshold?: number;
  windowMinutes?: number;
  cooldownMinutes?: number;
};

type AlertClaim = {
  occurrenceCount: number;
  firstSeenAt: Date;
  claimed: boolean;
  persisted: boolean;
};

type MemoryAlertState = {
  occurrenceCount: number;
  firstSeenAt: number;
  lastSeenAt: number;
  lastAlertSentAt: number | null;
  lastAlertAttemptAt: number | null;
};

const memoryAlerts = new Map<string, MemoryAlertState>();

function truncate(value: string, maxLength: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function describeConversionError(error: unknown) {
  if (error instanceof Error) {
    return truncate(`${error.name}: ${error.message}`, 500);
  }
  if (typeof error === "string") return truncate(error, 500);
  return "No server error object was available.";
}

function sanitizeContext(
  input: Record<string, AlertContextValue> | undefined,
) {
  return Object.fromEntries(
    Object.entries(input || {})
      .filter(([key]) => /^[a-zA-Z0-9_.-]{1,50}$/.test(key))
      .slice(0, 12)
      .map(([key, value]) => [
        key,
        typeof value === "string" ? truncate(value, 160) : value,
      ]),
  ) as Record<string, AlertContextValue>;
}

function fingerprintFor(input: ConversionFailureInput) {
  return [
    truncate(input.category, 80),
    truncate(input.userId || "anonymous", 100),
    truncate(input.documentId || "none", 100),
  ].join(":");
}

function claimInMemory(
  fingerprint: string,
  threshold: number,
  windowMinutes: number,
  cooldownMinutes: number,
): AlertClaim {
  const now = Date.now();
  const existing = memoryAlerts.get(fingerprint);
  const windowMs = windowMinutes * 60_000;
  const cooldownMs = cooldownMinutes * 60_000;
  const state =
    !existing || now - existing.lastSeenAt > windowMs
      ? {
          occurrenceCount: 1,
          firstSeenAt: now,
          lastSeenAt: now,
          lastAlertSentAt: existing?.lastAlertSentAt || null,
          lastAlertAttemptAt: null,
        }
      : {
          ...existing,
          occurrenceCount: existing.occurrenceCount + 1,
          lastSeenAt: now,
        };
  const cooldownPassed =
    state.lastAlertSentAt === null ||
    now - state.lastAlertSentAt > cooldownMs;
  const attemptAvailable =
    state.lastAlertAttemptAt === null ||
    now - state.lastAlertAttemptAt > 5 * 60_000;
  const claimed =
    state.occurrenceCount >= threshold && cooldownPassed && attemptAvailable;
  if (claimed) state.lastAlertAttemptAt = now;
  memoryAlerts.set(fingerprint, state);
  return {
    occurrenceCount: state.occurrenceCount,
    firstSeenAt: new Date(state.firstSeenAt),
    claimed,
    persisted: false,
  };
}

async function claimInDatabase(
  input: ConversionFailureInput,
  fingerprint: string,
  errorSummary: string,
  threshold: number,
  windowMinutes: number,
  cooldownMinutes: number,
): Promise<AlertClaim> {
  await ensureAnalyticsTables();
  const recorded = await getPool().query<{
    occurrence_count: number;
    first_seen_at: Date;
  }>(
    `
      INSERT INTO workcv_conversion_alerts
        (fingerprint, category, user_id, document_id, occurrence_count,
         first_seen_at, last_seen_at, last_error)
      VALUES ($1, $2, $3, $4, 1, NOW(), NOW(), $5)
      ON CONFLICT (fingerprint) DO UPDATE SET
        category = EXCLUDED.category,
        user_id = EXCLUDED.user_id,
        document_id = EXCLUDED.document_id,
        occurrence_count = CASE
          WHEN workcv_conversion_alerts.last_seen_at <
               NOW() - ($6 * INTERVAL '1 minute')
          THEN 1
          ELSE workcv_conversion_alerts.occurrence_count + 1
        END,
        first_seen_at = CASE
          WHEN workcv_conversion_alerts.last_seen_at <
               NOW() - ($6 * INTERVAL '1 minute')
          THEN NOW()
          ELSE workcv_conversion_alerts.first_seen_at
        END,
        last_seen_at = NOW(),
        last_error = EXCLUDED.last_error
      RETURNING occurrence_count, first_seen_at
    `,
    [
      fingerprint,
      truncate(input.category, 80),
      input.userId || null,
      input.documentId || null,
      errorSummary,
      windowMinutes,
    ],
  );
  const row = recorded.rows[0];
  const claimed = await getPool().query<{ fingerprint: string }>(
    `
      UPDATE workcv_conversion_alerts
      SET last_alert_attempt_at = NOW(),
          last_delivery_error = NULL
      WHERE fingerprint = $1
        AND occurrence_count >= $2
        AND (
          last_alert_sent_at IS NULL
          OR last_alert_sent_at < NOW() - ($3 * INTERVAL '1 minute')
        )
        AND (
          last_alert_attempt_at IS NULL
          OR last_alert_attempt_at < NOW() - INTERVAL '5 minutes'
        )
      RETURNING fingerprint
    `,
    [fingerprint, threshold, cooldownMinutes],
  );
  return {
    occurrenceCount: row.occurrence_count,
    firstSeenAt: row.first_seen_at,
    claimed: claimed.rows.length > 0,
    persisted: true,
  };
}

async function recordDeliveryResult(
  fingerprint: string,
  sent: boolean,
  deliveryError?: string,
) {
  await getPool().query(
    `
      UPDATE workcv_conversion_alerts
      SET last_alert_sent_at = CASE WHEN $2 THEN NOW() ELSE last_alert_sent_at END,
          last_alert_attempt_at = CASE WHEN $2 THEN last_alert_attempt_at ELSE NULL END,
          last_delivery_error = $3
      WHERE fingerprint = $1
    `,
    [fingerprint, sent, deliveryError || null],
  );
}

export async function reportConversionFailure(
  input: ConversionFailureInput,
) {
  const threshold = Math.max(1, Math.floor(input.threshold || 1));
  const windowMinutes = Math.max(1, Math.floor(input.windowMinutes || 15));
  const cooldownMinutes = Math.max(
    windowMinutes,
    Math.floor(input.cooldownMinutes || 60),
  );
  const fingerprint = fingerprintFor(input);
  const errorSummary = describeConversionError(input.error);
  const context = sanitizeContext({
    environment: process.env.NODE_ENV || "unknown",
    ...input.context,
  });

  let claim: AlertClaim;
  try {
    claim = await claimInDatabase(
      input,
      fingerprint,
      errorSummary,
      threshold,
      windowMinutes,
      cooldownMinutes,
    );
  } catch (error) {
    console.error("conversion_alert_record_failed", {
      category: input.category,
      error: describeConversionError(error),
    });
    claim = claimInMemory(
      fingerprint,
      threshold,
      windowMinutes,
      cooldownMinutes,
    );
  }

  if (!claim.claimed) return;

  try {
    await sendConversionAlertEmail({
      title: truncate(input.title, 120),
      category: truncate(input.category, 80),
      userId: input.userId || null,
      documentId: input.documentId || null,
      occurrenceCount: claim.occurrenceCount,
      firstSeenAt: claim.firstSeenAt.toISOString(),
      errorSummary,
      context,
    });
  } catch (error) {
    const deliveryError = describeConversionError(error);
    console.error("conversion_alert_delivery_failed", {
      category: input.category,
      error: deliveryError,
    });
    if (claim.persisted) {
      try {
        await recordDeliveryResult(fingerprint, false, deliveryError);
      } catch (recordError) {
        console.error("conversion_alert_delivery_record_failed", {
          category: input.category,
          error: describeConversionError(recordError),
        });
      }
    }
    return;
  }

  if (claim.persisted) {
    try {
      await recordDeliveryResult(fingerprint, true);
    } catch (error) {
      console.error("conversion_alert_delivery_record_failed", {
        category: input.category,
        error: describeConversionError(error),
      });
    }
  } else {
      const state = memoryAlerts.get(fingerprint);
      if (state) {
        state.lastAlertSentAt = Date.now();
        memoryAlerts.set(fingerprint, state);
      }
  }
}
