/**
 * Path rules shared by the browser client and the request proxy.
 * No browser or Node APIs in here, so it runs in both.
 */

const DASHBOARD_PATH = /^\/dashboard(\/[A-Za-z0-9_-]+)*$/;

/**
 * Where to go after sign-in. Only same-site dashboard paths are accepted,
 * so a crafted ?next= can never send someone to another site.
 */
export function safeNext(value: string | null | undefined): string | null {
  return value && DASHBOARD_PATH.test(value) ? value : null;
}

/**
 * The sign-in URL that returns to `pathname` afterwards, when that is
 * allowed. `ended` marks a session that just stopped working: the sign-in
 * page then says so and stays put, where it would otherwise pass a
 * returning visitor straight through to the dashboard.
 */
export function loginUrl(pathname: string | null | undefined, ended = false): string {
  const query = new URLSearchParams();
  const next = safeNext(pathname);
  if (next) query.set("next", next);
  if (ended) query.set("ended", "1");
  const search = query.toString();
  return search ? `/login?${search}` : "/login";
}

/** Purchase references are ULIDs; this is the same rule the backend proxy applies. */
export const TRANSACTION_ID = /^[A-Za-z0-9_-]{1,64}$/;

export const paymentStatusPath = (id: string) => `/dashboard/billing/payment/${encodeURIComponent(id)}`;

/**
 * The SAMKIEL ID account site: where people sign in, and where names,
 * emails and passwords are managed. NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL
 * points it at a local accounts site; it is the variable kiv uses.
 */
export const ACCOUNTS_URL = (process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://accounts.samkiel.tech").replace(/\/$/, "");

/**
 * SAMKIEL ID's sign-in or sign-up page, set to come back to `next` on this
 * site afterwards, or to Home. `origin` is this site's own address.
 * The accounts site only sends people back to a samkiel.tech address. From
 * any other host, such as localhost, they stay on the accounts site.
 */
export function accountsUrl(page: "login" | "register", origin: string, next?: string | null): string {
  const back = `${origin}${safeNext(next) ?? "/dashboard"}`;
  return `${ACCOUNTS_URL}/${page}?redirect=${encodeURIComponent(back)}`;
}
