import { ensureFeedbackOutreachTables, getPool } from "@/lib/db";
import { sendFeedbackResearchEmail } from "@/lib/email";
import { createFeedbackUnsubscribeToken } from "@/lib/feedback-token";
import { site } from "@/lib/site";

type FeedbackCandidate = {
  id: string;
  email: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function excludedEmails() {
  return new Set(
    (process.env.FEEDBACK_EXCLUDED_EMAILS || "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

function safeError(error: unknown) {
  const value =
    error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
  return value.replace(/\s+/g, " ").trim().slice(0, 500);
}

async function eligibleCandidates(limit: number) {
  await ensureFeedbackOutreachTables();
  const result = await getPool().query<FeedbackCandidate>(
    `
      SELECT u.id, u.email
      FROM workcv_users u
      LEFT JOIN workcv_feedback_preferences p
        ON p.email_normalized = LOWER(u.email)
      LEFT JOIN workcv_feedback_outreach o
        ON o.user_id = u.id
      WHERE u.created_at >= NOW() - INTERVAL '90 days'
        AND u.created_at < NOW() - INTERVAL '12 hours'
        AND p.feedback_opted_out_at IS NULL
        AND (
          o.user_id IS NULL
          OR (
            o.status = 'failed'
            AND o.attempt_count < 3
            AND o.last_attempt_at < NOW() - INTERVAL '30 minutes'
          )
          OR (
            o.status = 'sending'
            AND o.attempt_count < 3
            AND o.last_attempt_at < NOW() - INTERVAL '30 minutes'
          )
        )
        AND EXISTS (
          SELECT 1
          FROM workcv_editor_events e
          WHERE e.user_id = u.id
            AND e.document_id IS NOT NULL
            AND e.event_name IN (
              'editor_viewed',
              'import_started',
              'import_succeeded',
              'section_completed',
              'progress_milestone',
              'pdf_clicked',
              'checkout_sheet_opened',
              'payment_started'
            )
        )
      ORDER BY u.created_at ASC
      LIMIT $1
    `,
    [Math.max(limit * 3, limit)],
  );
  const excluded = excludedEmails();
  excluded.add("contact@workcv.co.uk");
  return result.rows
    .filter((candidate) => !excluded.has(normalizeEmail(candidate.email)))
    .slice(0, limit);
}

async function claimCandidate(candidate: FeedbackCandidate) {
  const email = normalizeEmail(candidate.email);
  const result = await getPool().query<{ user_id: string }>(
    `
      INSERT INTO workcv_feedback_outreach
        (user_id, email_normalized, status, attempt_count, last_attempt_at,
         last_error, updated_at)
      SELECT $1, $2, 'sending', 1, NOW(), NULL, NOW()
      WHERE NOT EXISTS (
        SELECT 1
        FROM workcv_feedback_preferences
        WHERE email_normalized = $2
          AND feedback_opted_out_at IS NOT NULL
      )
      ON CONFLICT (user_id) DO UPDATE SET
        email_normalized = EXCLUDED.email_normalized,
        status = 'sending',
        attempt_count = workcv_feedback_outreach.attempt_count + 1,
        last_attempt_at = NOW(),
        last_error = NULL,
        updated_at = NOW()
      WHERE workcv_feedback_outreach.status IN ('failed', 'sending')
        AND workcv_feedback_outreach.attempt_count < 3
        AND workcv_feedback_outreach.last_attempt_at <
            NOW() - INTERVAL '30 minutes'
        AND NOT EXISTS (
          SELECT 1
          FROM workcv_feedback_preferences
          WHERE email_normalized = $2
            AND feedback_opted_out_at IS NOT NULL
        )
      RETURNING user_id
    `,
    [candidate.id, email],
  );
  return result.rows.length > 0;
}

export async function runFeedbackOutreach(input: {
  limit?: number;
  dryRun?: boolean;
}) {
  const limit = Math.min(50, Math.max(1, Math.floor(input.limit || 20)));
  const candidates = await eligibleCandidates(limit);
  if (input.dryRun) {
    return {
      eligible: candidates.length,
      attempted: 0,
      sent: 0,
      failed: 0,
    };
  }

  let attempted = 0;
  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    const claimed = await claimCandidate(candidate);
    if (!claimed) continue;
    attempted += 1;
    try {
      const token = createFeedbackUnsubscribeToken(candidate.id);
      await sendFeedbackResearchEmail({
        to: normalizeEmail(candidate.email),
        unsubscribeUrl: `${site.url}/feedback/unsubscribe?token=${encodeURIComponent(token)}`,
      });
      await getPool().query(
        `
          UPDATE workcv_feedback_outreach
          SET status = 'sent',
              sent_at = NOW(),
              last_error = NULL,
              updated_at = NOW()
          WHERE user_id = $1
        `,
        [candidate.id],
      );
      sent += 1;
    } catch (error) {
      await getPool().query(
        `
          UPDATE workcv_feedback_outreach
          SET status = 'failed',
              last_error = $2,
              updated_at = NOW()
          WHERE user_id = $1
        `,
        [candidate.id, safeError(error)],
      );
      failed += 1;
    }
  }

  return {
    eligible: candidates.length,
    attempted,
    sent,
    failed,
  };
}

export async function unsubscribeFromFeedback(userId: string) {
  await ensureFeedbackOutreachTables();
  const result = await getPool().query<{ email: string }>(
    "SELECT email FROM workcv_users WHERE id = $1 LIMIT 1",
    [userId],
  );
  const email = result.rows[0]?.email;
  if (!email) return false;
  const normalized = normalizeEmail(email);
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `
        INSERT INTO workcv_feedback_preferences
          (email_normalized, feedback_opted_out_at, source, updated_at)
        VALUES ($1, NOW(), 'unsubscribe_link', NOW())
        ON CONFLICT (email_normalized) DO UPDATE SET
          feedback_opted_out_at = NOW(),
          source = 'unsubscribe_link',
          updated_at = NOW()
      `,
      [normalized],
    );
    await client.query(
      `
        UPDATE workcv_feedback_outreach
        SET status = 'opted_out', updated_at = NOW()
        WHERE user_id = $1
      `,
      [userId],
    );
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
