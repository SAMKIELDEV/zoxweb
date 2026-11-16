/**
 * What each kind of request costs. These mirror fixed prices in the
 * backend (each tool's `creditCost` in src/tools, DOWNLOAD_CREDIT_COST in
 * src/social/types.ts, VOICE_NOTE_CREDIT_COST in src/tools/voiceNote.ts, and
 * TOKENS_PER_CREDIT in src/billing/constants.ts).
 * The API does not expose them, so change both places together.
 */
export const CREDIT_COSTS: { label: string; cost: string }[] = [
  { label: "Chat", cost: "From 1 credit" },
  { label: "Web search", cost: "2 credits" },
  { label: "Image reading", cost: "2 credits" },
  { label: "PDF reading", cost: "3 credits" },
  { label: "YouTube summary", cost: "3 credits" },
  { label: "Media download", cost: "3 credits each" },
  { label: "Image generation", cost: "3 credits" },
  { label: "Voice note", cost: "1 credit to listen, plus the reply" },
];
