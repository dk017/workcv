import { createCvSkillMarkdown } from "@/lib/agent-discovery";

export const dynamic = "force-static";

export function GET() {
  return new Response(createCvSkillMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
