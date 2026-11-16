import { cn } from "@/lib/cn";
import { JOBS, PROBLEM, SOLUTION, TRUST, HOW_IT_WORKS_ID, type Job } from "./content";
import { JobIllustration, ProblemArt } from "./Illustrations";
import { SectionTitle, container } from "./Section";

/** Brief 03: one number, one line. No logo wall, no testimonials. */
export function Trust() {
  return (
    <section aria-label="Who uses Zox" className="border-y border-line">
      <div className={cn(container, "flex flex-col gap-2 py-8 md:flex-row md:items-baseline md:justify-between")}>
        <p className="text-lead text-ink">
          <span className="mr-2 font-display text-figure font-semibold text-accent-ink tabular-nums">{TRUST.count}</span>
          {TRUST.line}
        </p>
        <p className="text-note text-ink-2">{TRUST.maker}</p>
      </div>
    </section>
  );
}

/** Brief 04: the evening this replaces. */
export function Problem() {
  return (
    <section aria-labelledby="problem-heading">
      <div className={cn(container, "grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28")}>
        <div>
          <SectionTitle id="problem-heading" lines={PROBLEM.heading} className="mb-5" />
          <p className="max-w-120 text-lead text-ink-2">{PROBLEM.body}</p>
        </div>
        <ProblemArt className="mx-auto max-w-120" />
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
