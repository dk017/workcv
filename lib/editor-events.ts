export const editorEventNames = [
  "editor_viewed",
  "import_started",
  "import_succeeded",
  "import_failed",
  "section_completed",
  "progress_milestone",
  "preview_ready",
  "save_failed",
  "save_retried",
  "template_chooser_opened",
  "template_selected",
  "final_review_opened",
  "checkout_sheet_opened",
  "checkout_consent_accepted",
  "pdf_clicked",
  "pdf_generation_retried",
  "pdf_generation_failed",
  "docx_clicked",
  "docx_generation_failed",
  "cover_letter_opened",
  "cover_letter_copied",
  "cover_letter_download_clicked",
  "cover_letter_generation_failed",
  "cover_letter_pack_imported",
  "cv_purpose_selected",
  "cv_application_volume_selected",
  "cv_purpose_dismissed",
  "ai_suggestion_generated",
  "ai_suggestion_applied",
  "ai_suggestion_rejected",
  "skill_suggestions_opened",
  "job_tailoring_saved",
  "mobile_view_changed",
  "checkout_opened",
  "payment_started",
  "payment_pending",
  "payment_failed",
  "payment_cancelled",
] as const;

// Optional post-download question. Answers are fixed choices only, so no
// free text or personal details can reach analytics.
export const cvPurposeOptions = [
  ["new_job", "Looking for a new job"],
  ["redundancy", "I’ve been made redundant"],
  ["first_job", "First job, student or graduate"],
  ["career_change", "Changing career"],
  ["returning", "Returning after a break"],
  ["moving_uk", "New to working in the UK"],
  ["leaving_builder", "Moving from another CV builder"],
  ["other", "Something else"],
] as const;

export const applicationVolumeOptions = [
  ["one_or_two", "1–2 jobs"],
  ["three_to_ten", "3–10 jobs"],
  ["more_than_ten", "More than 10 jobs"],
] as const;

const surveyAnswers: Partial<Record<string, { key: string; values: ReadonlySet<string> }>> = {
  cv_purpose_selected: { key: "purpose", values: new Set(cvPurposeOptions.map(([value]) => value)) },
  cv_application_volume_selected: { key: "volume", values: new Set(applicationVolumeOptions.map(([value]) => value)) },
  cv_purpose_dismissed: { key: "", values: new Set() },
};

// Returns the only metadata stored for survey events, or null if the answer is
// not one of the fixed choices. Other events pass through unchanged.
export function surveyEventMetadata(
  eventName: string,
  metadata: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> | null {
  const rule = surveyAnswers[eventName];
  if (!rule) return metadata;
  if (!rule.key) return {};
  const value = metadata[rule.key];
  return typeof value === "string" && rule.values.has(value) ? { [rule.key]: value } : null;
}

export const historicalEditorEventNames = ["cv_created"] as const;

export type EditorEventName = (typeof editorEventNames)[number];

const editorEventSet = new Set<string>(editorEventNames);

export function isAllowedClientEditorEvent(value: unknown): value is EditorEventName {
  return typeof value === "string" && editorEventSet.has(value);
}

export function trackEditorEvent(
  eventName: EditorEventName,
  documentId?: string | null,
  metadata: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  void fetch("/api/events/editor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, documentId, metadata }),
    keepalive: true,
  }).catch(() => undefined);
}
