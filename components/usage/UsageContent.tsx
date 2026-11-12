"use client";

import { CreditCosts } from "@/components/account/CreditCosts";
import { NotLinked } from "@/components/account/NotLinked";
import { mainColumn, pageBlocks, pageColumns } from "@/components/shell/layout";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { sumUsage } from "@/lib/usage";
import { ActivityList, ActivityListSkeleton } from "./ActivityList";
import { UsageBreakdown, UsageBreakdownSkeleton } from "./UsageBreakdown";
import { UsageTotals, UsageTotalsSkeleton } from "./UsageTotals";

const opening = "flex flex-col gap-6";

/**
 * Usage, in each of its states:
 * - loading: skeletons in the final layout
 * - failed: one line and a retry
 * - not linked: usage belongs to a WhatsApp number, so the way forward is
 *   linking one
 * - linked, nothing yet: the Activity heading over one line saying so
 * - linked: all-time totals, where the credits went, recent activity.
 *   When every request so far was free, the breakdown is left out:
 *   there are no credits to account for.
 * What each kind of request costs sits alongside in every state but the
 * failed one. Every figure is all time: the backend sends its totals with
 * no dates, so nothing here names a period.
 * A closed account (403) renders nothing here; the shell already says why.
 */
export function UsageContent() {
  const { snapshot, error, isValidating, refresh } = useAccount();

  if (!snapshot) {
    if (error?.status === 403) return null;
    // 401 is already on its way to the sign-in page, so keep the skeleton.
    if (error && error.status !== 401) {
      return (
        <ErrorState
          message="Couldn't load your usage. Try again."
          onRetry={() => void refresh()}
          retryLabel={isValidating ? "Trying again" : "Try again"}
        />
      );
    }
    return (
      <LoadingRegion label="Loading your usage" className={pageBlocks}>
        <div className={opening}>
          <Skeleton className="h-6 w-72 max-w-full" />
          <UsageTotalsSkeleton />
        </div>
        <div className={pageColumns}>
          <div className={mainColumn}>
            <UsageBreakdownSkeleton />
            <ActivityListSkeleton />
          </div>
          <CreditCosts />
        </div>
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) {
    return (
      <div className={pageColumns}>
        <NotLinked body="Usage belongs to a WhatsApp number. Link yours and what you do with Zox shows up here." />
        <CreditCosts />
      </div>
    );
  }

  const { usage, recent } = snapshot;

  // No totals yet. The backend reads totals and events separately, so a
  // first event can land with no total: ActivityList covers both cases.
  if (usage.length === 0) {
    return (
      <div className={pageColumns}>
        <ActivityList items={recent} />
        <CreditCosts />
      </div>
    );
  }

  const spentAnything = sumUsage(usage).credits > 0;

  return (
    <div className={pageBlocks}>
      <div className={opening}>
        <p className="text-base text-ink-2">All time, since you started with Zox.</p>
        <UsageTotals usage={usage} />
      </div>
      <div className={pageColumns}>
        <div className={mainColumn}>
          {spentAnything ? <UsageBreakdown usage={usage} /> : null}
          <ActivityList items={recent} />
        </div>
        <CreditCosts />
      </div>
    </div>
  );
}
