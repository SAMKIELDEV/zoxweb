import { Skeleton } from "@/components/ui/Skeleton";
import type { Account, Wallet } from "@/lib/api/types";
import { formatPhone, formatWhen, tierLabel } from "@/lib/format";
import { nextFreeRefill } from "./BalanceHero";

/**
 * The quiet facts beside the activity list: which plan, which WhatsApp
 * number, and when free credits come back. Rows and hairlines, not cards.
 */
export function HomeDetails({ account, wallet }: { account: Account; wallet: Wallet }) {
  const refill = nextFreeRefill(wallet);
  const rows: { label: string; value: string }[] = [
    { label: "Plan", value: tierLabel(account.tier) },
    { label: "WhatsApp", value: formatPhone(account.whatsapp_number) },
  ];
  if (refill) rows.push({ label: "Free credits refill", value: formatWhen(refill) });

  return (
    <section aria-labelledby="home-details-heading">
      <h2 id="home-details-heading" className="mb-4 text-lg font-semibold text-ink">
        Account
      </h2>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="text-sm text-ink-2">{row.label}</dt>
            <dd className="min-w-0 truncate text-right text-sm tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function HomeDetailsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-7 w-24" />
      <ul className="divide-y divide-line border-y border-line">
        {[0, 1, 2].map((index) => (
          <li key={index} className="flex items-center justify-between gap-4 py-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
          </li>
        ))}
      </ul>
    </div>
  );
}
