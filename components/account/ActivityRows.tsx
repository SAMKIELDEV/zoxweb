"use client";

import { motion, useReducedMotion } from "motion/react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Activity } from "@/lib/api/types";
import { actionLabel, creditCount, formatWhen, isoTimestamp } from "@/lib/format";
import { duration, ease, listStagger, reducedFade } from "@/lib/motion";

/**
 * The parts of a row: a name on the left, a detail beside it (under it on
 * phones), and a figure in a fixed-width column on the right. Usage's
 * breakdown uses the same three, so its columns line up with this list.
 * Change them here and both follow.
 */
export const rowLine = "flex items-baseline justify-between gap-4";
export const rowLead = "flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4";
export const rowName = "text-base text-ink";
export const rowDetail = "text-sm tabular-nums text-ink-2";
export const rowFigure = "w-24 shrink-0 text-right text-sm tabular-nums text-ink";

/**
 * Stable keys, so a new event arriving at the top animates in alone and
 * the rows already on screen stay put. The backend sends no id, so the
 * key is built from the row itself, numbered when two rows are identical.
 */
function withKeys(items: Activity[]): { key: string; item: Activity }[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const base = `${item.created_at}|${item.action_type}|${item.tokens_used}|${item.credits_charged}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { key: `${base}|${count}`, item };
  });
}

/**
 * What Zox did and what it cost, one row per event, newest first.
 * Rows are separated by hairlines only. Home shows the first five;
 * Usage shows all the backend returns.
 */
export function ActivityRows({ items }: { items: Activity[] }) {
  const reduced = useReducedMotion();
  const row = {
    hidden: { opacity: 0, y: reduced ? 0 : 6 },
    shown: { opacity: 1, y: 0, transition: reduced ? reducedFade : { duration: duration.base, ease } },
  };

  return (
    // role="list": Safari drops list semantics from a list with no markers.
    <motion.ul
      role="list"
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: reduced ? 0 : listStagger } } }}
      className="divide-y divide-line border-y border-line"
    >
      {withKeys(items).map(({ key, item }) => (
        <motion.li key={key} variants={row} className={`${rowLine} py-4`}>
          <div className={rowLead}>
            <span className={rowName}>{actionLabel(item.action_type)}</span>
            <time dateTime={isoTimestamp(item.created_at)} className={rowDetail}>
              {formatWhen(item.created_at)}
            </time>
          </div>
          <span className={rowFigure}>{item.credits_charged > 0 ? creditCount(item.credits_charged) : "Free"}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * Loading placeholder. Each row is laid out like a real one and each bar
 * is one line of the text it stands for, so a row is the same height as
 * the real thing at every width: two lines on phones, one from md.
 */
export function ActivityRowsSkeleton({ rows }: { rows: number }) {
  return (
    <ul aria-hidden="true" className="divide-y divide-line border-y border-line">
      {Array.from({ length: rows }, (_, index) => (
        <li key={index} className="flex items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-4">
            <Skeleton className="h-lh w-32 text-base" />
            <Skeleton className="h-lh w-28 text-sm" />
          </div>
          <Skeleton className="h-lh w-20 shrink-0 text-sm" />
        </li>
      ))}
    </ul>
  );
}
