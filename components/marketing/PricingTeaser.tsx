import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FREE_DAILY_CREDITS } from "@/lib/pricing";
import { PRICING_TEASER } from "./content";
import { SectionTitle, container } from "./Section";

/** What a plain chat costs at least, in credits (lib/costs.ts: "From 1 credit"). */
const CHAT_CREDITS = 1;

/**
 * Brief 06: free to start, then credits. No prices here: they live on the
 * Pricing page, which picks the currency. The allowance is worked out from
 * FREE_DAILY_CREDITS, so it follows the backend.
 */
export function PricingTeaser() {
  const chats = Math.floor(FREE_DAILY_CREDITS / CHAT_CREDITS);

  return (
    <section aria-labelledby="pricing-heading">
      <div className={cn(container, "grid gap-8 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-28")}>
        <SectionTitle id="pricing-heading" lines={[PRICING_TEASER.heading]} />
        <div className="max-w-140">
          <p className="mb-4 text-lead text-ink">{PRICING_TEASER.allowance(chats)}</p>
          <p className="mb-8 text-lead text-ink-2">{PRICING_TEASER.more}</p>
          <ButtonLink href="/pricing" variant="secondary" size="lg" shape="pill">
            {PRICING_TEASER.button}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
