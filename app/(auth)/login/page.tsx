import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Phone } from "@/components/marketing/Hero";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { container, headingTracking } from "@/components/marketing/Section";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ACCOUNTS_URL, accountsUrl, safeNext } from "@/lib/paths";
import { hasSessionCookie, publicOrigin } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[]; ended?: string | string[] }>;
}

/**
 * The way in, dressed like the landing page: its header, a display
 * headline, pill buttons, and the live phone beside them.
 *
 * Zox has no sign-in form of its own: the button goes to SAMKIEL ID at the
 * accounts site, which signs the person in for every samkiel.tech site and
 * sends them back here, to ?next= when that is a dashboard path and to Home
 * otherwise.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const next = safeNext(typeof query.next === "string" ? query.next : null);
  // Set when a session stopped working mid-visit (lib/api/client.ts).
  const ended = query.ended === "1";

  // Already carrying SAMKIEL ID's cookies: go straight in. Not after a
  // session has just ended, though: if a dead cookie were still around,
  // this page and the dashboard would send the browser back and forth.
  if (!ended && hasSessionCookie(await cookies())) redirect(next ?? "/dashboard");

  const requestHeaders = await headers();
  const origin = publicOrigin(
    requestHeaders.get("host"),
    requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim(),
  );
  const accountsHost = new URL(ACCOUNTS_URL).host;

  return (
    // The public pages' type: Fraunces at its optical sizes (see app/(marketing)/layout.tsx).
    <div className="flex min-h-dvh flex-col [font-variation-settings:normal]">
      <MarketingNav />
      <main className="flex-1 overflow-x-clip">
        <div className={cn(container, "grid items-center gap-14 pt-8 pb-20 lg:grid-cols-[1.3fr_1fr] lg:pt-6")}>
          <div className="max-w-140">
            <h1 className={cn("mb-5 font-display text-hero font-semibold text-ink", headingTracking)}>
              Sign in to <em className="text-accent italic">Zox.</em>
            </h1>
            <p className="mb-8 text-lead text-ink-2">
              Use your SAMKIEL ID to see your credits and connect WhatsApp.
            </p>

            {ended ? (
              <p role="status" className="mb-8 border-l-2 border-accent pl-4 text-base text-ink">
                You were signed out. Sign in again to carry on.
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink
                href={accountsUrl("login", origin, next)}
                variant="primary"
                size="lg"
                shape="pill"
                className="shadow-cta"
              >
                Continue with SAMKIEL ID
              </ButtonLink>
              <ButtonLink href={accountsUrl("register", origin, next)} variant="secondary" size="lg" shape="pill">
                Create a SAMKIEL ID
              </ButtonLink>
            </div>
            <p className="mt-4 text-note text-ink-2">You sign in at {accountsHost} and come straight back.</p>
          </div>

          <Phone />
        </div>
      </main>
    </div>
  );
}
