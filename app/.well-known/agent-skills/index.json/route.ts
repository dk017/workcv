import { createHash } from "node:crypto";

import { createCvSkillMarkdown } from "@/lib/agent-discovery";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const skillUrl = `${site.url}/agent-skills/create-uk-cv.md`;
  const digest = createHash("sha256").update(createCvSkillMarkdown).digest("hex");

  return Response.json({
    $schema:
      "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/agent-skills-index.schema.json",
    publisher: {
      name: site.name,
      url: site.url,
    },
    skills: [
      {
        name: "create-uk-cv",
        type: "browser",
        description:
          "Create, edit, preview and download a UK CV through the WorkCV website flow.",
        url: skillUrl,
        sha256: digest,
      },
    ],
  });
}
