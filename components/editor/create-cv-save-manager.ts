"use client";

import type { CvData } from "@/lib/editor-data";
import {
  DebouncedSaveManager,
  SaveConflictError,
  type SaveSnapshot,
} from "@/lib/save-manager";

export function createCvSaveManager(
  document: { id: string; data: CvData; updatedAt: string },
  onSnapshot: (snapshot: SaveSnapshot) => void,
) {
  const manager = new DebouncedSaveManager(
    document.data,
    document.updatedAt,
    async (nextCv, expectedUpdatedAt, options) => {
      const response = await fetch("/api/cv/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: document.id,
          data: nextCv,
          expectedUpdatedAt,
        }),
        keepalive: options?.keepalive,
      });
      const data = (await response.json().catch(() => null)) as
        | { document?: { updatedAt?: string }; error?: string }
        | null;
      if (response.status === 409) throw new SaveConflictError(data?.error);
      if (!response.ok || !data?.document?.updatedAt) {
        throw new Error(data?.error || "Your changes could not be saved.");
      }
      return { updatedAt: data.document.updatedAt };
    },
  );
  manager.subscribe(onSnapshot);
  return manager;
}
