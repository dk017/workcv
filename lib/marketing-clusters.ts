import clusterConfig from "./marketing-clusters-data.json";

export const marketingClusters = [
  "job-search",
  "applications",
  "career-progression",
  "employment-changes",
  "core-commercial",
  "other",
] as const;

export type MarketingCluster = (typeof marketingClusters)[number];

const exactRoutes = clusterConfig.exactRoutes as Record<string, MarketingCluster>;
const prefixRoutes = clusterConfig.prefixRoutes as Array<[string, MarketingCluster]>;

export function getMarketingCluster(pathname: string): MarketingCluster {
  const path = pathname.split("?", 1)[0] || "/";
  if (exactRoutes[path]) return exactRoutes[path];
  const prefix = prefixRoutes.find(([value]) => path.startsWith(value));
  if (prefix) return prefix[1];
  if (path === "/" || path === "/tools" || path === "/templates") return "core-commercial";
  return "other";
}
