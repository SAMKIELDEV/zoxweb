/**
 * The arithmetic behind the Usage page: adding up the all-time totals the
 * backend sends and shaping them into the rows of the breakdown. Nothing
 * here touches React, so each function can be tested by itself.
 */

import type { UsageTotal } from "./api/types";
import { actionLabel } from "./format";

/** The two all-time figures at the top of Usage. */
export interface UsageSums {
  credits: number;
  requests: number;
}

/** One row of the breakdown: a kind of request, or every unnamed kind together as "Other". */
export interface UsageRow {
  /** Plain name from actionLabel. Unique within a breakdown, so it also works as a key. */
  label: string;
  requests: number;
  credits: number;
  /** This row's part of all credits used, from 0 to 1. Always 0 when no credits were used. */
  share: number;
}

/** The narrowest a bar is drawn, in percent of its track. */
const MIN_BAR_PERCENT = 2;

/**
 * Counts arrive as numbers and Postgres bigints as strings. Anything that
 * is not a finite, non-negative number counts as 0.
 */
function toCount(value: number | string): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Adds up the backend's per-type totals into credits used and requests
 * made. An empty list gives 0 for both.
 */
export function sumUsage(usage: UsageTotal[]): UsageSums {
  let credits = 0;
  let requests = 0;
  for (const item of usage) {
    credits += toCount(item.credits);
    requests += toCount(item.requests);
  }
  return { credits, requests };
}

/**
 * The rows of the breakdown. Types the dashboard has no name for are merged
 * into one "Other" row. Rows are ordered by credits used (most first), then
 * by requests (most first), then by name. A row's share is its credits over
 * all credits used, or 0 when none were used.
 */
export function usageRows(usage: UsageTotal[]): UsageRow[] {
  const byLabel = new Map<string, UsageTotal[]>();
  for (const item of usage) {
    const label = actionLabel(item.action_type);
    byLabel.set(label, [...(byLabel.get(label) ?? []), item]);
  }

  const total = sumUsage(usage).credits;
  return Array.from(byLabel, ([label, items]) => {
    const { credits, requests } = sumUsage(items);
    return { label, requests, credits, share: total > 0 ? credits / total : 0 };
  }).sort((a, b) => b.credits - a.credits || b.requests - a.requests || a.label.localeCompare(b.label, "en"));
}

/**
 * How wide to draw a row's bar, as a percentage of its track. No share
 * means no bar (0). Any other share is drawn at least 2 percent wide, so a
 * small one can still be seen.
 */
export function barPercent(share: number): number {
  if (!(share > 0)) return 0;
  const percent = Math.round(share * 10_000) / 100;
  return Math.min(100, Math.max(MIN_BAR_PERCENT, percent));
}
