"use client";

import { useEffect, useState } from "react";
import { LinkWhatsApp } from "@/components/account/LinkWhatsApp";
import { pageBlocks } from "@/components/shell/layout";
import { LoadingRegion } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { BalanceHero, BalanceHeroSkeleton } from "./BalanceHero";
import { RecentActivity, RecentActivitySkeleton } from "./RecentActivity";
import { WhatsAppCard, WhatsAppCardSkeleton } from "./WhatsAppCard";

/** How often Home refetches the balance while the tab is visible. */
const LIVE_BALANCE_MS = 5000;

/** WhatsApp and wallet: stacked on phones, paired from 1024px. */
const topBand = "grid gap-5 lg:grid-cols-2";

/**
 * Home, in each of its states:
 * - loading: skeletons laid out exactly like the real page
 * - failed: one line saying so, with a retry
 * - not linked: the WhatsApp link flow takes the place of the balance
 * - linked: WhatsApp first, then wallet, then recent activity
 * A closed account (403) renders nothing here; the shell already says why.
 */
export function HomeContent() {
  // Chats on WhatsApp spend credits while this page sits open, often with
  // the phone in hand and this tab never losing focus. So poll while the
  // tab is visible, and the balance flips down as credits are spent.
  const { snapshot, error, isValidating, refresh } = useAccount({ refreshInterval: LIVE_BALANCE_MS });

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
        <div className={topBand}><WhatsAppCardSkeleton /><BalanceHeroSkeleton /></div>
        <RecentActivitySkeleton />
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) {
    return (
      <div className="rounded-lg border border-line bg-surface p-6 md:p-8">
        <LinkWhatsApp identityId={snapshot.identity.id} />
      </div>
    );
  }

  return (
    <div className={pageBlocks}>
      <div className="flex flex-col gap-6">
        {startedUnlinked ? (
          <p role="status" className="text-sm text-positive">
            WhatsApp is linked. Here&apos;s your balance.
          </p>
        ) : null}
        <div className={topBand}><WhatsAppCard account={snapshot.account} /><BalanceHero wallet={snapshot.wallet} /></div>
      </div>
      <RecentActivity items={snapshot.recent} />
    </div>
  );
}
