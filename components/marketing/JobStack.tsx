"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { HOW_IT_WORKS_ID, JOBS, SOLUTION } from "./content";
import { JobArt } from "./JobArt";
import { motionAllowed } from "./Reveal";
import { container, headingTracking } from "./Section";

/** A card counts as active (its illustration plays) once it has slid this far into place. */
const ACTIVE_AT = 0.65;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Section 05, the five jobs, as sticky stacking cards (DESIGN.md, "05 Five
 * jobs"). Each card pins under the navbar, 14px lower than the one before,
 * and slides up over it as the page scrolls, like a stack of paper: the
 * cards beneath shrink a little from their top edge (so their peeking edges
 * narrow) and take a shade, more the deeper they lie. Native scrolling only.
 *
 * The sticky layout is CSS (`.job-stack`, `.job-card` in globals.css) and
 * applies only with script and motion allowed. While the stack is near the
 * screen, this component reads the scroll (passive, one
 * requestAnimationFrame per frame) and sets one CSS variable per card,
 * --depth: how many cards lie on top of it, fractional while one slides
 * over. It also sets `data-reveal="shown"` on a card's illustration the
 * first time its card is in place, which plays it once. React does not
 * re-render on scroll.
 *
 * Without script, or with reduced motion, it is a plain list: no sticky,
 * no transforms, every illustration in its final state.
 */
export function JobStack() {
  const list = useRef<HTMLOListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const items = cards.current.filter((item): item is HTMLLIElement => item !== null);
    if (items.length === 0 || !list.current) return;
    if (!motionAllowed()) {
      items.forEach((item) => item.querySelector("[data-reveal]")?.setAttribute("data-reveal", "shown"));
      return;
    }

    let frame = 0;
    // Where each card pins (its computed sticky top), read again only on resize.
    let pins: number[] = [];
    const depths = items.map(() => -1);
    const measure = () => {
      pins = items.map((item) => parseFloat(getComputedStyle(item).top) || 0);
    };
    const update = () => {
      frame = 0;
      // How far each card has slid into its pinned place: 0 a card-height below it, 1 pinned.
      const placed = items.map((item, index) => {
        const box = item.getBoundingClientRect();
        return clamp01(((pins[index] ?? 0) + box.height - box.top) / box.height);
      });
      items.forEach((item, index) => {
        let depth = 0;
        for (let above = index + 1; above < items.length; above++) depth += placed[above] ?? 0;
        depth = Math.round(depth * 1000) / 1000;
        if (depth !== depths[index]) {
          depths[index] = depth;
          item.style.setProperty("--depth", String(depth));
        }
        if ((placed[index] ?? 0) >= ACTIVE_AT) item.querySelector('[data-reveal="pending"]')?.setAttribute("data-reveal", "shown");
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    // Listen to the scroll only while the stack is on or near the screen.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    };
    const near = new IntersectionObserver((entries) => listen(entries.some((entry) => entry.isIntersecting)), {
      rootMargin: "50% 0px",
    });
    near.observe(list.current);
    measure();
    update();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      near.disconnect();
      listen(false);
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

        <ol ref={list} role="list" className="job-stack">
          {JOBS.map((job, index) => (
            <li
              key={job.art}
              ref={(element) => {
                cards.current[index] = element;
              }}
              style={{ ["--job-index" as string]: index }}
              className="job-card"
            >
              <article
                aria-labelledby={`job-${job.art}`}
                className={cn(
                  "group/card relative grid h-full grid-rows-[auto_1fr] gap-6 rounded-lg border border-line bg-surface p-5 shadow-stack [overflow:clip]",
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

                {/* The shade on a card lower in the stack (its opacity follows --depth, globals.css). */}
                <span aria-hidden="true" className="job-shade pointer-events-none absolute inset-0 bg-shade opacity-0" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
