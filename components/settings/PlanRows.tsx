import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import type { Tier } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { tierLabel } from "@/lib/format";

/**
 * The line under the row: how a plan changes, and the way to Billing.
 * Max is the top plan, so there the line says that instead of promising a
 * move up that cannot happen. Both versions keep the link, so the block is
 * the same height as its skeleton on every plan. The link sits on its own
 * line, 44px tall, so it is easy to tap.
 */
function PlanNote({ tier, className }: { tier?: Tier; className?: string }) {
  return (
    <div className={cn("mt-3 text-sm text-ink-2", className)}>
      <p>
        {tier === "max"
          ? "Max is the top plan. You can still top up any time."
          : "Your plan moves up when you buy a bigger package."}
      </p>
      <TextLink href="/dashboard/billing" className="inline-flex min-h-11 items-center">
        Go to Billing
      </TextLink>
    </div>
  );
}

/** Which plan the number is on. It only changes through a purchase, so the note points to Billing. */
export function PlanRows({ tier }: { tier: Tier }) {
  return (
    <section aria-labelledby="plan-heading">
      <h2 id="plan-heading" className="mb-4 text-lg font-semibold text-ink">
        Plan
      </h2>
      <dl className="border-y border-line">
        <div className="flex items-baseline justify-between gap-4 py-4">
          <dt className="shrink-0 text-sm text-ink-2">Current plan</dt>
          <dd className="text-right text-sm text-ink">{tierLabel(tier)}</dd>
        </div>
      </dl>
      <PlanNote tier={tier} />
    </section>
  );
}

/** Loading placeholder, as tall as the real block: the heading, one row, and the real note, hidden, holding its space. */
export function PlanRowsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-lh w-16 text-lg" />
      <div className="flex items-center justify-between gap-4 border-y border-line py-4">
        <Skeleton className="h-lh w-24 text-sm" />
        <Skeleton className="h-lh w-12 text-sm" />
      </div>
      <PlanNote className="invisible" />
    </div>
  );
}
