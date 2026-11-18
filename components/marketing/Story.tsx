import { cn } from "@/lib/cn";
import { PROBLEM, TRUST } from "./content";
import { ProblemArt } from "./Illustrations";
import { Reveal } from "./Reveal";
import { SectionTitle, container } from "./Section";

/**
 * Brief 03: one number, treated as a signature. An oversized serif figure
 * with its line on the left, who makes Zox in a small line on the right
 * (below, on a phone), and a hairline rule under both that draws in once.
 * No cards, no logo wall, no other stats, no location.
 */
export function Trust() {
  return (
    <section aria-label="Who uses Zox">
      <Reveal className={cn(container, "py-16 lg:py-24")}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="flex flex-col gap-2 md:flex-row md:items-end md:gap-8">
            <span className="font-display text-signature font-semibold text-accent-ink tabular-nums">{TRUST.count}</span>
            <span className="max-w-110 pb-1 font-display text-title text-ink md:pb-3">{TRUST.line}</span>
          </p>
          <p className="shrink-0 text-note text-ink-2 md:pb-4">
            {TRUST.maker.prefix}{" "}
            <a
              href={TRUST.maker.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center text-ink underline decoration-line underline-offset-4 transition-colors duration-(--dur-fast) ease-zox hover:decoration-accent md:min-h-0"
            >
              {TRUST.maker.studio}
            </a>
          </p>
        </div>
        {/* The section's one animation: the rule draws in from the left. */}
        <span
          aria-hidden="true"
          className="mt-6 block h-px w-full origin-left bg-line transition-transform duration-1000 ease-zox pre-reveal:scale-x-0 md:mt-8"
        />
      </Reveal>
    </section>
  );
}

/**
 * Brief 04: the evening this replaces. The illustration is what animates,
 * so it is what the trigger watches: on a phone it sits below the text, and
 * the heading being on screen says nothing about whether the pile is.
 */
export function Problem() {
  return (
    <section aria-labelledby="problem-heading">
      <div className={cn(container, "grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28")}>
        <div>
          {/* Two lines at every width, as the brief caps it. */}
          <SectionTitle id="problem-heading" lines={PROBLEM.heading} className="mb-5" fit />
          <p className="max-w-120 text-lead text-ink-2">{PROBLEM.body}</p>
        </div>
        <Reveal amount={{ desktop: 0.6, phone: 0.6 }} className="mx-auto w-full max-w-120">
          <ProblemArt />
        </Reveal>
      </div>
    </section>
  );
}
