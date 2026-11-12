/**
 * Renews the SAMKIEL ID session from the browser when its 15-minute access
 * token has run out.
 *
 * Renewals must happen one at a time. SAMKIEL ID swaps the refresh token
 * for a new one on every renewal, and if the old one reaches it a second
 * time it treats that as theft and ends the session. So:
 *  - one renewal per tab: every request that got a 401 waits on the same one;
 *  - one renewal across tabs: a browser lock makes tabs take turns, and a
 *    tab that waited sees that another has just renewed and does not repeat it.
 * The cookies are shared by all tabs, so one tab's renewal serves them all.
 * The server keeps a second guard (lib/server.ts) for what gets past this.
 */

const LOCK_NAME = "zox-session-renew";
/** Where tabs tell each other that the session was just renewed. */
const STAMP_KEY = "zox-session-renewed-at";
/** How long a renewal by another tab counts as "just now". */
const FRESH_MS = 10_000;

let inFlight: Promise<boolean> | null = null;

/**
 * Resolves true when the session is renewed and the request that failed
 * is worth sending again; false when the person has to sign in again.
 */
export function renewSession(): Promise<boolean> {
  inFlight ??= takeTurn(renewOnce).finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/** Runs `work` when no other tab is renewing. Browsers without locks just run it. */
async function takeTurn(work: () => Promise<boolean>): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.locks) {
    return await navigator.locks.request(LOCK_NAME, work);
  }
  return work();
}

async function renewOnce(): Promise<boolean> {
  if (renewedJustNow()) return true;
  try {
    const response = await fetch("/api/session/refresh", { method: "POST", cache: "no-store" });
    if (!response.ok) return false;
    markRenewed();
    return true;
  } catch {
    return false;
  }
}

function renewedJustNow(): boolean {
  try {
    const at = Number(window.localStorage.getItem(STAMP_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < FRESH_MS;
  } catch {
    // Storage can be blocked. Then every tab renews for itself, in turn.
    return false;
  }
}

function markRenewed(): void {
  try {
    window.localStorage.setItem(STAMP_KEY, String(Date.now()));
  } catch {
    // See renewedJustNow.
  }
}
