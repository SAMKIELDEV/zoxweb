import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { CREDIT_PACKAGES, formatUsdShort } from "@/lib/pricing";
import { START_CHAT } from "@/lib/site";
import { Eyebrow, SectionTitle, container } from "./Section";

/**
 * A short look at what credits cost. Every name, credit count and price
 * comes from lib/pricing.ts, the constants shared with Billing and checked
 * against the backend. Nothing here is typed in by hand.
 */
export function PricingTeaser() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="border-t border-line">
      <div className={cn(container, "py-20 text-center")}>
        <Eyebrow>Pricing</Eyebrow>
        <SectionTitle id="pricing-heading" lines={["Free to try.", "Pay only for what you use."]} className="mb-4" />
        <p className="mx-auto mb-9 max-w-115 text-base text-ink-2">
          Zox runs on a simple credit system — buy a pack when you need it, use credits across everything Zox does. No
          monthly bills. No expiry.
        </p>

        <ul role="list" className="mb-8 inline-flex flex-wrap justify-center gap-4">
          {CREDIT_PACKAGES.map((pack) => (
            <li key={pack.id} className="min-w-30 rounded-lg border border-line bg-card px-6 py-5 shadow-card">
              <p className="mb-1.5 text-micro font-semibold tracking-widest text-ink-2 uppercase">{pack.name}</p>
              <p className="font-display text-figure font-semibold tabular-nums text-ink">{formatCount(pack.credits)}</p>
              <p className="mb-2 text-xs text-ink-2">credits</p>
              {/* accent-ink, not accent: at this size the lighter terracotta fails contrast on a white card. */}
              <p className="font-display text-lg leading-normal font-semibold text-accent-ink">{formatUsdShort(pack.amountUsd)}</p>
            </li>
          ))}
        </ul>

        <div>
          <ButtonLink href={START_CHAT.href} external={START_CHAT.external} variant="primary">
            Start for free
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
