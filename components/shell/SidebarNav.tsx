"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { ICON_STROKE, NAV_ITEMS, isActive } from "./nav";
import { SignOutButton } from "./SignOutButton";

/**
 * Desktop and tablet navigation. A 64px icon rail from 768px, opening to
 * 220px with labels from 1024px. Hidden on mobile, where BottomNav takes over.
 */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col border-r border-line bg-sidebar md:flex lg:w-55">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-line px-4 lg:justify-start lg:px-5">
        {/* The 64px rail has room for the "z" only; the wordmark shows once the sidebar opens. */}
        <Link href="/dashboard" aria-label="Zox, home" className="rounded-sm">
          <LogoMark alt="" className="lg:hidden" />
          <Logo alt="" className="hidden lg:block" />
        </Link>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center justify-center gap-3 rounded-md px-3 text-sm lg:justify-start",
                "transition-colors duration-(--dur-fast) ease-zox",
                active ? "bg-wash font-medium text-ink" : "text-ink-2 hover:bg-wash hover:text-ink",
              )}
            >
              <Icon
                aria-hidden="true"
                size={18}
                strokeWidth={ICON_STROKE}
                className={cn("shrink-0", active && "text-accent-ink")}
              />
              <span className="sr-only lg:not-sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-line px-2 py-3">
        <SignOutButton className="w-full justify-center lg:justify-start" labelClassName="sr-only lg:not-sr-only" />
      </div>
    </aside>
  );
}
