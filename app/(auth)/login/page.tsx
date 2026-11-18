import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
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
 * The way in, dressed like the landing page: its header and footer, a
 * display headline, and one main button (owner's change, November 18, 2026:
 * no phone, "Continue with SAMKIEL ID" as the one call to action, creating
 * an ID as a quiet line under it).
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
        <div className={cn(container, "py-20 md:py-28 lg:py-32")}>
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

            <ButtonLink
              href={accountsUrl("login", origin, next)}
              variant="primary"
              size="lg"
              shape="pill"
              className="w-full shadow-cta sm:w-auto"
            >
              Continue with SAMKIEL ID
            </ButtonLink>
            <p className="mt-5 text-base text-ink-2">
              Don&rsquo;t have a SAMKIEL ID?{" "}
              <a
                href={accountsUrl("register", origin, next)}
                className="inline-flex min-h-11 items-center font-medium text-accent-ink underline underline-offset-4 sm:min-h-0"
              >
                Create one.
              </a>
            </p>
            <p className="mt-3 text-note text-ink-2">You sign in at {accountsHost} and come straight back.</p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
