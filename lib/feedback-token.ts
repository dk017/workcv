import crypto from "node:crypto";

type FeedbackTokenPayload = {
  purpose: "feedback-unsubscribe";
  userId: string;
};

function secret() {
  const value =
    process.env.FEEDBACK_UNSUBSCRIBE_SECRET ||
    process.env.AUTH_SESSION_SECRET;
  if (!value) {
    throw new Error("A feedback unsubscribe secret is required");
  }
  return value;
}

export function createFeedbackUnsubscribeToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({
      purpose: "feedback-unsubscribe",
      userId,
    } satisfies FeedbackTokenPayload),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyFeedbackUnsubscribeToken(
  token: string | null | undefined,
) {
  if (!token || token.length > 500) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    supplied.length !== expected.length ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<FeedbackTokenPayload>;
    if (
      parsed.purpose !== "feedback-unsubscribe" ||
      typeof parsed.userId !== "string" ||
      !/^[a-zA-Z0-9_-]{12,100}$/.test(parsed.userId)
    ) {
      return null;
    }
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}
