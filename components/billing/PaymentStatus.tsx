"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAccount } from "@/hooks/useAccount";
import { useTransactionStatus, type PurchasePhase } from "@/hooks/useTransactionStatus";
import { creditCount, formatWhen } from "@/lib/format";
import { purchaseAmount, statusWord } from "@/lib/purchases";

const BILLING = "/dashboard/billing";

interface Copy {
  heading: string;
  body: string;
}

function copyFor(phase: PurchasePhase, cancelled: boolean, credits: number | undefined): Copy {
  switch (phase) {
    case "credited":
      return {
        heading: "Your credits are ready",
        body: credits ? `${creditCount(credits)} added to your balance.` : "They've been added to your balance.",
      };
    case "review":
      return {
        heading: "We're checking this purchase",
        body: "It needs a closer look on our side. Keep the reference below, and don't pay again for the same package.",
      };
    case "unpaid":
      return {
        heading: "This payment didn't complete",
        body: "No credits were added. You can start again from Billing.",
      };
    case "refunded":
      return { heading: "This purchase was refunded", body: "Keep the reference below if you need to ask about it." };
    case "waiting":
      return {
        heading: "Still waiting on confirmation",
        body: "Some payments take a few minutes. Credits are added by themselves once it's confirmed, so it's safe to leave. If you were charged, don't pay again.",
      };
    case "not-found":
      return {
        heading: "We can't find that purchase",
        body: "It isn't on this account. Check that you're signed in with the SAMKIEL ID you paid with.",
      };
    case "error":
      return { heading: "Couldn't check this purchase", body: "Nothing has changed on your account. Try again in a moment." };
    case "confirming":
      return cancelled
        ? {
            heading: "You left before paying",
            body: "No credits were added. If you did pay, stay here and this page will catch up.",
          }
        : { heading: "Confirming your purchase", body: "This usually takes a few seconds." };
  }
}

interface PaymentStatusProps {
  /** The purchase reference from the URL. */
  id: string;
  /**
   * True when the provider's cancel link brought the person here. It only
   * changes the wording while the purchase is still pending. It is never
   * treated as proof of anything: the status still comes from the backend.
   */
  cancelled?: boolean;
}

/**
 * Where the payment provider sends people back to. It shows what the
 * backend says about one purchase and keeps checking until that settles.
 * Query parameters on the return URL are ignored, so a forged
 * "?status=succeeded" changes nothing.
 */
export function PaymentStatus({ id, cancelled = false }: PaymentStatusProps) {
  const { transaction, phase, isChecking, checkAgain } = useTransactionStatus(id);
  const { snapshot } = useAccount();
  const copy = copyFor(phase, cancelled, transaction?.credits_added);
  const balance = snapshot?.linked ? snapshot.wallet.credits : null;

  return (
    <section aria-labelledby="purchase-heading" className="max-w-160">
      {/* A polite live region: the heading changes as the purchase settles. */}
      <div role="status">
        <h2 id="purchase-heading" className="text-xl font-semibold text-ink md:text-2xl">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-[52ch] text-base text-ink-2">{copy.body}</p>
      </div>

      {phase === "credited" && balance !== null ? (
        <p className="mt-6 text-base text-ink-2">
          Your balance is now{" "}
          <span data-testid="new-balance" data-value={balance}>
            <AnimatedNumber value={balance} className="font-medium text-ink" />
          </span>{" "}
          {balance === 1 ? "credit" : "credits"}.
        </p>
      ) : null}

      <dl className="mt-10 divide-y divide-line border-y border-line">
        {transaction ? (
          <>
            <Row label="Credits" value={creditCount(transaction.credits_added)} />
            <Row label="Amount" value={purchaseAmount(transaction)} />
            <Row label="Status" value={statusWord(transaction.status)} />
            <Row label="Started" value={formatWhen(transaction.created_at)} />
          </>
        ) : phase === "confirming" ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : null}
        <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <dt className="text-sm text-ink-2">Reference</dt>
          <dd className="select-all break-all text-sm tabular-nums text-ink">{id}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {phase === "waiting" || phase === "error" ? (
          <>
            <Button variant="primary" onClick={checkAgain} busy={isChecking}>
              {isChecking ? "Checking" : phase === "error" ? "Try again" : "Check again"}
            </Button>
            <ButtonLink href={BILLING} variant="secondary">
              Back to Billing
            </ButtonLink>
          </>
        ) : phase === "unpaid" ? (
          <ButtonLink href={BILLING} variant="primary">
            Start again
          </ButtonLink>
        ) : (
          <ButtonLink href={BILLING} variant={phase === "credited" ? "primary" : "secondary"}>
            Back to Billing
          </ButtonLink>
        )}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-4">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="text-right text-sm tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div aria-hidden="true" className="flex items-center justify-between gap-4 py-4">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-28" />
    </div>
  );
}
