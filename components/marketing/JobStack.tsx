"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { HOW_IT_WORKS_ID, JOBS, SOLUTION } from "./content";
import { JobArt } from "./JobArt";
import { motionAllowed } from "./Reveal";
import { container, headingTracking } from "./Section";

/** A card counts as active once it is within this share of its height of its pinned place. */
const ACTIVE_WITHIN = 0.35;

/**
 * Section 05, the five jobs, as sticky stacking cards (DESIGN.md, "05 Five
 * jobs"). Each card pins under the navbar, 14px lower than the one before,
 * and slides up over it as the page scrolls; the covered cards scale to
 * 0.96 and dim. Native scrolling only.
 *
 * The sticky layout is CSS (`.job-stack`, `.job-card` in globals.css) and
 * applies only with script and motion allowed. This component reads the
 * scroll (passive, one requestAnimationFrame per frame) to work out which
 * card is active, and sets two attributes when that changes:
 * `data-covered` on the cards under it, and `data-reveal="shown"` on a
 * card's illustration the first time its card is active, which plays it
 * once. React does not re-render on scroll.
 *
 * Without script, or with reduced motion, it is a plain list: no sticky,
 * no transforms, every illustration in its final state.
 */
export function JobStack() {
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const items = cards.current.filter((item): item is HTMLLIElement => item !== null);
    if (items.length === 0) return;
    if (!motionAllowed()) {
      items.forEach((item) => item.querySelector("[data-reveal]")?.setAttribute("data-reveal", "shown"));
      return;
    }

    let frame = 0;
    let current = -1;
    // Where each card pins (its computed sticky top), read again only on resize.
    let pins: number[] = [];
    const measure = () => {
      pins = items.map((item) => parseFloat(getComputedStyle(item).top) || 0);
    };
    const update = () => {
      frame = 0;
      let active = -1;
      items.forEach((item, index) => {
        const box = item.getBoundingClientRect();
        if (box.top <= (pins[index] ?? 0) + box.height * ACTIVE_WITHIN) active = index;
      });
      if (active === current) return;
      current = active;
      items.forEach((item, index) => {
        item.dataset.covered = String(index < active);
        if (index <= active) item.querySelector('[data-reveal="pending"]')?.setAttribute("data-reveal", "shown");
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id={HOW_IT_WORKS_ID} aria-labelledby="solution-heading" className="scroll-mt-24">
      <div className={cn(container, "py-20 lg:py-28")}>
        <div className="mb-10 max-w-150 md:mb-14">
          <h2 id="solution-heading" className={cn("font-display text-title font-semibold text-ink", headingTracking)}>
            {SOLUTION.heading.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index < SOLUTION.heading.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-lead text-ink-2">{SOLUTION.subtitle}</p>
        </div>

        <ol role="list" className="job-stack">
          {JOBS.map((job, index) => (
            <li
              key={job.art}
              ref={(element) => {
                cards.current[index] = element;
              }}
              data-covered="false"
              style={{ ["--job-index" as string]: index }}
              className="job-card group/stack"
            >
              <article
                aria-labelledby={`job-${job.art}`}
                className={cn(
                  "group/card relative grid h-full origin-top grid-rows-[auto_1fr] gap-6 rounded-lg border border-line bg-surface p-5 shadow-soft [overflow:clip]",
                  "transition-transform duration-(--dur-slow) ease-zox group-data-[covered=true]/stack:scale-[0.96]",
                  "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:gap-10 md:p-8 lg:p-10",
                )}
              >
                <div className="md:flex md:flex-col md:justify-center">
                  <p className="font-display text-lead font-semibold text-accent-ink tabular-nums" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 id={`job-${job.art}`} className={cn("mt-1 font-display text-point font-semibold text-ink md:text-xl", headingTracking)}>
                    {job.title}
                  </h3>
                  <p className="mt-2 max-w-100 text-copy text-ink-2 md:text-lead">{job.body}</p>
                </div>

                {/* The illustration plays once, the first time its card is the active one. */}
                <div data-reveal="pending" className="flex min-h-0 items-center justify-center rounded-md bg-paper p-4 md:p-8">
                  <JobArt art={job.art} className="max-h-full w-full max-w-110" />
                </div>

                {/* The dim on a covered card: a paper layer fading in, so nothing behind shows through. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-paper opacity-0 transition-opacity duration-(--dur-slow) ease-zox group-data-[covered=true]/stack:opacity-55"
                />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
