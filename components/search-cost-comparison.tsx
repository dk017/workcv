"use client";
import { useState } from "react";
import { competitorPlans, costOverDays, formatMinor } from "@/lib/competitor-plans";
import { site } from "@/lib/site";
import { WORKCV_PASS } from "@/lib/commerce";

export function SearchCostComparison({ brandKey }: { brandKey: "liveCareer" | "myPerfectCv" }) {
 const [days,setDays] = useState(90);
 const plan = competitorPlans[brandKey];
 const total = costOverDays(plan.trial, days);
 return <section className="space-y-5 rounded-xl border border-line bg-paper p-5 md:p-8" aria-labelledby="duration-heading">
  <h2 id="duration-heading" className="font-display text-3xl font-semibold">What would access cost over your job search?</h2>
  <fieldset><legend className="mb-3">Compare the trial-to-renewal path if left active</legend><div className="flex gap-3">{[30,60,90].map(value => <label key={value} className="flex min-h-11 items-center gap-2 rounded border border-line-strong bg-white px-3"><input type="radio" name="comparison-days" checked={days===value} onChange={()=>setDays(value)}/>{value} days</label>)}</div></fieldset>
  <div role="status" className="space-y-3"><p className="text-lg"><strong>{plan.brand}: {formatMinor(total,"GBP")}</strong> · WorkCV Pass: <strong>{site.passPrice}</strong></p>
  {total < WORKCV_PASS.amountMinor ? <p>The {plan.brand} trial path costs less over {days} days. Compare the features and the number of separate versions you need before choosing.</p> : <p>WorkCV Pass costs {formatMinor(total - WORKCV_PASS.amountMinor,"GBP")} less over this period under these assumptions. The products have different features.</p>}</div>
  <p className="text-sm leading-7">Assumes purchase on day 0, no cancellation, refunds or promotions, and charges strictly before the selected period ends. Four weeks means 28 days. Annual plans are separate. A single WorkCV saved pair costs {site.price} and can be edited again; it is a different scope from Pass.</p>
  <p className="text-sm leading-7">Published UK trial pricing checked {plan.checked}. <a className="font-bold underline" href={plan.pricingSource} target="_blank" rel="noopener noreferrer">Check {plan.brand}'s current pricing</a>.</p>
 </section>;
}
