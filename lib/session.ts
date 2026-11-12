/**
 * What the dashboard can tell about a SAMKIEL ID session without asking
 * anyone: the names of the two cookies, and the address people reach this
 * site at. No browser or Node APIs in here, so the request proxy, server
 * components and route handlers can all use it.
 *
 * Sign-in is SAMKIEL ID's, the same way kiv does it. A person signs in at
 * accounts.samkiel.tech, and SAMKIEL ID sets both cookies for every
 * samkiel.tech site at once. See lib/server.ts for how they are used.
 */

/** A signed token that lasts 15 minutes. The backend checks it on every call. */
export const ACCESS_COOKIE = "sk_access_token";
/** Lasts 30 days and is swapped for a new pair each time it is used. */
export const REFRESH_COOKIE = "sk_refresh_token";

interface CookieJar {
  get(name: string): { value: string } | undefined;
}

/**
 * True when the request carries either cookie. This is only a first look:
 * it keeps signed-out visitors off the signed-in pages. Whether the session
 * is still good is decided by the backend, which asks SAMKIEL ID.
 * The refresh cookie alone counts, because the access cookie leaves the
 * browser after 15 minutes and the first request renews it.
 */
export function hasSessionCookie(cookies: CookieJar): boolean {
  return Boolean(cookies.get(ACCESS_COOKIE)?.value || cookies.get(REFRESH_COOKIE)?.value);
}

const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

/** True for a Host header that names this machine. */
export function isLocalHost(host: string | null | undefined): boolean {
  return LOCAL_HOST.test(host ?? "");
}

/**
 * The address people use to reach this site, with no trailing slash.
 * APP_ORIGIN, when set, is the configured public origin and wins. Without
 * it, the Host header is the address the browser connected to. Pass the
 * protocol when the caller knows it; otherwise only this machine is taken
 * to be plain http.
 */
export function publicOrigin(host: string | null | undefined, protocol?: string | null): string {
  const configured = process.env.APP_ORIGIN;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through to the request's own host.
    }
  }
  const name = host || "localhost";
  const scheme = protocol ? protocol.replace(/:$/, "") : isLocalHost(name) ? "http" : "https";
  return `${scheme}://${name}`;
}
