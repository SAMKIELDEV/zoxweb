import { request } from "./client";
import type { LinkChallenge, Snapshot, UsagePeriod, UsageSeries } from "./types";

export const ACCOUNT_KEY = "/api/account";

/** The one snapshot every page reads: identity, wallet, usage, purchases. */
export function getAccount(): Promise<Snapshot> {
  return request<Snapshot>(ACCOUNT_KEY);
}

/** Issues a four-letter link code. A new code invalidates the previous one. */
export function createLinkCode(): Promise<LinkChallenge> {
  return request<LinkChallenge>("/api/account/link-code", { method: "POST" });
}

/**
 * Disconnects the WhatsApp number from this SAMKIEL ID. Credits, plan and
 * chats stay with the number. 409 means it was not linked any more.
 */
export function unlinkWhatsApp(): Promise<{ linked: false }> {
  return request<{ linked: false }>("/api/account/unlink", { method: "POST" });
}

/** The usage charts' key: the period and the visitor's time zone, so "a day" is their day. */
export function usageKey(days: UsagePeriod, timeZone: string): string {
  return `${ACCOUNT_KEY}/usage?${new URLSearchParams({ days: String(days), tz: timeZone })}`;
}

/** Credits and requests per day, and per tool, over the period in the key. */
export function getUsage(key: string): Promise<UsageSeries> {
  return request<UsageSeries>(key);
}
