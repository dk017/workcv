import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    openapi: "3.1.0",
    info: {
      title: "WorkCV public discovery endpoints",
      version: "1.0.0",
      description:
        "Public metadata endpoints for WorkCV agent discovery. WorkCV does not currently expose a third-party CV creation API.",
    },
    servers: [{ url: site.url }],
    paths: {
      "/api/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "Service health status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      service: { type: "string" },
                    },
                    required: ["status", "service"],
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          summary: "API catalog",
          responses: {
            "200": {
              description: "RFC 9727-style linkset catalog",
              content: {
                "application/linkset+json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/.well-known/agent-skills/index.json": {
        get: {
          summary: "Agent skills discovery index",
          responses: {
            "200": {
              description: "Agent skills index",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
    },
  });
}
