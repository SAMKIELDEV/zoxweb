import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CREDIT_COSTS } from "@/lib/costs";
import { FREE_DAILY_CREDITS } from "@/lib/pricing";
import { PRICING_TEASER } from "./content";
import { PriceRows } from "./PriceRows";
import { Reveal } from "./Reveal";
import { SectionTitle, container } from "./Section";

/** What a plain chat costs at least, in credits (lib/costs.ts: "From 1 credit"). */
const CHAT_CREDITS = 1;

/** The tool costs strip: the five everyday tools, their cost read from lib/costs.ts. */
const STRIP: { label: string; from: string }[] = [
  { label: "Chat", from: "Chat" },
  { label: "Search", from: "Web search" },
  { label: "Image", from: "Image reading" },
  { label: "PDF", from: "PDF reading" },
  { label: "YouTube", from: "YouTube summary" },
];
const TOOL_COSTS = STRIP.flatMap(({ label, from }) => {
  const credits = CREDIT_COSTS.find((cost) => cost.label === from)?.cost.match(/\d+/)?.[0];
  return credits ? [{ label, credits }] : [];
});

/**
 * Brief 06, as a split: the heading, the two lines and "See pricing" on the
 * left; on the right, a quiet list of rows (Free, then each pack, with its
 * credits and its price in the visitor's currency, the same prices checkout
 * charges) and a strip of what each tool costs. No cards, no "popular" tier.
 * The rows reveal once with a 50ms stagger.
 */
export function PricingTeaser() {
  const chats = Math.floor(FREE_DAILY_CREDITS / CHAT_CREDITS);

  return (
    <section aria-labelledby="pricing-heading" className="border-t border-line">
      <div className={cn(container, "grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28")}>
        <div className="max-w-130">
          <SectionTitle id="pricing-heading" lines={[PRICING_TEASER.heading]} className="mb-6" />
          <p className="mb-4 text-lead text-ink">{PRICING_TEASER.allowance(chats)}</p>
          <p className="mb-8 text-lead text-ink-2">{PRICING_TEASER.more}</p>
          <ButtonLink href="/pricing" variant="secondary" size="lg" shape="pill">
            {PRICING_TEASER.button}
          </ButtonLink>
        </div>

        <Reveal>
          <PriceRows />
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-note text-ink-2">
            {TOOL_COSTS.map((tool) => (
              <span key={tool.label}>
                {tool.label} <span className="font-medium text-ink tabular-nums">{tool.credits}</span>
              </span>
            ))}
            <span>credits each</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
