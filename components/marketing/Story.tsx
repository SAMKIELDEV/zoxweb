import { cn } from "@/lib/cn";
import { JOBS, PROBLEM, SOLUTION, TRUST, HOW_IT_WORKS_ID, type Job } from "./content";
import { JobIllustration, ProblemArt } from "./Illustrations";
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

/**
 * Where each card sits in the bento, a 3 by 3 grid from 1024px. The first
 * is the largest (brief 05) and takes two by two; the last runs two wide
 * along the bottom, so no two rows are alike.
 */
const BENTO = ["md:col-span-2 lg:row-span-2", "", "", "", "lg:col-span-2"] as const;

function JobCard({ job, index }: { job: Job; index: number }) {
  const large = index === 0;
  return (
    <li
      className={cn(
        "flex flex-col justify-between gap-6 rounded-lg border border-line bg-card p-6 shadow-card",
        large && "lg:p-9",
        BENTO[index],
      )}
    >
      <JobIllustration art={job.art} className={large ? "max-w-80" : "max-w-40"} />
      <div>
        <h3 className={cn("mb-2 font-display font-semibold text-ink", large ? "text-xl" : "text-lead")}>
          {job.title}
        </h3>
        <p className={cn("text-ink-2", large ? "max-w-100 text-lead" : "text-copy")}>{job.body}</p>
      </div>
    </li>
  );
}

/** Brief 05: five jobs, one chat. The nav and the hero jump here. */
export function Solution() {
  return (
    <section id={HOW_IT_WORKS_ID} aria-labelledby="solution-heading" className="scroll-mt-24 bg-band">
      <div className={cn(container, "py-20 lg:py-28")}>
        <div className="mb-12 max-w-150">
          <SectionTitle id="solution-heading" lines={SOLUTION.heading} className="mb-4" />
          <p className="text-lead text-ink-2">{SOLUTION.subtitle}</p>
        </div>
        <ul role="list" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job, index) => (
            <JobCard key={job.title} job={job} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
