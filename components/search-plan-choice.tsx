"use client";
import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { WORKCV_PRICE, WORKCV_PASS } from "@/lib/commerce";
import { TrackedLink } from "@/components/tracked-link";
import { PassOfferView } from "@/components/pass-offer-view";
import { buildLoginHref } from "@/lib/safe-redirect";

export function SearchPlanChoice({ placement }: { placement: string }) {
  const [choice, setChoice] = useState("");
  return <div className="space-y-5 rounded-xl border border-line bg-white p-5 md:p-7">
    <h2 className="font-display text-2xl font-semibold text-navy">Which option fits your search?</h2>
    <fieldset><legend className="mb-3 text-sm text-muted">Optional: choose what you want to keep. No payment starts here.</legend>
      <div className="flex flex-wrap gap-2">{[["one", "One saved pair"], ["several", "Several separate pairs"], ["unsure", "Not sure yet"]].map(([value,label]) => <label key={value} className="flex min-h-11 items-center gap-2 rounded border border-line px-3 text-sm"><input type="radio" name={placement} value={value} checked={choice === value} onChange={() => setChoice(value)} />{label}</label>)}</div>
    </fieldset>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={`rounded-lg border p-4 ${choice === "one" ? "border-navy bg-paper" : "border-line"}`}>
        <h3 className="font-bold text-navy">One saved CV and letter</h3><p className="my-3 text-2xl font-bold">{site.price} once</p>
        <p className="text-sm leading-6">Edit and download that same pair again. PDF and editable Word included.</p>
        <TrackedLink href={buildLoginHref("/editor?template=classic&new=1&plan=cv")} placement={`${placement}_single`} className="mt-4 inline-flex min-h-11 items-center font-bold underline">Start with one pair</TrackedLink>
      </div>
      <PassOfferView placement={`${placement}_pass`}><div className={`h-full rounded-lg border p-4 ${choice === "several" ? "border-navy bg-paper" : "border-line"}`}>
        <h3 className="font-bold text-navy">Job Search Pass</h3><p className="my-3 text-2xl font-bold">{site.passPrice} once</p>
        <p className="text-sm leading-6">Keep separate CVs and matching letters during {site.passDays} days. Existing CVs are covered too. No renewal.</p>
        <TrackedLink href={buildLoginHref("/editor?template=classic&new=1&plan=pass")} placement={`${placement}_pass`} className="mt-4 inline-flex min-h-11 items-center font-bold underline">Start with Job Search Pass</TrackedLink>
      </div></PassOfferView>
    </div>
    <p className="text-sm leading-6">Covered documents stay editable and downloadable after the Pass ends. New CVs created afterwards need a new purchase. Build and preview free; email-code login is required to save.</p>
    <p className="text-sm leading-6" role="status">{choice === "several" ? `Three separately purchased pairs cost £${(3 * WORKCV_PRICE.amount).toFixed(2)}; four cost £${(4 * WORKCV_PRICE.amount).toFixed(2)}. Pass saves £${((4 * WORKCV_PRICE.amountMinor - WORKCV_PASS.amountMinor) / 100).toFixed(2)} versus four separate purchases. Applications do not each require a purchase.` : "You can reuse and edit one paid saved pair. Choose Pass when keeping separate versions is useful."}</p>
    <Link href="/pricing#job-search-pass" className="text-sm font-bold underline">Full plan details and terms</Link>
  </div>;
}
