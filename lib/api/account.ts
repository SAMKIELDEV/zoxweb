import { request } from "./client";
import type { LinkChallenge, Snapshot } from "./types";

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
