import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { PricingTable, type PricingRow } from "@/components/marketing/PricingTable";
import { Prose } from "@/components/marketing/Prose";
import { container, headingTracking } from "@/components/marketing/Section";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CREDIT_COSTS } from "@/lib/costs";
import { formatMoney } from "@/lib/format";
import { CREDIT_PACKAGES, FREE_DAILY_CREDITS } from "@/lib/pricing";
import { CURRENCY_COOKIE, getPublicPricing, initialCurrency } from "@/lib/publicPricing";
import { OPEN_GRAPH_IMAGE, SITE_NAME, START_CHAT, TWITTER_IMAGE } from "@/lib/site";

const title = "Pricing";
const description = "Free credits every day. Buy a pack when you need more. No subscription, and bought credits never expire.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: { type: "website", url: "/pricing", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** One price per credit when every pack shares it ("USD 0.05"), else null. */
function pricePerCredit(packs: readonly PricingRow[]): string | null {
  const each = new Set(packs.map((pack) => (Number(pack.amountUsd) / pack.credits).toFixed(4)));
  return each.size === 1 ? formatMoney(Number([...each][0]), "USD") : null;
}

/**
 * Pricing. Rendered per visit because the currency shown first depends on
 * the visitor (their saved choice, else their country). The prices come
 * from the backend's public endpoint, cached for 5 minutes. If it cannot be
 * reached, the dollar prices still show from lib/pricing.ts, which is
 * checked against the backend, and the page says naira is unavailable.
 */
export default async function PricingPage() {
  const [pricing, cookieStore, headerStore] = await Promise.all([getPublicPricing(), cookies(), headers()]);
  const packs: PricingRow[] = pricing?.packages ?? CREDIT_PACKAGES.map((pack) => ({ ...pack, amountNgn: null }));
  const freeDaily = pricing?.freeDailyCredits ?? FREE_DAILY_CREDITS;
  const perCredit = pricePerCredit(packs);

  return (
    <div className={cn(container, "py-12 md:py-16")}>
      <header className="mb-10 max-w-[68ch]">
        <h1 className={cn("font-display text-title font-semibold text-ink", headingTracking)}>{title}</h1>
        <p className="mt-3 text-base text-ink-2">
          {freeDaily} free credits every day. When you need more, buy a pack. No subscription, and credits you buy never
          expire.
        </p>
      </header>

      <section aria-labelledby="packs-heading" className="max-w-[68ch]">
        <h2 id="packs-heading" className="sr-only">
          Credit packs
        </h2>
        {packs.length > 0 ? (
          <PricingTable
            packs={packs}
            freeDailyCredits={freeDaily}
            initialCurrency={initialCurrency(cookieStore.get(CURRENCY_COOKIE)?.value, headerStore.get("x-vercel-ip-country"))}
            checkout={pricing?.checkout ?? { NGN: true, USD: true }}
          />
        ) : (
          <p className="text-base text-ink-2">No packs to show right now. Your free daily credits still work.</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={START_CHAT.href} external={START_CHAT.external} variant="primary">
            Start for free
          </ButtonLink>
          {packs.length > 0 ? (
            <ButtonLink href="/dashboard/billing" variant="secondary">
              Buy credits
            </ButtonLink>
          ) : null}
        </div>
      </section>

      <Prose className="mt-16">
        <h2 id="what-a-credit-is">What a credit is</h2>
        <p>
          A credit is what Zox charges for one piece of work.
          {perCredit ? ` Every pack works out at ${perCredit} a credit.` : null} Your free credits are used first, and they
          refill every 24 hours rather than adding up. Credits you buy stay until you use them, and buying a pack moves
          your plan up to that pack.
        </p>

        <h2 id="what-things-cost">What things cost</h2>
        <ul>
          {CREDIT_COSTS.map((row) => (
            <li key={row.label}>
              <strong>{row.label}</strong>: {row.cost}
            </li>
          ))}
        </ul>
        <p>
          A chat reply costs more when Zox reads or writes a lot: a short exchange is usually 1 or 2 credits. A request that
          fails is not charged. The <Link href="/guide">Guide</Link> shows what each one does, and the{" "}
          <Link href="/refunds">Refund Policy</Link> covers payments that go wrong.
        </p>
      </Prose>
    </div>
  );
}
