"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { titleFor } from "./nav";
import { ThemeToggle } from "./ThemeToggle";
import { UserChip } from "./UserChip";

/**
 * Sticky bar across the top of every signed-in page. It holds the page's
 * one h1, so pages must not render another. On mobile the wordmark sits
 * beside the title, since the sidebar is hidden there.
 */
export function TopBar() {
  const title = titleFor(usePathname());

  return (
    <header className="sticky top-0 z-10 flex h-15 items-center justify-between gap-4 border-b border-line bg-paper px-5 md:h-16 md:px-8 lg:px-12">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/dashboard" aria-label="Zox, home" className="inline-flex min-h-11 shrink-0 items-center rounded-sm md:hidden">
          <Logo alt="" className="h-5" />
        </Link>
        <span aria-hidden="true" className="text-ink-3 md:hidden">
          /
        </span>
        <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <span aria-hidden="true" className="hidden h-5 w-px bg-line md:block" />
        <UserChip />
      </div>
    </header>
  );
}
