import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { TextLink } from "@/components/ui/TextLink";
import { ACCOUNTS_URL, accountsUrl, safeNext } from "@/lib/paths";
import { hasSessionCookie, publicOrigin } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

interface LoginPageProps {
  searchParams: Promise<{ next?: string | string[]; ended?: string | string[] }>;
}

/**
 * The way in. Zox has no sign-in form of its own: the button goes to
 * SAMKIEL ID at the accounts site, which signs the person in for every
 * samkiel.tech site and sends them back here, to ?next= when that is a
 * dashboard path and to Home otherwise.
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
    <div className="mx-auto flex min-h-dvh w-full max-w-280 flex-col px-5 md:px-8 lg:px-12">
      <header className="flex h-16 items-center justify-between">
        <Logo className="h-7" />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col pt-12 pb-16 md:pt-24">
        <div className="w-full max-w-96">
          <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mt-3 text-base text-ink-2">
            Use your SAMKIEL ID to see your credits and connect WhatsApp.
          </p>

          {ended ? (
            <p role="status" className="mt-6 border-l-2 border-accent pl-4 text-base text-ink">
              You were signed out. Sign in again to carry on.
            </p>
          ) : null}

          <div className="mt-10">
            <ButtonLink href={accountsUrl("login", origin, next)} variant="primary" className="w-full">
              Continue with SAMKIEL ID
            </ButtonLink>
            <p className="mt-3 text-sm text-ink-2">
              You sign in at {accountsHost} and come straight back.
            </p>
          </div>

          <p className="mt-8 text-sm text-ink-2">
            No SAMKIEL ID yet?{" "}
            <TextLink href={accountsUrl("register", origin, next)}>Create one</TextLink>
          </p>
        </div>
      </main>
    </div>
  );
}
