import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export function getTransactionalEmailIdentity() {
  const fromEmail = process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || "contact@workcv.co.uk";
  const fromName = process.env.AUTH_FROM_NAME || "WorkCV";

  return {
    from: `${fromName} <${fromEmail}>`,
    replyTo: process.env.AUTH_REPLY_TO_EMAIL || "contact@workcv.co.uk",
  };
}

function formatAmount(amountCents: number | null, currency: string) {
  if (amountCents === null) return null;

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency}`;
  }
}

export async function sendPurchaseConfirmationEmail(input: {
  to: string;
  orderId: string;
  amountCents: number | null;
  currency: string;
  editorUrl: string;
}) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured for purchase confirmation email");
  }

  const { from, replyTo } = getTransactionalEmailIdentity();
  const amount = formatAmount(input.amountCents, input.currency);
  const safeOrderId = escapeHtml(input.orderId);
  const safeEditorUrl = escapeHtml(input.editorUrl);
  const amountText = amount ? `Payment: ${amount}\n` : "";
  const amountHtml = amount ? `<p><strong>Payment:</strong> ${escapeHtml(amount)}</p>` : "";

  await transporter.sendMail({
    from,
    replyTo,
    to: input.to,
    subject: "Your WorkCV purchase is confirmed",
    text: [
      "Your WorkCV payment was successful.",
      "",
      amountText.trimEnd(),
      `Order reference: ${input.orderId}`,
      "",
      "Your saved CV is unlocked. You can return to the editor to download it or make further changes.",
      input.editorUrl,
      "",
      "This was a one-time payment. No subscription or automatic renewal was started.",
      "",
      "If you need help, reply to this email.",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a;max-width:600px">
        <h1 style="color:#0f2942;font-size:24px">Your WorkCV purchase is confirmed</h1>
        <p>Your payment was successful and your saved CV is now unlocked.</p>
        ${amountHtml}
        <p><strong>Order reference:</strong> ${safeOrderId}</p>
        <p>
          <a href="${safeEditorUrl}" style="display:inline-block;background:#0f2942;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold">
            Return to your CV editor
          </a>
        </p>
        <p>You can download your CV or make further changes from the editor.</p>
        <p><strong>This was a one-time payment.</strong> No subscription or automatic renewal was started.</p>
        <p>If you need help, reply to this email.</p>
      </div>
    `,
  });
}

export async function sendConversionAlertEmail(input: {
  title: string;
  category: string;
  userId: string | null;
  documentId: string | null;
  occurrenceCount: number;
  firstSeenAt: string;
  errorSummary: string;
  context: Record<string, string | number | boolean | null>;
}) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured for conversion alerts");
  }

  const { from, replyTo } = getTransactionalEmailIdentity();
  const recipient =
    process.env.CONVERSION_ALERT_EMAIL || "contact@workcv.co.uk";
  const contextEntries = Object.entries(input.context);
  const contextText = contextEntries.length
    ? contextEntries.map(([key, value]) => `${key}: ${String(value)}`).join("\n")
    : "No additional context";
  const contextHtml = contextEntries.length
    ? `<ul>${contextEntries
        .map(
          ([key, value]) =>
            `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}</li>`,
        )
        .join("")}</ul>`
    : "<p>No additional context</p>";

  await transporter.sendMail({
    from,
    replyTo,
    to: recipient,
    subject: `[WorkCV conversion alert] ${input.title}`,
    text: [
      "A potentially fatal WorkCV conversion issue was detected.",
      "",
      `Issue: ${input.title}`,
      `Category: ${input.category}`,
      `Occurrences in current window: ${input.occurrenceCount}`,
      `First seen: ${input.firstSeenAt}`,
      `User ID: ${input.userId || "Unavailable"}`,
      `Document ID: ${input.documentId || "Unavailable"}`,
      `Error: ${input.errorSummary}`,
      "",
      "Context:",
      contextText,
      "",
      "No CV content, card data, authentication codes, or secrets are included in this alert.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a;max-width:680px">
        <h1 style="color:#8d3030;font-size:24px">WorkCV conversion issue</h1>
        <p>A potentially fatal conversion issue was detected.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;font-weight:bold">Issue</td><td>${escapeHtml(input.title)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Category</td><td>${escapeHtml(input.category)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Occurrences</td><td>${input.occurrenceCount}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">First seen</td><td>${escapeHtml(input.firstSeenAt)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">User ID</td><td>${escapeHtml(input.userId || "Unavailable")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Document ID</td><td>${escapeHtml(input.documentId || "Unavailable")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Error</td><td>${escapeHtml(input.errorSummary)}</td></tr>
        </table>
        <h2 style="color:#0f2942;font-size:18px">Context</h2>
        ${contextHtml}
        <p style="color:#5f6b76;font-size:13px">No CV content, card data, authentication codes, or secrets are included in this alert.</p>
      </div>
    `,
  });
}
