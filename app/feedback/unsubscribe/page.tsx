import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback email preferences",
  robots: { index: false, follow: false },
};

export default function FeedbackUnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string; status?: string };
}) {
  const status = searchParams.status;
  const token = searchParams.token || "";

  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-xl rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy">
            WorkCV research emails
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-navy">
            Feedback email preferences
          </h1>

          {status === "success" ? (
            <p className="mt-5 leading-7 text-muted">
              You have been opted out. WorkCV will not send you further product
              research emails.
            </p>
          ) : status === "invalid" || !token ? (
            <p className="mt-5 leading-7 text-muted">
              This opt-out link is invalid. Email contact@workcv.co.uk and we
              will update your preference manually.
            </p>
          ) : (
            <>
              <p className="mt-5 leading-7 text-muted">
                Confirm that you do not want to receive future WorkCV product
                research emails. This does not affect essential account,
                payment, security, or support messages.
              </p>
              <form
                action="/api/feedback/unsubscribe"
                method="post"
                className="mt-7"
              >
                <input type="hidden" name="token" value={token} />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-md bg-navy px-6 text-sm font-bold text-white"
                >
                  Opt out of research emails
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
