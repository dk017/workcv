import crypto from "crypto";

type PdfRenderClaims = {
  documentId: string;
  userId: string;
  expiresAt: number;
};

function secret() {
  const value = process.env.AUTH_SESSION_SECRET;
  if (!value) throw new Error("AUTH_SESSION_SECRET is required for PDF rendering");
  return value;
}

export function createPdfRenderToken(claims: Omit<PdfRenderClaims, "expiresAt">) {
  const payload = Buffer.from(
    JSON.stringify({ ...claims, expiresAt: Date.now() + 60_000 }),
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyPdfRenderToken(token: string | undefined): PdfRenderClaims | null {
  if (!token) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as PdfRenderClaims;
    if (!claims.documentId || !claims.userId || claims.expiresAt < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}
