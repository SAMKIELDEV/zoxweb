"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { UsageDay } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { creditCount, formatCount, requestCount } from "@/lib/format";
import { duration, ease, reducedFade } from "@/lib/motion";
import { axisDays, busiestDay, formatDay, formatDayLong, sumDays } from "@/lib/usage";

/** The tallest bar fills this share of the plot, leaving room for its label above. */
const HEADROOM = 0.86;
/** The draw-in is spread over at most this long, however many days there are. */
const DRAW_SPREAD = 0.36;
/** How many dates the axis shows at most. */
const AXIS_LABELS = 5;

const plotHeight = "h-44 md:h-56";

/** Gaps shrink as the days grow, so 90 bars still fit a phone. */
function gapFor(days: number): string {
  if (days > 45) return "gap-px";
  if (days > 20) return "gap-0.5 md:gap-1";
  return "gap-1.5 md:gap-3";
}

/**
 * Credits used per day, oldest on the left, as flat terracotta bars
 * (DESIGN.md section 6: no gradients, no glow, direct labels). The
 * busiest day and today carry their numbers; hovering any day shows its
 * own. The drawing is for sighted readers: assistive tech gets a summary
 * and a table of the same numbers instead.
 *
 * It draws in once, the first time it renders with data. Polling and a
 * change of period after that redraw it without motion.
 */
export function DailyChart({ days, label }: { days: UsageDay[]; label: string }) {
  const reduced = useReducedMotion();
  // True for the first render only. A bar reads `initial` when it mounts,
  // so bars that mount later (a new day, another period) appear drawn.
  const [animate, setAnimate] = useState(true);
  useEffect(() => setAnimate(false), []);

  const max = Math.max(1, ...days.map((day) => day.credits));
  const peak = busiestDay(days);
  const lastIndex = days.length - 1;
  const peakIndex = peak ? days.indexOf(peak) : -1;
  // Today's number is left off when it would crowd the busiest day's.
  const todayLabelled = lastIndex >= 0 && days[lastIndex].credits > 0 && lastIndex - peakIndex > 2;
  const marks = axisDays(days.length, AXIS_LABELS);
  const totals = sumDays(days);
  const step = days.length > 1 ? DRAW_SPREAD / (days.length - 1) : 0;

  return (
    <figure>
      <figcaption className="sr-only">
        {label}: {creditCount(totals.credits)} over {requestCount(totals.requests)}.
        {peak ? ` Busiest day ${formatDayLong(peak.date)}, ${creditCount(peak.credits)}.` : ""}
      </figcaption>

      <div aria-hidden="true">
        <div className={cn("flex items-end border-b border-line", plotHeight, gapFor(days.length))}>
          {days.map((day, index) => {
            const height = (day.credits / max) * HEADROOM * 100;
            const labelled = index === peakIndex || (index === lastIndex && todayLabelled);
            return (
              <div key={day.date} className="group relative flex h-full min-w-0 flex-1 items-end justify-center">
                {day.credits > 0 ? (
                  <motion.div
                    className="w-full max-w-10 origin-bottom rounded-t-sm bg-accent"
                    // The height is data, not a design value, so it is set inline.
                    style={{ height: `${height}%` }}
                    initial={animate ? (reduced ? { opacity: 0 } : { scaleY: 0 }) : false}
                    animate={reduced ? { opacity: 1 } : { scaleY: 1 }}
                    transition={reduced ? reducedFade : { duration: duration.slow, ease, delay: index * step }}
                  />
                ) : (
                  <div className="h-0.5 w-full max-w-10 rounded-full bg-wash" />
                )}
                {labelled ? (
                  <span
                    className="absolute text-xs font-medium whitespace-nowrap text-ink tabular-nums"
                    style={{ bottom: `calc(${height}% + 6px)` }}
                  >
                    {formatCount(day.credits)}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "pointer-events-none absolute z-10 rounded-sm border border-line bg-surface px-2 py-1 text-xs whitespace-nowrap text-ink shadow-soft",
                    "opacity-0 transition-opacity duration-(--dur-fast) ease-zox group-hover:opacity-100",
                    index < days.length / 2 ? "left-0" : "right-0",
                  )}
                  style={{ bottom: `calc(${Math.max(height, 0)}% + 6px)` }}
                >
                  {formatDay(day.date)}: {creditCount(day.credits)}
                </span>
              </div>
            );
          })}
        </div>

        <div className={cn("mt-2 flex", gapFor(days.length))}>
          {days.map((day, index) => (
            <div key={day.date} className="relative h-5 min-w-0 flex-1">
              {marks.has(index) ? (
                <span
                  className={cn(
                    "absolute top-0 text-xs whitespace-nowrap text-ink-2 tabular-nums",
                    index === 0 ? "left-0" : index === lastIndex ? "right-0" : "left-1/2 -translate-x-1/2",
                  )}
                >
                  {index === lastIndex ? "Today" : formatDay(day.date)}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Credits</th>
            <th scope="col">Requests</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{formatDayLong(day.date)}</th>
              <td>{formatCount(day.credits)}</td>
              <td>{formatCount(day.requests)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Loading placeholder: the plot and its axis, the same height as the real chart. */
export function DailyChartSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className={cn("w-full rounded-md", plotHeight)} />
      <Skeleton className="mt-2 h-lh w-full text-xs" />
    </div>
  );
}
