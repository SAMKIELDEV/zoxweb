import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-280 flex-col px-5 md:px-8 lg:px-12">
      <header className="flex h-16 items-center">
        <Logo className="h-7" />
      </header>
      <main className="flex flex-1 flex-col items-start pt-12 md:pt-24">
        <h1 className="text-2xl font-semibold text-ink">Nothing at this address</h1>
        <p className="mt-3 max-w-[52ch] text-base text-ink-2">The link may be old, or the page has moved.</p>
        <ButtonLink href="/dashboard" variant="primary" className="mt-8">
          Go to Home
        </ButtonLink>
      </main>
    </div>
  );
}
