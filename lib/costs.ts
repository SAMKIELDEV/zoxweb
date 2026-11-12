/**
 * What each kind of request costs. These mirror fixed prices in the
 * backend (each tool's `creditCost` in src/tools, DOWNLOAD_CREDIT_COST in
 * src/social/types.ts, and TOKENS_PER_CREDIT in src/billing/credits.ts).
 * The API does not expose them, so change both places together.
 */
export const CREDIT_COSTS: { label: string; cost: string }[] = [
  { label: "Chat", cost: "From 1 credit" },
  { label: "Web search", cost: "2 credits" },
  { label: "Image reading", cost: "2 credits" },
  { label: "PDF reading", cost: "3 credits" },
  { label: "YouTube summary", cost: "3 credits" },
  { label: "Media download", cost: "3 credits each" },
];
