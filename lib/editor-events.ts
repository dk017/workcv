export const editorEventNames = [
  "editor_viewed",
  "cv_created",
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
  "pdf_downloaded",
  "pdf_generation_retried",
  "pdf_generation_failed",
  "ai_suggestion_generated",
  "ai_suggestion_applied",
  "ai_suggestion_rejected",
  "skill_suggestions_opened",
  "job_tailoring_saved",
  "mobile_view_changed",
  "checkout_opened",
  "payment_started",
  "payment_pending",
  "payment_confirmed",
  "payment_failed",
  "payment_cancelled",
] as const;

export type EditorEventName = (typeof editorEventNames)[number];

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
