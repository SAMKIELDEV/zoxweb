import { request } from "./client";

/**
 * Ends the SAMKIEL ID session in this browser. Signing in is not here: it
 * happens at the accounts site (app/(auth)/login/page.tsx).
 */
export function signOut(): Promise<{ ok: true }> {
  return request<{ ok: true }>("/api/session", { method: "DELETE", redirectOn401: false });
}
