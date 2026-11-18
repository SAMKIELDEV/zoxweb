"use client";

import { useState } from "react";
import { DailyChart, DailyChartSkeleton } from "@/components/account/DailyChart";
import { NotLinked } from "@/components/account/NotLinked";
import { pageBlocks } from "@/components/shell/layout";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { useUsageSeries } from "@/hooks/useUsageSeries";
import type { UsagePeriod } from "@/lib/api/types";
import { creditCount, requestCount } from "@/lib/format";
import { sumDays } from "@/lib/usage";
import { ActivityList, ActivityListSkeleton } from "./ActivityList";
import { PeriodToggle, USAGE_PERIODS } from "./PeriodToggle";
import { UsageBreakdown, UsageBreakdownSkeleton } from "./UsageBreakdown";

/** The period Usage opens on. */
const DEFAULT_PERIOD: UsagePeriod = 30;

/**
 * Usage, in each of its states:
 * - loading: skeletons in the final layout
 * - failed: one line and a retry
 * - not linked: usage belongs to a WhatsApp number, so the way forward is
 *   linking one
 * - linked: one chart of credits per day over 7, 30 or 90 days, where
 *   those credits went by tool, then recent activity. The chart and the
 *   breakdown have their own loading, failed and empty states, since
 *   they come from a second request.
 * A closed account (403) renders nothing here; the shell already says why.
 */
export function UsageContent() {
  const { snapshot, error, isValidating, refresh } = useAccount();
  const [period, setPeriod] = useState<UsagePeriod>(DEFAULT_PERIOD);

  if (!snapshot) {
    if (error?.status === 403) return null;
    // 401 is already on its way to the sign-in page, so keep the skeleton.
    if (error && error.status !== 401) {
      return (
        <ErrorState
          message="Couldn't load your usage. Try again."
          onRetry={() => void refresh()}
          retryLabel={isValidating ? "Trying again" : "Try again"}
          className="border-y border-line"
        />
      );
    }
    return (
      <LoadingRegion label="Loading your usage" className={pageBlocks}>
        <ChartSectionSkeleton />
        <UsageBreakdownSkeleton />
        <ActivityListSkeleton />
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) {
    return <NotLinked body="Usage belongs to a WhatsApp number. Link yours and what you do with Zox shows up here." />;
  }

  return (
    <div className={pageBlocks}>
      <PeriodUsage period={period} onPeriod={setPeriod} />
      <ActivityList items={snapshot.recent} />
    </div>
  );
}

/** The chart and the breakdown, both over the chosen period. */
function PeriodUsage({ period, onPeriod }: { period: UsagePeriod; onPeriod: (days: UsagePeriod) => void }) {
  const { series, error, isValidating, refresh } = useUsageSeries(period, true);
  const label = USAGE_PERIODS.find((item) => item.days === period)?.label ?? `${period} days`;

  const header = (summary: string | null) => (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id="usage-chart-heading" className="text-lg font-semibold text-ink">
          Credits per day
        </h2>
        <p className="mt-1 min-h-lh text-sm tabular-nums text-ink-2">{summary}</p>
      </div>
      <PeriodToggle value={period} onChange={onPeriod} />
    </div>
  );

  if (!series) {
    if (error && error.status !== 401) {
      return (
        <section aria-labelledby="usage-chart-heading">
          {header(null)}
          <ErrorState
            message="Couldn't load this period. Try again."
            onRetry={() => void refresh()}
            retryLabel={isValidating ? "Trying again" : "Try again"}
            className="border-y border-line"
          />
        </section>
      );
    }
    return (
      <div className={pageBlocks}>
        <section aria-labelledby="usage-chart-heading">
          {header(null)}
          <DailyChartSkeleton />
        </section>
        <UsageBreakdownSkeleton />
      </div>
    );
  }

  // While another period loads, the last one stays on screen; say which.
  const shown = USAGE_PERIODS.find((item) => item.days === series.days)?.label ?? label;
  const totals = sumDays(series.daily);
  const summary = totals.requests > 0 ? `${creditCount(totals.credits)} over ${requestCount(totals.requests)}, last ${shown}` : null;

  return (
    <div className={pageBlocks}>
      <section aria-labelledby="usage-chart-heading" aria-busy={series.days !== period || undefined}>
        {header(summary)}
        {totals.requests > 0 ? (
          <DailyChart days={series.daily} label={`Credits used per day, last ${shown}`} />
        ) : (
          <EmptyState
            message={`Nothing in the last ${shown}. Send Zox a message on WhatsApp and it shows up.`}
            className="border-y border-line"
          />
        )}
      </section>
      {totals.credits > 0 ? <UsageBreakdown usage={series.byTool} period={shown} /> : null}
    </div>
  );
}

function ChartSectionSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-lh w-40 text-lg" />
          <Skeleton className="mt-1 h-lh w-56 max-w-full text-sm" />
        </div>
        <Skeleton className="h-12 w-44 rounded-md" />
      </div>
      <DailyChartSkeleton />
    </div>
  );
}
