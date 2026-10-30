"use client";

import { useEffect, useState } from "react";

import { TrackedLink } from "@/components/tracked-link";
import { analyticsPlacements } from "@/lib/analytics-placements";

// Phone-only "Build my CV free" bar. It appears once the hero buttons scroll away and hides
// again before the closing call to action, so it never sits over the footer.
export function StickyStartBar({ href, heroId, endId }: { href: string; heroId: string; endId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById(heroId);
      const end = document.getElementById(endId);
      if (!hero || !end) return;
      setVisible(hero.getBoundingClientRect().bottom < 0 && end.getBoundingClientRect().top > window.innerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [heroId, endId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pb-4 pt-3 shadow-[0_-8px_24px_rgba(15,41,66,0.08)] transition-transform duration-200 md:hidden ${visible ? "translate-y-0" : "pointer-events-none translate-y-[calc(100%+2rem)]"}`}
      aria-hidden={!visible}
    >
      <TrackedLink
        href={href}
        placement={analyticsPlacements.homeStickyEditor}
        className="flex min-h-[52px] items-center justify-center rounded-lg bg-navy font-bold text-white"
        tabIndex={visible ? undefined : -1}
      >
        Build my CV free
      </TrackedLink>
    </div>
  );
}
