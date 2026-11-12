import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import type { Account, Tier } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatMonthYear, formatPhone, tierLabel } from "@/lib/format";
import { UnlinkWhatsApp } from "./UnlinkWhatsApp";

/**
 * The line under the rows: how a plan changes, and the way to Billing.
 * Max is the top plan, so there the line says that instead of promising a
 * move up that cannot happen. Both versions keep the link, so the block is
 * the same height as its skeleton on every plan.
 */
function PlanNote({ tier, className }: { tier?: Tier; className?: string }) {
  return (
    <p className={cn("mt-3 text-sm text-ink-2", className)}>
      {tier === "max" ? "Max is the top plan. You can still top up any time." : "Your plan moves up when you buy a bigger package."}{" "}
      <TextLink href="/dashboard/billing">Go to Billing</TextLink>
    </p>
  );
}

/**
 * The linked WhatsApp number, the plan, and when the account began, then
 * the way to unlink the number. The plan only changes through a purchase,
 * so the line under the rows points to Billing.
 * A row with nothing to show is left out. Rendered only for a linked
 * account; until then LinkWhatsApp takes this block's place.
 */
export function WhatsAppRows({ account, onUnlinked }: { account: Account; onUnlinked: () => void }) {
  const rows = [
    { label: "Number", value: formatPhone(account.whatsapp_number) },
    { label: "Plan", value: tierLabel(account.tier) },
    { label: "Member since", value: formatMonthYear(account.created_at) },
  ].filter((row) => row.value);

  return (
    <section aria-labelledby="whatsapp-heading">
      <h2 id="whatsapp-heading" className="mb-4 text-lg font-semibold text-ink">
        WhatsApp
      </h2>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="shrink-0 text-sm text-ink-2">{row.label}</dt>
            <dd className="min-w-0 wrap-break-word text-right text-sm tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <PlanNote tier={account.tier} />
      <UnlinkWhatsApp phone={formatPhone(account.whatsapp_number) || "this number"} onUnlinked={onUnlinked} />
    </section>
  );
}

/**
 * Loading placeholder, exactly as tall as the real block with three
 * one-line rows. Each bar is one line of the text it stands for, and the
 * line under the rows is the real one, hidden, so it holds the space that
 * line takes at any width.
 */
export function WhatsAppRowsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-lh w-28 text-lg" />
      <ul className="divide-y divide-line border-y border-line">
        {[0, 1, 2].map((index) => (
          <li key={index} className="flex items-center justify-between gap-4 py-4">
            <Skeleton className="h-lh w-24 text-sm" />
            <Skeleton className="h-lh w-28 text-sm" />
          </li>
        ))}
      </ul>
      <PlanNote className="invisible" />
      {/* The unlink row: one line of text and a 44px button, as in UnlinkWhatsApp. */}
      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-lh w-64 max-w-full text-base" />
        <Skeleton className="h-11 w-full rounded-md sm:w-36" />
      </div>
    </div>
  );
}
