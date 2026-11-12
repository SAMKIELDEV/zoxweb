import { rowDetail, rowFigure, rowLead, rowLine, rowName } from "@/components/account/ActivityRows";
import { Skeleton } from "@/components/ui/Skeleton";
import type { UsageTotal } from "@/lib/api/types";
import { creditCount, requestCount } from "@/lib/format";
import { barPercent, usageRows } from "@/lib/usage";

/** How many rows the loading placeholder shows. */
const SKELETON_ROWS = 4;

/**
 * Where the credits went, all time: one row per kind of request, the
 * costliest first, each with a bar for its share of all credits used.
 * The words and numbers carry the information. The bar only repeats it,
 * so it is hidden from assistive tech. A kind that cost nothing reads
 * "Free" and has no bar. The text line is built from the same parts as a
 * row of the Activity list under it, so the columns line up.
 * Rendered only when some credits were used: with none, every row would
 * read "Free" under a heading about spending, so Usage leaves it out.
 */
export function UsageBreakdown({ usage }: { usage: UsageTotal[] }) {
  return (
    <section aria-labelledby="usage-breakdown-heading">
      <h2 id="usage-breakdown-heading" className="mb-4 text-lg font-semibold text-ink">
        Where your credits went
      </h2>
      {/* Tailwind's reset removes list markers, and Safari then stops announcing a ul as a list unless the role is set. */}
      <ul role="list" className="divide-y divide-line border-y border-line">
        {usageRows(usage).map((row) => {
          const width = barPercent(row.share);
          return (
            <li key={row.label} className="py-4">
              <div className={rowLine}>
                <div className={rowLead}>
                  <span className={rowName}>{row.label}</span>
                  <span className={rowDetail}>{requestCount(row.requests)}</span>
                </div>
                <span className={rowFigure}>{row.credits > 0 ? creditCount(row.credits) : "Free"}</span>
              </div>
              {width > 0 ? (
                <div aria-hidden="true" className="mt-3 h-2 rounded-full bg-wash">
                  {/* The width is data, not a design value, so it is set inline. */}
                  <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Loading placeholder: the heading and four rows laid out like real ones, each with its bar. */
export function UsageBreakdownSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-7 w-60 max-w-full" />
      <ul className="divide-y divide-line border-y border-line">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <li key={index} className="py-4">
            <div className="flex items-start justify-between gap-4 md:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-20 shrink-0" />
            </div>
            <Skeleton className="mt-3 h-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
