import { readFile } from "node:fs/promises";
import path from "node:path";

// Serve the dependency's module unchanged. Next 14's asset minifier treats an
// imported .mjs worker as classic JavaScript and rejects its import.meta/export.
// This route is generated at build time; no document or user input is accepted.
export const dynamic = "force-static";
export async function GET() {
  const worker = await readFile(path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"), "utf8");
  return new Response(worker, { headers: {
    "Content-Type": "text/javascript; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  } });
}
