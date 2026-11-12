import { request } from "./client";
import type { LinkChallenge, Snapshot } from "./types";

export const ACCOUNT_KEY = "/api/account";

/** The one snapshot every page reads: identity, wallet, usage, purchases. */
export function getAccount(): Promise<Snapshot> {
  return request<Snapshot>(ACCOUNT_KEY);
}

/** Issues a ZOX- code. A new code invalidates the previous one. */
export function createLinkCode(): Promise<LinkChallenge> {
  return request<LinkChallenge>("/api/account/link-code", { method: "POST" });
}
