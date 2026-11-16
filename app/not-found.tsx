import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

/**
 * Any address with no page, public or dashboard. It stands on its own frame
 * because it can be reached from either side, so it offers a way back to
 * both: the homepage first, the dashboard second.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-280 flex-col px-5 md:px-8 lg:px-12">
      <header className="flex h-16 items-center">
        <Link href="/" aria-label="Zox, home" className="inline-flex min-h-11 items-center rounded-sm">
          <Logo alt="" className="h-7" />
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-start pt-12 md:pt-24">
        <h1 className="text-2xl font-semibold text-ink">Nothing at this address</h1>
        <p className="mt-3 max-w-[52ch] text-base text-ink-2">
          The link may be old, or the page has moved. Here are two ways back.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Go to the homepage
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">
            Open your dashboard
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
