"use client";

import { NotLinked } from "@/components/account/NotLinked";
import { pageBlocks } from "@/components/shell/layout";
import { nextFreeRefill, splitBalance } from "@/components/home/BalanceHero";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import type { Account, Wallet } from "@/lib/api/types";
import { formatCount, formatWhenInline, tierLabel } from "@/lib/format";
import { TopUp, TopUpSkeleton } from "./TopUp";
import { TransactionList, TransactionListSkeleton } from "./TransactionList";

const sectionHeading = "mb-6 text-lg font-semibold text-ink";

/**
 * Billing, in each of its states:
 * - loading: skeletons in the final layout
 * - failed: one line and a retry
 * - not linked: credits belong to a WhatsApp number, so the way forward
 *   is linking one; prices are not fetched
 * - linked: the balance, the packages with the order summary beside them,
 *   then past purchases
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
          className="border-y border-line"
        />
      );
    }
    return (
      <LoadingRegion label="Loading billing" className={pageBlocks}>
        <div>
          <Skeleton className="h-11 w-40" />
          <Skeleton className="mt-2 h-lh w-28 text-base" />
        </div>
        <div>
          <Skeleton className="mb-6 h-lh w-24 text-lg" />
          <TopUpSkeleton />
        </div>
        <TransactionListSkeleton />
      </LoadingRegion>
    );
  }

  if (!snapshot.linked) {
    return <NotLinked body="Credits belong to a WhatsApp number. Link yours, then come back to top up." />;
  }

  const { wallet, account, transactions } = snapshot;

  return (
    <div className={pageBlocks}>
      <Balance wallet={wallet} account={account} />
      <section aria-labelledby="top-up-heading">
        <h2 id="top-up-heading" className={sectionHeading}>
          Top up
        </h2>
        <TopUp currentTier={account.tier} />
      </section>
      <TransactionList transactions={transactions} />
    </div>
  );
}

/** The balance as type on the page, smaller than Home's hero, and the plan it sits on. */
function Balance({ wallet, account }: { wallet: Wallet; account: Account }) {
  const parts = splitBalance(wallet);
  const refill = nextFreeRefill(wallet);
  return (
    <section aria-labelledby="billing-balance-heading">
      <h2 id="billing-balance-heading" className="text-sm font-medium text-ink-2">Wallet</h2>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink tabular-nums" data-testid="billing-balance" data-value={wallet.credits} aria-label={`${formatCount(wallet.credits)} ${wallet.credits === 1 ? "credit" : "credits"} available`}>
        {formatCount(wallet.credits)} <span className="text-xl">{wallet.credits === 1 ? "credit" : "credits"} available</span>
      </p>
      <p className="mt-3 text-sm text-ink-2">
        <span className="tabular-nums text-ink">{formatCount(parts.free)}</span> free {parts.free === 1 ? "credit" : "credits"} left today{refill ? ` · Refills ${formatWhenInline(refill)}` : " · Refill time unavailable"}
      </p>
      <p className="mt-1 text-sm text-ink-2">
        <span className="tabular-nums text-ink">{formatCount(parts.purchased)}</span> purchased {parts.purchased === 1 ? "credit" : "credits"} that carry over · {tierLabel(account.tier)} plan
      </p>
    </section>
  );
}
