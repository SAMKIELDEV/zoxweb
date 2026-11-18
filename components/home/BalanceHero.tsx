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

/** How the balance splits: today's free credits and purchased credits that carry over. */
export function splitBalance(wallet: Wallet): { free: number; purchased: number } {
  const free = Math.min(wallet.free_credits, wallet.credits);
  return { free: Math.max(0, free), purchased: Math.max(0, wallet.credits - free) };
}

/** One plain line saying what the balance is made of, when it is one kind or none. */
function breakdown(wallet: Wallet): string {
  const { free, purchased } = splitBalance(wallet);

  if (wallet.credits <= 0) {
    const refill = nextFreeRefill(wallet);
    return refill ? `You're out for now. Free credits come back ${formatWhenInline(refill)}.` : "You're out for now.";
  }
  if (purchased === 0) return "These are today's free credits. Top up for credits that carry over.";
  if (free === 0) return "These are yours to keep. Today's free credits are used up.";
  return `${formatCount(free)} free today, ${formatCount(purchased)} purchased.`;
}

/** No backend threshold exists. This UI-only threshold only changes Top up emphasis. */
export const LOW_BALANCE_CREDITS = 10;

/** One accessible balance value, then the daily and purchased breakdown in words. */
export function BalanceHero({ wallet }: { wallet: Wallet }) {
  const parts = splitBalance(wallet);
  const refill = nextFreeRefill(wallet);
  const low = wallet.credits <= LOW_BALANCE_CREDITS;

  return (
    <section aria-labelledby="balance-heading" className="flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 id="balance-heading" className="text-sm font-medium text-ink-2">Wallet</h2>
        <ButtonLink href="/dashboard/billing" variant={low ? "primary" : "secondary"}>Top up</ButtonLink>
      </div>
      <p data-testid="balance" data-value={wallet.credits} className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink tabular-nums" aria-label={`${formatCount(wallet.credits)} ${wallet.credits === 1 ? "credit" : "credits"} available`}>
        {formatCount(wallet.credits)} <span className="text-xl">{wallet.credits === 1 ? "credit" : "credits"} available</span>
      </p>
      <div className="mt-5 space-y-2 text-sm text-ink-2">
        <p><span className="tabular-nums text-ink">{formatCount(parts.free)}</span> free {parts.free === 1 ? "credit" : "credits"} left today{refill ? ` · Refills ${formatWhenInline(refill)}` : " · Refill time unavailable"}</p>
        <p><span className="tabular-nums text-ink">{formatCount(parts.purchased)}</span> purchased {parts.purchased === 1 ? "credit" : "credits"} that carry over</p>
        {wallet.credits <= 0 ? <p className="text-ink">{breakdown(wallet)}</p> : null}
      </div>
    </section>
  );
}

export function BalanceHeroSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-lg border border-line bg-surface p-6">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="mt-5 h-11 w-72 max-w-full" />
      <Skeleton className="mt-5 h-lh w-full text-sm" />
      <Skeleton className="mt-2 h-lh w-64 max-w-full text-sm" />
    </div>
  );
}
