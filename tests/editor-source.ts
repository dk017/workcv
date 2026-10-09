import { readFileSync } from "node:fs";

// The CV editor screen, its state hook and its dialogs, read together so source checks
// keep working however the editor is split across files.
export const editorSourceFiles = [
  "components/cv-editor.tsx",
  "components/editor/use-cv-editor.ts",
  "components/editor/editor-modals.tsx",
];

export function readEditorSource() {
  return editorSourceFiles.map((file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8")).join("\n");
}
