export type PaymentState = "checking" | "paid" | "pending" | "cancelled" | "failed";

export type PaymentStatusResult = {
  paid: boolean;
  status?: "pending" | "cancelled" | "failed";
};

export async function pollPaymentStatus(
  check: () => Promise<PaymentStatusResult>,
  options: {
    maxDurationMs?: number;
    delaysMs?: number[];
    sleep?: (milliseconds: number) => Promise<void>;
    onPending?: () => void;
  } = {},
): Promise<PaymentState> {
  const maxDurationMs = options.maxDurationMs ?? 25_000;
  const delays = options.delaysMs ?? [750, 1_250, 2_000, 3_000, 4_000, 5_000];
  const sleep =
    options.sleep ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  let attempt = 0;
  let elapsed = 0;

  while (elapsed <= maxDurationMs) {
    const result = await check();
    if (result.paid) return "paid";
    if (result.status === "cancelled" || result.status === "failed") {
      return result.status;
    }
    options.onPending?.();
    const remaining = maxDurationMs - elapsed;
    if (remaining <= 0) break;
    const delay = delays[Math.min(attempt, delays.length - 1)];
    attempt += 1;
    const wait = Math.min(delay, remaining);
    await sleep(wait);
    elapsed += wait;
  }

  return "pending";
}
