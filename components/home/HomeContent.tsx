"use client";

import { useEffect, useState } from "react";
import { LinkWhatsApp } from "@/components/account/LinkWhatsApp";
import { pageBlocks, pageColumns } from "@/components/shell/layout";
import { LoadingRegion } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { BalanceHero, BalanceHeroSkeleton } from "./BalanceHero";
import { HomeDetails, HomeDetailsSkeleton } from "./HomeDetails";
import { RecentActivity, RecentActivitySkeleton } from "./RecentActivity";

/**
 * Home, in each of its states:
 * - loading: skeletons laid out exactly like the real page
 * - failed: one line saying so, with a retry
 * - not linked: the WhatsApp link flow takes the place of the balance
 * - linked: balance, recent activity, account details
 * A closed account (403) renders nothing here; the shell already says why.
 */
export function HomeContent() {
  const { snapshot, error, isValidating, refresh } = useAccount();

  // Remember if this visit started unlinked, to confirm the link when it lands.
  const [startedUnlinked, setStartedUnlinked] = useState(false);
  useEffect(() => {
    if (snapshot && !snapshot.linked) setStartedUnlinked(true);
  }, [snapshot]);

  if (!snapshot) {
    if (error?.status === 403) return null;
    // 401 is already on its way to the sign-in page, so keep the skeleton.
    if (error && error.status !== 401) {
      return (
        <ErrorState
          message="Couldn't load your balance. Try again."
          onRetry={() => void refresh()}
          retryLabel={isValidating ? "Trying again" : "Try again"}
        />
      );
    }
    return (
      <LoadingRegion label="Loading your account" className={pageBlocks}>
        <BalanceHeroSkeleton />
        <div className={pageColumns}>
          <RecentActivitySkeleton />
          <HomeDetailsSkeleton />
        </div>
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) return <LinkWhatsApp identityId={snapshot.identity.id} />;

  return (
    <div className={pageBlocks}>
      <div className="flex flex-col gap-6">
        {startedUnlinked ? (
          <p role="status" className="text-sm text-positive">
            WhatsApp is linked. Here&apos;s your balance.
          </p>
        ) : null}
        <BalanceHero wallet={snapshot.wallet} />
      </div>
      <div className={pageColumns}>
        <RecentActivity items={snapshot.recent} />
        <HomeDetails account={snapshot.account} wallet={snapshot.wallet} />
      </div>
    </div>
  );
}
