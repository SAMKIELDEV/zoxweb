import { cn } from "@/lib/cn";
import { PROBLEM, TRUST } from "./content";
import { ProblemArt } from "./Illustrations";
import { Reveal } from "./Reveal";
import { SectionTitle, container } from "./Section";

/**
 * Brief 03: one number, treated as a signature. An oversized serif figure
 * with its line beside it (below it on a phone), a hairline rule that draws
 * in once, and who makes Zox. No cards, no logo wall, no other stats.
 */
export function Trust() {
  return (
    <section aria-label="Who uses Zox">
      <Reveal className={cn(container, "py-16 lg:py-24")}>
        <p className="flex flex-col gap-2 md:flex-row md:items-end md:gap-8">
          <span className="font-display text-signature font-semibold text-accent-ink tabular-nums">{TRUST.count}</span>
          <span className="max-w-110 pb-1 font-display text-title text-ink md:pb-3">{TRUST.line}</span>
        </p>
        {/* The section's one animation: the rule draws in from the left. */}
        <span
          aria-hidden="true"
          className="mt-8 block h-px w-full origin-left bg-line transition-transform duration-1000 ease-zox group-data-[reveal=ready]/reveal:scale-x-0"
        />
        <p className="mt-4 text-note text-ink-2">{TRUST.maker}</p>
      </Reveal>
    </section>
  );
}

/** Brief 04: the evening this replaces. */
export function Problem() {
  return (
    <section aria-labelledby="problem-heading">
      <div className={cn(container, "grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28")}>
        <div>
          {/* Two lines at every width, as the brief caps it. */}
          <SectionTitle id="problem-heading" lines={PROBLEM.heading} className="mb-5" fit />
          <p className="max-w-120 text-lead text-ink-2">{PROBLEM.body}</p>
        </div>
        <Reveal threshold={0.5} className="mx-auto w-full max-w-120">
          <ProblemArt />
        </Reveal>
      </div>
    </section>
  );
}
