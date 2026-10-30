export const agentDiscoveryLinks = [
  `</llms.txt>; rel="alternate"; type="text/plain"`,
  `</agent-markdown>; rel="alternate"; type="text/markdown"`,
  `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  `</auth.md>; rel="service-doc"; type="text/markdown"`,
  `</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"`,
];

export const agentDiscoveryLinkHeader = agentDiscoveryLinks.join(", ");
