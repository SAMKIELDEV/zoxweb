"use client";

import { DailyChart, DailyChartSkeleton } from "@/components/account/DailyChart";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useUsageSeries } from "@/hooks/useUsageSeries";
import { creditCount } from "@/lib/format";
import { sumDays } from "@/lib/usage";

/** Home's chart always covers two weeks. Usage has the longer periods. */
const HOME_DAYS = 14;

const heading = "text-lg font-semibold text-ink";

/**
 * Credits used per day over the last 14 days, under the balance. Its own
 * states, separate from the page's: loading, failed (one line and a
 * retry), nothing used in the period, and the chart.
 */
export function HomeChart() {
  const { series, error, isValidating, refresh } = useUsageSeries(HOME_DAYS, true);

  if (!series) {
    if (error && error.status !== 401) {
      return (
        <section aria-labelledby="home-chart-heading">
          <h2 id="home-chart-heading" className={`mb-4 ${heading}`}>
            Last 14 days
          </h2>
          <ErrorState
            message="Couldn't load your last two weeks. Try again."
            onRetry={() => void refresh()}
            retryLabel={isValidating ? "Trying again" : "Try again"}
            className="border-y border-line"
          />
        </section>
      );
    }
    return <HomeChartSkeleton />;
  }

  const { credits } = sumDays(series.daily);

  return (
    <section aria-labelledby="home-chart-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 id="home-chart-heading" className={heading}>
          Last 14 days
        </h2>
        <p className="text-sm tabular-nums text-ink-2">{credits > 0 ? `${creditCount(credits)} used` : null}</p>
      </div>
      {credits > 0 ? (
        <DailyChart days={series.daily} label="Credits used per day, last 14 days" />
      ) : (
        <EmptyState
          message="No credits used in the last two weeks."
          className="border-y border-line"
        />
      )}
    </section>
  );
}

export function HomeChartSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <Skeleton className="h-lh w-32 text-lg" />
        <Skeleton className="h-lh w-24 text-sm" />
      </div>
      <DailyChartSkeleton />
    </div>
  );
}
