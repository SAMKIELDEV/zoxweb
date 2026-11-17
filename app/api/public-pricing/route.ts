import { NextResponse, type NextRequest } from "next/server";
import { formatMoney } from "@/lib/format";
import { CREDIT_PACKAGES, FREE_DAILY_CREDITS } from "@/lib/pricing";
import { CURRENCY_COOKIE, getPublicPricing, initialCurrency } from "@/lib/publicPricing";

/**
 * Prices for the landing page's pricing teaser, in the visitor's currency.
 * The landing page is static, so it asks here after it loads. Same source
 * and currency rule as the Pricing page: the backend's public prices
 * (cached 5 minutes), naira for a visit from Nigeria, dollars otherwise. If
 * naira is unavailable it falls back to dollars, so a row never shows a
 * price checkout would not charge.
 */
export async function GET(request: NextRequest) {
  const pricing = await getPublicPricing();
  const packs = pricing?.packages ?? CREDIT_PACKAGES.map((pack) => ({ ...pack, amountNgn: null as string | null }));
  const wanted = initialCurrency(request.cookies.get(CURRENCY_COOKIE)?.value, request.headers.get("x-vercel-ip-country"));
  const currency = wanted === "NGN" && packs.every((pack) => pack.amountNgn !== null) ? "NGN" : "USD";
  return NextResponse.json(
    {
      currency,
      freeDailyCredits: pricing?.freeDailyCredits ?? FREE_DAILY_CREDITS,
      packages: packs.map((pack) => ({
        id: pack.id,
        name: pack.name,
        credits: pack.credits,
        price: currency === "NGN" ? formatMoney(pack.amountNgn, "NGN") : formatMoney(pack.amountUsd, "USD"),
      })),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
