import type { ReactNode } from "react";
import Link from "next/link";
import { customerQuestions, customerQuestionHref, type CustomerQuestionId } from "@/lib/customer-questions";

export function CustomerQuestionNav({ ids }: { ids: CustomerQuestionId[] }) {
  return <nav aria-label="On this page" className="border-b border-line bg-white py-6"><div className="container-page max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-wide text-navy">On this page</p>
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm leading-6">{ids.map(id => <li key={id}><Link href={customerQuestionHref(id)} className="font-semibold text-navy underline underline-offset-4">{customerQuestions[id].question}</Link></li>)}</ul>
  </div></nav>;
}

export function CustomerAnswer({ questionId, children, className = "" }: {
  questionId: CustomerQuestionId;
  children: ReactNode;
  className?: string;
}) {
  const { anchor, question, answer } = customerQuestions[questionId];
  return <section id={anchor} data-customer-question={questionId} aria-labelledby={`${anchor}-heading`} className={`scroll-mt-24 space-y-5 text-base leading-8 text-ink ${className}`}>
    <h2 id={`${anchor}-heading`} className="font-display text-3xl font-semibold leading-tight text-navy md:text-4xl">{question}</h2>
    <p className="max-w-3xl text-lg leading-8 text-ink">{answer}</p>
    {children}
  </section>;
}
