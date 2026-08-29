import { ensureFeedbackOutreachTables, ensureSavedCvReminderTables, getPool } from "@/lib/db";
import { createFeedbackUnsubscribeToken } from "@/lib/feedback-token";
import { savedCvReminderEnabled } from "@/lib/reminder-policy";
import { sendSavedCvReminderEmail } from "@/lib/saved-cv-reminder-email";
import { site } from "@/lib/site";

type ReminderCandidate = {
  id: string;
  email: string;
  document_id: string;
};

function safeError(error: unknown) {
  const value = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
  return value.replace(/\s+/g, " ").trim().slice(0, 500);
}

export async function eligibleCandidates(limit: number) {
  await ensureFeedbackOutreachTables();
  await ensureSavedCvReminderTables();
  const result = await getPool().query<ReminderCandidate>(
    `
      WITH latest_documents AS (
        SELECT DISTINCT ON (u.id)
          u.id,
          u.email,
          u.updated_at AS user_updated_at,
          d.id AS document_id,
          d.data,
          d.updated_at AS document_updated_at,
          activity.last_editor_activity
        FROM workcv_users u
        JOIN workcv_cv_documents d ON d.user_id = u.id
        LEFT JOIN LATERAL (
          SELECT MAX(e.created_at) AS last_editor_activity
          FROM workcv_editor_events e
          WHERE e.user_id = u.id
        ) activity ON TRUE
        ORDER BY u.id, d.updated_at DESC
      )
      SELECT d.id, d.email, d.document_id
      FROM latest_documents d
      LEFT JOIN workcv_feedback_preferences p ON p.email_normalized = LOWER(d.email)
      LEFT JOIN workcv_saved_cv_reminders r ON r.user_id = d.id
      WHERE GREATEST(
              d.user_updated_at,
              d.document_updated_at,
              COALESCE(d.last_editor_activity, '-infinity'::timestamptz)
            ) < NOW() - INTERVAL '24 hours'
        AND d.document_updated_at >= NOW() - INTERVAL '90 days'
        AND (
          NULLIF(BTRIM(COALESCE(d.data->>'fullName', '')), '') IS NOT NULL
          OR NULLIF(BTRIM(COALESCE(d.data->>'profile', '')), '') IS NOT NULL
          OR jsonb_array_length(
               CASE WHEN jsonb_typeof(d.data->'skills') = 'array'
                 THEN d.data->'skills' ELSE '[]'::jsonb END
             ) > 0
          OR jsonb_array_length(
               CASE WHEN jsonb_typeof(d.data->'experience') = 'array'
                 THEN d.data->'experience' ELSE '[]'::jsonb END
             ) > 0
          OR jsonb_array_length(
               CASE WHEN jsonb_typeof(d.data->'education') = 'array'
                 THEN d.data->'education' ELSE '[]'::jsonb END
             ) > 0
        )
        AND p.feedback_opted_out_at IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM workcv_orders o
          WHERE o.draft_id = d.document_id
            AND o.amount_cents > 0
            AND COALESCE(o.is_test, FALSE) = FALSE
        )
        AND (
          r.user_id IS NULL OR (
            r.status IN ('failed', 'sending')
            AND r.attempt_count < 3
            AND r.last_attempt_at < NOW() - INTERVAL '30 minutes'
          )
        )
      ORDER BY d.document_updated_at DESC
      LIMIT $1
    `,
    [limit],
  );
  return result.rows.filter((candidate) => candidate.email.toLowerCase() !== "contact@workcv.co.uk");
}

export async function claim(candidate: ReminderCandidate) {
  const result = await getPool().query<{ user_id: string }>(
    `
      INSERT INTO workcv_saved_cv_reminders
        (user_id, email_normalized, document_id, status, attempt_count,
         last_attempt_at, last_error, updated_at)
      SELECT $1, LOWER($2), $3, 'sending', 1, NOW(), NULL, NOW()
      WHERE $3 = (
          SELECT d.id
          FROM workcv_cv_documents d
          WHERE d.user_id = $1
          ORDER BY d.updated_at DESC
          LIMIT 1
        )
        AND EXISTS (
          SELECT 1
          FROM workcv_users u
          JOIN workcv_cv_documents d ON d.id = $3 AND d.user_id = u.id
          WHERE u.id = $1
            AND u.updated_at < NOW() - INTERVAL '24 hours'
            AND d.updated_at < NOW() - INTERVAL '24 hours'
            AND NOT EXISTS (
              SELECT 1 FROM workcv_editor_events e
              WHERE e.user_id = u.id
                AND e.created_at >= NOW() - INTERVAL '24 hours'
            )
            AND NOT EXISTS (
              SELECT 1 FROM workcv_orders o
              WHERE o.draft_id = d.id
                AND o.amount_cents > 0
                AND COALESCE(o.is_test, FALSE) = FALSE
            )
            AND NOT EXISTS (
              SELECT 1 FROM workcv_feedback_preferences p
              WHERE p.email_normalized = LOWER(u.email)
                AND p.feedback_opted_out_at IS NOT NULL
            )
        )
      ON CONFLICT (user_id) DO UPDATE SET
        document_id = EXCLUDED.document_id,
        status = 'sending',
        attempt_count = workcv_saved_cv_reminders.attempt_count + 1,
        last_attempt_at = NOW(),
        last_error = NULL,
        updated_at = NOW()
      WHERE workcv_saved_cv_reminders.status IN ('failed', 'sending')
        AND workcv_saved_cv_reminders.attempt_count < 3
        AND workcv_saved_cv_reminders.last_attempt_at < NOW() - INTERVAL '30 minutes'
      RETURNING user_id
    `,
    [candidate.id, candidate.email, candidate.document_id],
  );
  return result.rows.length > 0;
}

export async function runSavedCvReminders(input: { limit?: number; dryRun?: boolean }) {
  const limit = Math.min(50, Math.max(1, Math.floor(input.limit || 20)));
  if (!savedCvReminderEnabled()) {
    return { enabled: false, eligible: 0, attempted: 0, sent: 0, failed: 0 };
  }
  const candidates = await eligibleCandidates(limit);
  if (input.dryRun) {
    return { enabled: true, eligible: candidates.length, attempted: 0, sent: 0, failed: 0 };
  }

  let attempted = 0;
  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    if (!(await claim(candidate))) continue;
    attempted += 1;
    try {
      const token = createFeedbackUnsubscribeToken(candidate.id);
      await sendSavedCvReminderEmail({
        to: candidate.email.trim().toLowerCase(),
        savedCvsUrl: `${site.url}/my-cvs`,
        unsubscribeUrl: `${site.url}/feedback/unsubscribe?token=${encodeURIComponent(token)}`,
        price: site.price,
      });
      await getPool().query(
        `UPDATE workcv_saved_cv_reminders
         SET status = 'sent', sent_at = NOW(), last_error = NULL, updated_at = NOW()
         WHERE user_id = $1`,
        [candidate.id],
      );
      sent += 1;
    } catch (error) {
      await getPool().query(
        `UPDATE workcv_saved_cv_reminders
         SET status = 'failed', last_error = $2, updated_at = NOW()
         WHERE user_id = $1`,
        [candidate.id, safeError(error)],
      );
      failed += 1;
    }
  }
  return { enabled: true, eligible: candidates.length, attempted, sent, failed };
}
