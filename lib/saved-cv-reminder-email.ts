import { getEmailTransporter, getTransactionalEmailIdentity } from "@/lib/email";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendSavedCvReminderEmail(input: {
  to: string;
  savedCvsUrl: string;
  unsubscribeUrl: string;
  price: string;
}) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    throw new Error("SMTP is not configured for saved CV reminders");
  }

  const { from, replyTo } = getTransactionalEmailIdentity();
  const safeSavedCvsUrl = escapeHtml(input.savedCvsUrl);
  const safeUnsubscribeUrl = escapeHtml(input.unsubscribeUrl);
  const safePrice = escapeHtml(input.price);
  await transporter.sendMail({
    from,
    replyTo,
    to: input.to,
    subject: "Your WorkCV draft is still saved",
    text: [
      "Your WorkCV draft is still saved in your account.",
      "",
      "You can return whenever you are ready to review or continue editing it:",
      input.savedCvsUrl,
      "",
      `Building and previewing are free. A finished saved CV PDF costs ${input.price} once, with no subscription or automatic renewal.`,
      "",
      "This is a one-time saved-draft reminder. There is no deadline or expiring price.",
      `To opt out of future WorkCV research or saved-draft emails: ${input.unsubscribeUrl}`,
      "",
      "WorkCV",
      "contact@workcv.co.uk",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17202a;max-width:620px">
        <h1 style="color:#0f2942;font-size:24px">Your WorkCV draft is still saved</h1>
        <p>You can return whenever you are ready to review or continue editing it.</p>
        <p><a href="${safeSavedCvsUrl}" style="display:inline-block;background:#0f2942;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold">Open my saved CV</a></p>
        <p>Building and previewing are free. A finished saved CV PDF costs <strong>${safePrice} once</strong>, with no subscription or automatic renewal.</p>
        <p>This is a one-time saved-draft reminder. There is no deadline or expiring price.</p>
        <p><a href="${safeUnsubscribeUrl}">Opt out of future WorkCV research or saved-draft emails</a></p>
        <p>WorkCV<br>contact@workcv.co.uk</p>
      </div>
    `,
  });
}
