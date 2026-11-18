"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";
import { NAV_ITEMS, SETTINGS_ITEM, isActive } from "./nav";
import { NavRow } from "./NavRow";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Desktop navigation: a floating panel inset from the screen's edges.
 * A 64px icon rail (with tooltips) from 768px, opening to 220px with
 * labels from 1024px. Settings, the theme and Sign out sit at its foot.
 * Hidden on phones, where MobileBar and its menu sheet take over.
 */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-4 bottom-4 left-4 z-20 hidden w-16 flex-col rounded-lg border border-line bg-sidebar shadow-soft md:flex lg:w-55">
      <div className="flex h-16 shrink-0 items-center justify-center px-3 lg:justify-start lg:px-5">
        <Link href="/dashboard" aria-label="Zox, home" className="inline-flex size-11 items-center justify-center rounded-sm">
          <LogoMark alt="" />
        </Link>
      </div>

      <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col justify-between gap-4 px-2 pt-2 pb-3">
        <ul role="list" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavRow item={item} active={isActive(pathname, item.href)} place="panel" />
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1 border-t border-line pt-3">
          <NavRow item={SETTINGS_ITEM} active={isActive(pathname, SETTINGS_ITEM.href)} place="panel" />
          <div className="flex flex-col-reverse items-center gap-1 lg:flex-row lg:items-start">
            <SignOutButton className="w-full justify-center lg:justify-start" labelClassName="sr-only lg:not-sr-only" />
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </nav>
    </aside>
  );
}
