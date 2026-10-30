import { createHash, timingSafeEqual } from "node:crypto";

export type McpConfig = {
  enabled?: string;
  tokenHash?: string;
  userId?: string;
  expiresAt?: string;
};

// Operator-provisioned, single-account pilot credential. Never reuse a browser session.
export function authenticateMcp(header: string | null, config: McpConfig, now = Date.now()) {
  if (config.enabled !== "true") return null;
  if (!config.userId || !/^[a-zA-Z0-9_-]{1,100}$/.test(config.userId)) return null;
  if (!config.tokenHash || !/^[a-f0-9]{64}$/.test(config.tokenHash)) return null;
  const expiry = Date.parse(config.expiresAt || "");
  if (!Number.isFinite(expiry) || expiry <= now) return null;
  const match = header?.match(/^Bearer ([A-Za-z0-9_-]{43,128})$/);
  if (!match) return null;
  const actual = createHash("sha256").update(match[1]).digest();
  return timingSafeEqual(actual, Buffer.from(config.tokenHash, "hex")) ? config.userId : null;
}
