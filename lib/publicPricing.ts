import { backendBase } from "@/lib/server";

/**
 * Prices for the public Pricing page, from the backend's public endpoint
 * (GET /api/public/pricing, no session). USD prices are fixed; NGN prices
 * are live estimates from today's exchange rate, and checkout quotes again
 * and charges that. Cached here for 5 minutes, as the backend caches its
 * quotes for 10, so a busy page costs one backend call per 5 minutes.
 */

export type Currency = "NGN" | "USD";

export interface PublicPack {
  id: string;
  name: string;
  credits: number;
  amountUsd: string;
  amountNgn: string | null;
}

export interface PublicPricing {
  packages: PublicPack[];
  /** Which currencies checkout can charge right now. */
  checkout: Record<Currency, boolean>;
  freeDailyCredits: number;
}

/** The cookie that remembers a visitor's currency choice on this page. */
export const CURRENCY_COOKIE = "zox-currency";

const isMoney = (value: unknown): value is string => typeof value === "string" && /^\d{1,12}(\.\d{1,2})?$/.test(value);

/** The backend's answer checked field by field, or null if it is not the shape we expect. */
function parse(body: unknown): PublicPricing | null {
  if (!body || typeof body !== "object") return null;
  // The backend's ngnUnavailable text is for operators (it can name settings), so it is not
  // read: the page has its own words for a missing naira rate.
  const { packages, checkout, freeDailyCredits } = body as Record<string, unknown>;
  if (!Array.isArray(packages) || typeof freeDailyCredits !== "number" || !checkout || typeof checkout !== "object") return null;
  const parsed: PublicPack[] = [];
  for (const pack of packages) {
    const { id, name, credits, amountUsd, amountNgn } = (pack ?? {}) as Record<string, unknown>;
    if (typeof id !== "string" || typeof name !== "string" || typeof credits !== "number" || !isMoney(amountUsd)) return null;
    parsed.push({ id, name, credits, amountUsd, amountNgn: isMoney(amountNgn) ? amountNgn : null });
  }
  const available = checkout as Record<string, unknown>;
  return {
    packages: parsed,
    checkout: { NGN: available.NGN === true, USD: available.USD === true },
    freeDailyCredits,
  };
}

/** Today's prices, or null when the backend cannot be reached or answers oddly. */
export async function getPublicPricing(): Promise<PublicPricing | null> {
  try {
    const response = await fetch(`${backendBase}/api/public/pricing`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return parse(await response.json());
  } catch {
    return null;
  }
}

/**
 * The currency to show first: the visitor's own earlier choice, else naira
 * for a visit from Nigeria (Vercel's x-vercel-ip-country), else dollars.
 * The country guess can be wrong, so the page always offers both.
 */
export function initialCurrency(saved: string | undefined, country: string | null): Currency {
  if (saved === "NGN" || saved === "USD") return saved;
  return country?.toUpperCase() === "NG" ? "NGN" : "USD";
}
