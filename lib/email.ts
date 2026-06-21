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
