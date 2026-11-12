import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Wallet } from "@/lib/api/types";
import { formatCount, formatWhenInline, parseTimestamp } from "@/lib/format";

const DAY_MS = 86_400_000;

/** Free credits are replaced, not stacked, 24 hours after the last grant. */
export function nextFreeRefill(wallet: Wallet): Date | null {
  const last = parseTimestamp(wallet.last_free_grant_at);
  return last ? new Date(last.getTime() + DAY_MS) : null;
}

/** One plain line saying what the balance is made of. */
function breakdown(wallet: Wallet): string {
  const free = Math.min(wallet.free_credits, wallet.credits);
  const kept = Math.max(0, wallet.credits - free);

  if (wallet.credits <= 0) {
    const refill = nextFreeRefill(wallet);
    return refill ? `You're out for now. Free credits come back ${formatWhenInline(refill)}.` : "You're out for now.";
  }
  if (kept === 0) return "These are today's free credits. Top up for credits that don't run out.";
  if (free === 0) return "These are yours to keep. Today's free credits are used up.";
  return `${formatCount(free)} free today, ${formatCount(kept)} to keep.`;
}

/**
 * The focal point of Home: how many credits there are, in large serif
 * type on the page itself (never inside a card), with the one primary
 * action beside it.
 */
export function BalanceHero({ wallet }: { wallet: Wallet }) {
  return (
    <section aria-labelledby="balance-heading" className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 id="balance-heading" className="sr-only">
          Credit balance
        </h2>
        <p className="flex items-baseline gap-3">
          <span data-testid="balance" data-value={wallet.credits}>
            <AnimatedNumber value={wallet.credits} className="font-display text-3xl font-semibold tracking-tight text-ink" />
          </span>
          <span className="text-base text-ink-2">{wallet.credits === 1 ? "credit" : "credits"}</span>
        </p>
        <p className="mt-4 max-w-[52ch] text-base text-ink-2">{breakdown(wallet)}</p>
      </div>
      <ButtonLink href="/dashboard/billing" variant="primary" className="w-full shrink-0 md:w-auto">
        Top up
      </ButtonLink>
    </section>
  );
}

export function BalanceHeroSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Skeleton className="h-16 w-44" />
        <Skeleton className="mt-4 h-6 w-64 max-w-full" />
      </div>
      <Skeleton className="h-11 w-full rounded-md md:w-24" />
    </div>
  );
}
