import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, isLocalHost } from "@/lib/session";

/**
 * The server side of the dashboard: the pass-through to the Zox backend,
 * and renewing or ending a SAMKIEL ID session.
 *
 * This app holds no session of its own and never sees a password. SAMKIEL
 * ID sets two httpOnly cookies for all of samkiel.tech when someone signs
 * in at accounts.samkiel.tech (lib/session.ts). Each request here reads the
 * access token from its cookie and passes it to the backend, which checks
 * it with SAMKIEL ID. Scripts in the page can read neither cookie.
 *
 * Because the cookies are sent on requests from any site, every request
 * that changes something must come from this site's own pages: see
 * validOrigin.
 */

export const idBase = (process.env.SAMKIEL_ID_URL || "https://id.samkiel.tech").replace(/\/$/, "");
export const backendBase = (process.env.ZOX_BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

/** The refresh cookie's life in seconds: 30 days, the same as SAMKIEL ID sets. */
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;
/** No real token is anywhere near this long. Longer values are not sent on. */
const MAX_TOKEN_LENGTH = 4096;

export function validOrigin(request: NextRequest): boolean {
  // Next.js may construct request.url with its bind address (0.0.0.0),
  // while browsers use localhost. Host is the browser's actual destination;
  // do not trust Origin or forwarded headers to choose the allowed origin.
  const url = new URL(request.url);
  const expected = process.env.APP_ORIGIN || `${url.protocol}//${request.headers.get("host") || url.host}`;
  return request.headers.get("origin") === new URL(expected).origin;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token stops working. */
  expiresIn: number;
}

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

/**
 * True when the cookies should be the plain kind that work on
 * http://localhost. Decided from the address the browser used, as SAMKIEL
 * ID does, with the same SK_DEV_COOKIES override.
 */
function devCookies(request: NextRequest): boolean {
  const flag = process.env.SK_DEV_COOKIES;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return isLocalHost(request.headers.get("host"));
}

/**
 * The attributes SAMKIEL ID gives its cookies, so one written here is
 * interchangeable with one it wrote: Secure, SameSite=None and shared with
 * every samkiel.tech site. On this machine: host-only, SameSite=Lax.
 * SK_COOKIE_DOMAIN overrides the domain; an empty value means host-only.
 */
function cookieBase(request: NextRequest) {
  const dev = devCookies(request);
  const domain = process.env.SK_COOKIE_DOMAIN ?? (dev ? "" : ".samkiel.tech");
  return {
    httpOnly: true,
    secure: !dev,
    sameSite: dev ? ("lax" as const) : ("none" as const),
    path: "/",
    ...(domain ? { domain } : {}),
  };
}

function setSessionCookies(response: NextResponse, request: NextRequest, tokens: Tokens): void {
  const base = cookieBase(request);
  response.cookies.set({ ...base, name: ACCESS_COOKIE, value: tokens.accessToken, maxAge: tokens.expiresIn });
  response.cookies.set({ ...base, name: REFRESH_COOKIE, value: tokens.refreshToken, maxAge: REFRESH_MAX_AGE });
}

function clearSessionCookies(response: NextResponse, request: NextRequest): void {
  const base = cookieBase(request);
  response.cookies.set({ ...base, name: ACCESS_COOKIE, value: "", maxAge: 0 });
  response.cookies.set({ ...base, name: REFRESH_COOKIE, value: "", maxAge: 0 });
}

/** A cookie's value, or undefined when it is missing or not a plausible token. */
function readCookie(request: NextRequest, name: string): string | undefined {
  const value = request.cookies.get(name)?.value;
  return value && value.length <= MAX_TOKEN_LENGTH ? value : undefined;
}

// ---------------------------------------------------------------------------
// Renewing a session
// ---------------------------------------------------------------------------

/**
 * Swaps a refresh token for a new pair. null means SAMKIEL ID refused it:
 * the session is over. Anything else that goes wrong throws, and the
 * session may still be good.
 */
async function requestNewTokens(refreshToken: string): Promise<Tokens | null> {
  const upstream = await fetch(`${idBase}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if ([400, 401, 403].includes(upstream.status)) return null;
  if (!upstream.ok) throw new Error("Session service unavailable");
  const tokens = (await upstream.json()) as Partial<Tokens>;
  if (
    typeof tokens.accessToken !== "string" ||
    !tokens.accessToken ||
    typeof tokens.refreshToken !== "string" ||
    !tokens.refreshToken ||
    typeof tokens.expiresIn !== "number" ||
    !(tokens.expiresIn > 0)
  ) {
    throw new Error("Invalid session response");
  }
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, expiresIn: tokens.expiresIn };
}

/**
 * Renewals in progress or just finished, by the refresh token they used.
 *
 * SAMKIEL ID treats a refresh token arriving a second time as stolen and
 * ends the whole session. Two requests sent a moment apart carry the same
 * cookie, so they must share one renewal, not make two. An answer is kept
 * for a minute for the request that was already on its way with the old
 * cookie. The browser also takes turns (lib/api/session.ts); this covers
 * what gets past that.
 */
const renewals = new Map<string, { result: Promise<Tokens | null>; at: number }>();
const RENEWAL_MEMORY_MS = 60_000;

function renew(refreshToken: string): Promise<Tokens | null> {
  const now = Date.now();
  for (const [key, entry] of renewals) {
    if (now - entry.at > RENEWAL_MEMORY_MS) renewals.delete(key);
  }
  const key = createHash("sha256").update(refreshToken).digest("hex");
  const known = renewals.get(key);
  if (known) return known.result;

  const result = requestNewTokens(refreshToken);
  renewals.set(key, { result, at: now });
  // A failure that was not a refusal can be tried again straight away.
  result.catch(() => {
    if (renewals.get(key)?.result === result) renewals.delete(key);
  });
  return result;
}

/**
 * POST /api/session/refresh. Renews the session from the refresh cookie
 * and sets the new pair of cookies. 401 means the session is over and the
 * cookies are cleared; 503 means try again, and the cookies are left alone.
 */
export async function renewSession(request: NextRequest): Promise<NextResponse> {
  if (!validOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const refreshToken = readCookie(request, REFRESH_COOKIE);
  const over = () => {
    const response = NextResponse.json({ error: "Please sign in again" }, { status: 401 });
    clearSessionCookies(response, request);
    return response;
  };
  if (!refreshToken) return over();
  try {
    const tokens = await renew(refreshToken);
    if (!tokens) return over();
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    setSessionCookies(response, request, tokens);
    return response;
  } catch {
    return NextResponse.json({ error: "Session service unavailable. Try again shortly." }, { status: 503 });
  }
}

/**
 * DELETE /api/session. Ends the session at SAMKIEL ID and clears both
 * cookies. The cookies are shared, so this signs the person out of every
 * samkiel.tech site in this browser, as signing out of kiv does.
 * Telling SAMKIEL ID is best effort: the cookies are cleared either way.
 */
export async function endSession(request: NextRequest): Promise<NextResponse> {
  if (!validOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const accessToken = readCookie(request, ACCESS_COOKIE);
  const refreshToken = readCookie(request, REFRESH_COOKIE);
  if (accessToken || refreshToken) {
    await fetch(`${idBase}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  clearSessionCookies(response, request);
  return response;
}

// ---------------------------------------------------------------------------
// The pass-through to the backend
// ---------------------------------------------------------------------------

/**
 * Sends one of the allowed account requests on to the backend with the
 * person's access token. A 401 here means "renew, then ask again": the
 * browser does that through /api/session/refresh (lib/api/client.ts), so
 * renewals happen in one place and one at a time.
 */
export async function proxyAccount(request: NextRequest, suffix = ""): Promise<NextResponse> {
  if (request.method !== "GET" && !validOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const paymentGet = suffix === "/payments/packages" || /^\/payments\/transactions\/[A-Za-z0-9_-]{1,64}$/.test(suffix);
  if (!(request.method === "GET" && (suffix === "" || paymentGet)) && !(request.method === "POST" && ["/link-code", "/unlink", "/payments/checkout"].includes(suffix))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const unauthorized = () => NextResponse.json({ error: "Please sign in again" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const accessToken = readCookie(request, ACCESS_COOKIE);
  if (!accessToken) return unauthorized();
  const body = request.method === "POST" ? await request.text() : undefined;
  if (body && body.length > 8192) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    const upstream = await fetch(`${backendBase}/api/account${suffix}`, { method: request.method, headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body, cache: "no-store", signal: AbortSignal.timeout(suffix === "/payments/checkout" ? 45000 : 15000) });
    if (upstream.status === 401) return unauthorized();
    return NextResponse.json(await upstream.json(), { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Account service unavailable. Try again shortly." }, { status: 503 }); }
}
