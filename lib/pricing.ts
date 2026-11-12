/**
 * Credit packages and the free daily grant, for pages that cannot ask the
 * backend. The public landing page has no session, so it cannot call the
 * packages endpoint; it reads its figures from here.
 *
 * These mirror the backend, which lives in its own repository: the
 * packages in its src/payments/pricing.ts and the grant in its
 * src/billing/credits.ts (INITIAL_FREE_CREDITS). The backend stays the
 * source of truth. Billing still reads live packages and prices from the
 * API and charges nothing from this file; it shares only the package ids
 * defined here. `pnpm run test:pricing` compares this file with a backend
 * checkout beside this repository and fails if they have drifted apart,
 * so change both together.
 */

/** Free credits every account gets, replaced once every 24 hours. */
export const FREE_DAILY_CREDITS = 15;

export const CREDIT_PACKAGES = [
  { id: "basic", name: "Basic", credits: 20, amountUsd: "1.00" },
  { id: "pro", name: "Pro", credits: 100, amountUsd: "5.00" },
  { id: "max", name: "Max", credits: 500, amountUsd: "25.00" },
] as const;

/** The ids of the packages that can be bought. Each is also a plan name. */
export type PackageId = (typeof CREDIT_PACKAGES)[number]["id"];

/** "$1", "$5", "$25": whole dollars with no cents, cents kept when there are any. */
export function formatUsdShort(amountUsd: string): string {
  const value = Number(amountUsd);
  if (!Number.isFinite(value)) return "";
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
}
