import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Wallet } from "@/lib/api/types";
import { formatCount, formatWhenInline, parseTimestamp } from "@/lib/format";

const DAY_MS = 86_400_000;

/** Free credits are replaced, not stacked, 24 hours after the last grant. */
export function nextFreeRefill(wallet: Wallet): Date | null {
  const last = parseTimestamp(wallet.last_free_grant_at);
  return last ? new Date(last.getTime() + DAY_MS) : null;
}

/** How the balance splits: today's free credits, and the ones that stay. */
function split(wallet: Wallet): { free: number; kept: number } {
  const free = Math.min(wallet.free_credits, wallet.credits);
  return { free: Math.max(0, free), kept: Math.max(0, wallet.credits - free) };
}

/** One plain line saying what the balance is made of, when it is one kind or none. */
function breakdown(wallet: Wallet): string {
  const { free, kept } = split(wallet);

  if (wallet.credits <= 0) {
    const refill = nextFreeRefill(wallet);
    return refill ? `You're out for now. Free credits come back ${formatWhenInline(refill)}.` : "You're out for now.";
  }
  if (kept === 0) return "These are today's free credits. Top up for credits that don't run out.";
  if (free === 0) return "These are yours to keep. Today's free credits are used up.";
  return `${formatCount(free)} free today, ${formatCount(kept)} to keep.`;
}

const label = "text-sm font-medium text-ink-2";
const kept = "bg-accent";
const free = "bg-ink-3";

/**
 * The focal point of Home: how many credits there are, in large serif
 * type, then a thin bar and a key for what they are made of (today's free
 * credits, and the ones to keep). It sits in Home's top band beside the
 * 14-day chart. Home's one primary action, "Top up", is in the page
 * header (TopUpAction).
 */
export function BalanceHero({ wallet }: { wallet: Wallet }) {
  const parts = split(wallet);
  const mixed = parts.free > 0 && parts.kept > 0;

  return (
    <section aria-labelledby="balance-heading" className="flex min-w-0 flex-col">
      <h2 id="balance-heading" className={label}>
        Balance
      </h2>
      <p className="mt-3 flex items-baseline gap-3">
        <span data-testid="balance" data-value={wallet.credits}>
          <AnimatedNumber value={wallet.credits} className="font-display text-3xl font-semibold tracking-tight text-ink" />
        </span>
        <span className="text-base text-ink-2">{wallet.credits === 1 ? "credit" : "credits"}</span>
      </p>

      {wallet.credits > 0 ? (
        // The key below says the same in words, so the bar is decoration.
        <div aria-hidden="true" className="mt-5 flex h-1.5 gap-0.5">
          {parts.free > 0 ? (
            <span className={`min-w-1.5 basis-0 rounded-full ${free}`} style={{ flexGrow: parts.free }} />
          ) : null}
          {parts.kept > 0 ? (
            <span className={`min-w-1.5 basis-0 rounded-full ${kept}`} style={{ flexGrow: parts.kept }} />
          ) : null}
        </div>
      ) : null}

      {mixed ? (
        <ul role="list" className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 rounded-full ${free}`} />
            <span>
              <span className="text-ink tabular-nums">{formatCount(parts.free)}</span> free today
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 rounded-full ${kept}`} />
            <span>
              <span className="text-ink tabular-nums">{formatCount(parts.kept)}</span> to keep
            </span>
          </li>
        </ul>
      ) : (
        <p className="mt-3 max-w-[52ch] text-sm text-ink-2">{breakdown(wallet)}</p>
      )}
    </section>
  );
}

export function BalanceHeroSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-lh w-20 text-sm" />
      <Skeleton className="mt-3 h-16 w-44" />
      <Skeleton className="mt-5 h-1.5 w-full rounded-full" />
      <Skeleton className="mt-3 h-lh w-48 max-w-full text-sm" />
    </div>
  );
}
