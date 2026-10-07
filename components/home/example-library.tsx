"use client";

import Image from "next/image";
import { useState } from "react";

import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";
import { homeExampleFilters, homeExamples, type HomeExampleFilter } from "@/lib/home-examples";

const chipBase = "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-bold transition";

export function ExampleLibrary() {
  const [filter, setFilter] = useState<HomeExampleFilter | null>(null);
  const shown = filter ? homeExamples.filter((example) => example.filter === filter) : homeExamples;

  return (
    <>
      <div
        role="group"
        aria-label="Filter CV examples by job type"
        className="-mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {[null, ...homeExampleFilters].map((option) => {
          const active = option === filter;
          return (
            <button
              key={option ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={`${chipBase} ${active ? "border-navy bg-navy text-white" : "border-line-strong bg-white text-navy hover:border-navy"}`}
            >
              {option ?? "All"}
            </button>
          );
        })}
      </div>
      <ul className="-mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {shown.map((example) => (
          <li key={example.href} className="w-[250px] shrink-0 snap-start sm:w-auto">
            <TrackedLink
              href={example.href}
              placement={analyticsPlacements.homeExampleCard}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:border-navy"
            >
              <span className="block h-[280px] overflow-hidden bg-sand px-[18px] pt-[18px] sm:h-[300px]">
                <Image
                  src={example.image}
                  alt={`${example.role} CV example in the ${example.template} template`}
                  width={635}
                  height={898}
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 45vw, 250px"
                  className="h-auto w-full shadow-[0_8px_24px_rgba(15,41,66,0.16)]"
                />
              </span>
              <span className="flex items-center justify-between gap-3 border-t border-line px-4 py-3.5">
                <span className="min-w-0">
                  <span className="block font-bold leading-snug text-navy">{example.role}</span>
                  <span className="text-sm text-muted">{example.sector}</span>
                </span>
                <span className="shrink-0 rounded-full bg-gold-tint px-2.5 py-1 text-xs font-bold text-navy">{example.template}</span>
              </span>
            </TrackedLink>
          </li>
        ))}
      </ul>
    </>
  );
}
