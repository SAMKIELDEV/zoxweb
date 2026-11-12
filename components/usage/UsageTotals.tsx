import { Skeleton } from "@/components/ui/Skeleton";
import type { UsageTotal } from "@/lib/api/types";
import { formatCount } from "@/lib/format";
import { sumUsage } from "@/lib/usage";

const row = "flex flex-wrap gap-x-12 gap-y-6 lg:gap-x-16";
const figure = "flex flex-col-reverse gap-1";
const label = "text-sm text-ink-2";
const number = "font-display text-2xl font-semibold tabular-nums text-ink";

/**
 * The two all-time figures that open Usage: credits used and requests
 * made. They are set as type on the page, never in cards. Each label
 * comes before its number in the markup and sits under it on screen.
 * The second figure drops to its own line when the two do not fit.
 */
export function UsageTotals({ usage }: { usage: UsageTotal[] }) {
  const { credits, requests } = sumUsage(usage);

  return (
    <dl className={row}>
      <div className={figure}>
        <dt className={label}>Credits used</dt>
        <dd data-testid="usage-credits" data-value={credits} className={number}>
          {formatCount(credits)}
        </dd>
      </div>
      <div className={figure}>
        <dt className={label}>Requests</dt>
        <dd data-testid="usage-requests" data-value={requests} className={number}>
          {formatCount(requests)}
        </dd>
      </div>
    </dl>
  );
}

/** Loading placeholder: two figures laid out like the real ones, number over label. */
export function UsageTotalsSkeleton() {
  return (
    <div aria-hidden="true" className={row}>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-11 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
