import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { requireAppUser } from "@/lib/app-shell-data";
import { listAccountOrders, type AccountOrder } from "@/lib/cv-entitlement";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Account and orders",
  description: "Your WorkCV sign-in email, Job Search Pass and orders.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false, nocache: true },
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(value));

function formatAmount(order: AccountOrder) {
  if (order.amountMinor === null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: order.currency || "GBP" }).format(order.amountMinor / 100);
}

function orderTitle(order: AccountOrder) {
  if (order.plan === "pass") return `Job Search Pass (${site.passDays} days)`;
  return "One CV and its cover letter";
}

function orderFor(order: AccountOrder) {
  if (order.plan === "pass") return "Every CV you create while it lasts";
  if (!order.cvId) return "A CV that has since been deleted";
  // Many CVs (especially ones started as a guest) have no target role yet; name them by title instead.
  return [order.cvTargetRole || order.cvTitle || "Your saved CV", order.cvEmployer].filter(Boolean).join(" · ");
}

const card = "rounded-2xl border border-line bg-white p-5 sm:p-6";

export default async function AccountPage() {
  const { user, pass } = await requireAppUser("/account");
  const orders = await listAccountOrders(user.id);

  return (
    <AppShell email={user.email} pass={pass}>
      <div className="flex max-w-[860px] flex-col gap-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Account and orders</h1>

        <section aria-labelledby="sign-in-heading" className={card}>
          <h2 id="sign-in-heading" className="text-lg font-extrabold text-navy">Signed in as</h2>
          <p className="mt-2 break-all font-bold text-ink">{user.email}</p>
          <p className="mt-1 text-sm text-muted">You sign in with a one-time code sent to this email, so there’s no password to remember.</p>
        </section>

        <section aria-labelledby="pass-heading" className={card}>
          <h2 id="pass-heading" className="text-lg font-extrabold text-navy">Job Search Pass</h2>
          {pass.active && pass.expiresAt ? (
            <p className="mt-2 text-ink">
              Active, with <strong>{pass.daysLeft} {pass.daysLeft === 1 ? "day" : "days"}</strong> left. Every CV you create before {formatDate(pass.expiresAt)} is unlocked. It never renews.
            </p>
          ) : (
            <>
              <p className="mt-2 text-ink">You don’t have an active Pass. It gives you unlimited UK CVs and matching cover letters for {site.passDays} days, for {site.passPrice} once. Nothing renews.</p>
              <Link href="/pricing" className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-navy px-4 font-bold text-navy hover:bg-paper">Compare prices</Link>
            </>
          )}
        </section>

        <section aria-labelledby="orders-heading" className={card}>
          <h2 id="orders-heading" className="text-lg font-extrabold text-navy">Orders</h2>
          {orders.length === 0 ? (
            <p className="mt-2 text-muted">No orders yet. Building and previewing a CV is free; you pay when you download it.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 py-3.5">
                  <div className="min-w-0">
                    <p className="font-bold text-navy">{orderTitle(order)}</p>
                    <p className="text-sm text-muted">{orderFor(order)}</p>
                    {order.plan === "cv" && order.cvId && !order.refunded && (
                      <Link href={`/editor?draftId=${encodeURIComponent(order.cvId)}`} className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-navy underline">Open this CV to download it</Link>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink">{formatAmount(order)}</p>
                    <p className="text-sm text-muted">{order.refunded ? "Refunded" : "Paid"} {formatDate(order.paidAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
            For a question about a payment, read the <Link href="/refund-policy" className="font-bold text-navy underline">refund policy</Link> or <Link href="/contact" className="font-bold text-navy underline">contact us</Link>.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
