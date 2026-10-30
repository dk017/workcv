import type { NextRequest } from "next/server";

import { markdownPageResponse } from "@/lib/md/http";

// Older discovery links pointed here; the homepage markdown now lives at /index.md.
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return markdownPageResponse(request, "/");
}
