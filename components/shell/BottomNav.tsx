"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ICON_STROKE, NAV_ITEMS, isActive } from "./nav";

/** Mobile navigation: four items along the bottom, each a 56px tap target. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-1 text-xs",
                  "transition-colors duration-(--dur-fast) ease-zox",
                  active ? "font-medium text-accent-ink" : "text-ink-2",
                )}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
                {item.label}
                {active ? <span aria-hidden="true" className="absolute top-0 h-0.5 w-6 rounded-full bg-accent" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
