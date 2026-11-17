"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { HOW_IT_WORKS_ID, JOBS, SOLUTION, type Job } from "./content";
import { JobArt } from "./JobArt";
import { PlayOnMount, Reveal } from "./Reveal";
import { container, headingTracking } from "./Section";

/** The section title, stacked as the brief breaks it. */
function Title({ id }: { id: string }) {
  return (
    <div className="mb-12 max-w-150">
      <h2 id={id} className={cn("font-display text-title font-semibold text-ink", headingTracking)}>
        {SOLUTION.heading.map((line, index) => (
          <span key={line} className="block">
            {line}
            {index < SOLUTION.heading.length - 1 ? " " : null}
          </span>
        ))}
      </h2>
      <p className="mt-4 text-lead text-ink-2">{SOLUTION.subtitle}</p>
    </div>
  );
}

/**
 * Section 05, the five jobs: a numbered list on the left (tabs from 1024px),
 * one large panel on the right showing the chosen job, which plays its
 * illustration once. Phones get a stacked list with a small illustration
 * under each job.
 */
export function SolutionEditorial() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const job = JOBS[selected]!;

  const select = (index: number, focus = false) => {
    const next = (index + JOBS.length) % JOBS.length;
    setSelected(next);
    if (focus) tabs.current[next]?.focus();
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: JOBS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]!, true);
  };

  return (
    <section id={HOW_IT_WORKS_ID} aria-labelledby="solution-heading-b" className="scroll-mt-24">
      <div className={cn(container, "py-20 lg:py-28")}>
        <Title id="solution-heading-b" />

        {/* From 1024px: the list is a set of tabs; the panel shows the chosen job. */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div role="tablist" aria-orientation="vertical" aria-label="What Zox does" className="flex flex-col border-t border-line">
            {JOBS.map((item, index) => {
              const active = index === selected;
              return (
                <button
                  key={item.art}
                  ref={(element) => {
                    tabs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(index)}
                  onMouseEnter={() => select(index)}
                  onFocus={() => select(index)}
                  onKeyDown={(event) => onKey(event, index)}
                  className={cn(
                    "relative grid grid-cols-[3rem_1fr] gap-x-2 border-b border-line py-5 pr-4 text-left transition-colors duration-(--dur-fast) ease-zox",
                    active ? "bg-surface" : "hover:bg-surface/60",
                  )}
                >
                  {/* The edge marker on the chosen job. */}
                  <span aria-hidden="true" className={cn("absolute top-3 bottom-3 left-0 w-0.5 rounded-full bg-accent transition-opacity duration-(--dur-fast)", active ? "opacity-100" : "opacity-0")} />
                  <span className="pl-4 font-display text-lead font-semibold text-accent-ink tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-lead font-semibold text-ink">{item.title}</span>
                    <span className="mt-1 block text-copy text-ink-2">{item.body}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${selected}`}
            className="sticky top-24 self-start rounded-lg bg-surface p-10"
          >
            {/* Keyed by job: a new choice plays its illustration once. */}
            <PlayOnMount key={job.art} className="group/card">
              <JobArt art={job.art} className="mx-auto max-w-130" />
            </PlayOnMount>
            <p className="mt-8 font-display text-xl font-semibold text-ink">{job.title}</p>
            <p className="mt-2 max-w-110 text-lead text-ink-2">{job.body}</p>
          </div>
        </div>

        {/* Phones and tablets: a stacked list, each job with its own small illustration. */}
        <ol role="list" className="flex flex-col border-t border-line lg:hidden">
          {JOBS.map((item, index) => (
            <Reveal as="li" key={item.art} className="group/card grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-line py-6">
              <span className="font-display text-lead font-semibold text-accent-ink tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-lead font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-copy text-ink-2">{item.body}</p>
                <JobArt art={item.art} className="mt-5 max-w-72" />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
