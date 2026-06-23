import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const catalog = {
    linkset: [
      {
        anchor: site.url,
        "service-doc": [
          {
            href: `${site.url}/auth.md`,
            type: "text/markdown",
          },
        ],
        "service-desc": [
          {
            href: `${site.url}/.well-known/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-meta": [
          {
            href: `${site.url}/.well-known/agent-skills/index.json`,
            type: "application/json",
          },
        ],
        status: [
          {
            href: `${site.url}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
    },
  });
}
