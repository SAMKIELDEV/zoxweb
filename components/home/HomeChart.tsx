"use client";

import { DailyChart, DailyChartSkeleton } from "@/components/account/DailyChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useUsageSeries } from "@/hooks/useUsageSeries";
import { creditCount } from "@/lib/format";
import { sumDays } from "@/lib/usage";

/** Home's chart always covers two weeks. Usage has the longer periods. */
const HOME_DAYS = 14;

/** Matches the "Balance" label beside it in the top band. */
const heading = "text-sm font-medium text-ink-2";

/**
 * Credits used per day over the last 14 days, beside the balance in
 * Home's top band. Its own states, separate from the page's: loading,
 * failed (one line and a retry), nothing used in the period, and the chart.
 */
export function HomeChart() {
  const { series, error, isValidating, refresh } = useUsageSeries(HOME_DAYS, true);

  if (!series) {
    if (error && error.status !== 401) {
      return (
        <section aria-labelledby="home-chart-heading" className="min-w-0">
          <h2 id="home-chart-heading" className={`mb-4 ${heading}`}>
            Last 14 days
          </h2>
          <ErrorState
            message="Couldn't load your last two weeks. Try again."
            onRetry={() => void refresh()}
            retryLabel={isValidating ? "Trying again" : "Try again"}
          />
        </section>
      );
    }
    return <HomeChartSkeleton />;
  }

  const { credits } = sumDays(series.daily);

  return (
    <section aria-labelledby="home-chart-heading" className="min-w-0">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="home-chart-heading" className={heading}>
          Last 14 days
        </h2>
        <p className="text-sm tabular-nums text-ink-2">{credits > 0 ? `${creditCount(credits)} used` : null}</p>
      </div>
      {credits > 0 ? (
        <DailyChart days={series.daily} label="Credits used per day, last 14 days" size="compact" />
      ) : (
        <EmptyState message="No credits used in the last two weeks." />
      )}
    </section>
  );
}

export function HomeChartSkeleton() {
  return (
    <div aria-hidden="true" className="min-w-0">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Skeleton className="h-lh w-24 text-sm" />
        <Skeleton className="h-lh w-20 text-sm" />
      </div>
      <DailyChartSkeleton size="compact" />
    </div>
  );
}
