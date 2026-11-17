import { NextResponse, type NextRequest } from "next/server";
import { endSession } from "@/lib/server";
import { hasSessionCookie } from "@/lib/session";

/**
 * Whether this browser carries SAMKIEL ID's session cookies, for the public
 * pages: they are static and cannot read the cookies (which scripts cannot
 * see either), so their header asks here to show "Dashboard" instead of
 * "Sign in". Only a first look, like the proxy's: the backend still decides
 * whether the session is good when the dashboard loads.
 */
export function GET(request: NextRequest) {
  return NextResponse.json(
    { signedIn: hasSessionCookie(request.cookies) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

/**
 * Sign out. There is no sign-in here: that happens at accounts.samkiel.tech,
 * and SAMKIEL ID sets the session cookies itself (lib/session.ts).
 */
export const DELETE = (request: NextRequest) => endSession(request);
