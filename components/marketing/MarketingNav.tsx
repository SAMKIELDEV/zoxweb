import Link from "next/link";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { container } from "./Section";

/**
 * The bar across the top of the public pages: logo, theme switch, and the
 * two ways in. "Sign in" goes to the dashboard's sign-in; "Get started"
 * opens the chat with Zox, because that is how someone starts.
 * On phones the buttons grow to 44px tall so they are easy to tap.
 */
export function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper">
      <nav aria-label="Main" className={cn(container, "flex h-16 items-center justify-between gap-3")}>
        {/* 44px tall so the logo is an easy target, though the mark itself is 24px. */}
        <Link href="/" aria-label="Zox, home" className="inline-flex min-h-11 shrink-0 items-center rounded-sm">
          <Logo alt="" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* The square drawn inside is 32px; the pull-in keeps the gaps the design has. */}
          <ThemeToggle tone="tinted" className="-mx-1.5" />
          <ButtonLink href="/login" variant="soft" size="sm" className="max-sm:h-11">
            Sign in
          </ButtonLink>
          <ButtonLink
            href={START_CHAT.href}
            external={START_CHAT.external}
            variant="primary"
            size="sm"
            className="max-sm:h-11"
          >
            Get started
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
