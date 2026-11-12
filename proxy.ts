import { NextResponse, type NextRequest } from "next/server";
import { loginUrl } from "@/lib/paths";
import { hasSessionCookie, publicOrigin } from "@/lib/session";

/**
 * Sends signed-out visitors to sign-in and remembers where they were
 * going. This matters most after a payment: the provider sends people
 * back to /dashboard/billing/payment/<id>, sometimes in a browser that
 * has no session, and they must land on that purchase after signing in.
 *
 * This only looks for SAMKIEL ID's cookies. Whether the session is still
 * good is decided by the backend on the first request (lib/server.ts).
 */
export function proxy(request: NextRequest) {
  if (hasSessionCookie(request.cookies)) return NextResponse.next();

  // Next requires an absolute address here, and request.url can carry the
  // server's bind address (0.0.0.0), which a browser cannot open. The Host
  // header is the address the browser actually connected to.
  const origin = publicOrigin(request.headers.get("host") ?? request.nextUrl.host, request.nextUrl.protocol);
  const response = NextResponse.redirect(new URL(loginUrl(request.nextUrl.pathname), origin));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
