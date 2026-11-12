"use client";

import { CreditCosts } from "@/components/account/CreditCosts";
import { NotLinked } from "@/components/account/NotLinked";
import { mainColumn, pageBlocks, pageColumns } from "@/components/shell/layout";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { creditCount, tierLabel } from "@/lib/format";
import { TopUp, TopUpSkeleton } from "./TopUp";
import { TransactionList, TransactionListSkeleton } from "./TransactionList";

/**
 * Billing, in each of its states:
 * - loading: skeletons in the final layout
 * - failed: one line and a retry
 * - not linked: credits belong to a WhatsApp number, so the way forward
 *   is linking one; prices are not fetched
 * - linked: balance line, top-up, purchases, with costs alongside
 * A closed account (403) renders nothing here; the shell already says why.
 */
export function BillingContent() {
  const { snapshot, error, isValidating, refresh } = useAccount();

  if (!snapshot) {
    if (error?.status === 403) return null;
    if (error && error.status !== 401) {
      return (
        <ErrorState
          message="Couldn't load your billing details. Try again."
          onRetry={() => void refresh()}
          retryLabel={isValidating ? "Trying again" : "Try again"}
        />
      );
    }
    return (
      <LoadingRegion label="Loading billing" className={pageBlocks}>
        <Skeleton className="h-6 w-72 max-w-full" />
        <div className={pageColumns}>
          <div className={mainColumn}>
            <div>
              <Skeleton className="mb-6 h-7 w-24" />
              <TopUpSkeleton />
            </div>
            <TransactionListSkeleton />
          </div>
          <CreditCosts />
        </div>
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) {
    return (
      <div className={pageColumns}>
        <NotLinked body="Credits belong to a WhatsApp number. Link yours, then come back to top up." />
        <CreditCosts />
      </div>
    );
  }

  const { wallet, account, transactions } = snapshot;

  return (
    <div className={pageBlocks}>
      <p className="text-base text-ink-2" data-testid="billing-balance">
        You have <span className="font-medium tabular-nums text-ink">{creditCount(wallet.credits)}</span> on the{" "}
        {tierLabel(account.tier)} plan.
      </p>
      <div className={pageColumns}>
        <div className={mainColumn}>
          <section aria-labelledby="top-up-heading">
            <h2 id="top-up-heading" className="mb-6 text-lg font-semibold text-ink">
              Top up
            </h2>
            <TopUp currentTier={account.tier} />
          </section>
          <TransactionList transactions={transactions} />
        </div>
        <CreditCosts />
      </div>
    </div>
  );
}
