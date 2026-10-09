"use client";

import { findCvSaveIssue } from "@/lib/cv-save-validation";
import type { CvData } from "@/lib/editor-data";
import {
  DebouncedSaveManager,
  SaveConflictError,
  SaveRequestError,
  SaveValidationError,
  type SaveSnapshot,
} from "@/lib/save-manager";

// Browsers reject keepalive requests over 64KB outright, so a large CV saved
// as the tab is hidden would fail every time. Larger bodies use a normal request.
const keepaliveLimitBytes = 60_000;

export function createCvSaveManager(
  document: { id: string; data: CvData; updatedAt: string },
  onSnapshot: (snapshot: SaveSnapshot) => void,
) {
  const manager = new DebouncedSaveManager(
    document.data,
    document.updatedAt,
    async (nextCv, expectedUpdatedAt, options) => {
      const issue = findCvSaveIssue(nextCv);
      if (issue) throw new SaveValidationError(issue.message, issue.field);

      const body = JSON.stringify({
        documentId: document.id,
        data: nextCv,
        expectedUpdatedAt,
      });
      let response: Response;
      try {
        response = await fetch("/api/cv/current", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive:
            Boolean(options?.keepalive) &&
            new TextEncoder().encode(body).length <= keepaliveLimitBytes,
        });
      } catch {
        throw new SaveRequestError(
          "Not saved. Check your connection, then retry.",
          0,
        );
      }
      const data = (await response.json().catch(() => null)) as
        | { document?: { updatedAt?: string }; error?: string; code?: string; field?: string }
        | null;
      if (response.status === 409) throw new SaveConflictError(data?.error);
      if (response.status === 400 && data?.code === "INVALID_CV_DATA") {
        throw new SaveValidationError(
          data.error || "Not saved. Part of this CV could not be accepted.",
          data.field || "unknown",
        );
      }
      if (!response.ok || !data?.document?.updatedAt) {
        throw new SaveRequestError(
          data?.error || "Your changes could not be saved.",
          response.status,
        );
      }
      return { updatedAt: data.document.updatedAt };
    },
  );
  manager.subscribe(onSnapshot);
  return manager;
}
