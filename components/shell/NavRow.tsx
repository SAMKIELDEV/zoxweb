"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { NAV_ICON_SIZE, type NavItem } from "./nav";

interface NavRowProps {
  item: NavItem;
  active: boolean;
  /**
   * "panel": the desktop sidebar, an icon rail with a tooltip from 768px
   * and a full row with its label from 1024px. "sheet": the phone menu,
   * always a full row.
   */
  place: "panel" | "sheet";
  onNavigate?: () => void;
}

/**
 * One page in the nav. The active row has a `wash` fill and a small
 * terracotta marker on its left edge, so the state is never color alone.
 */
export function NavRow({ item, active, place, onNavigate }: NavRowProps) {
  const Icon = item.icon;
  const panel = place === "panel";

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-md px-3 text-base",
        "transition-colors duration-(--dur-fast) ease-zox",
        panel && "justify-center lg:justify-start lg:text-sm",
        active ? "bg-wash font-medium text-ink" : "text-ink-2 hover:bg-wash hover:text-ink",
      )}
    >
      {active ? (
        <span aria-hidden="true" className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
      ) : null}
      <Icon aria-hidden="true" size={NAV_ICON_SIZE} className={cn("shrink-0", active && "text-accent-ink")} />
      <span className={cn(panel && "sr-only lg:not-sr-only")}>{item.label}</span>
      {panel ? <RailTip label={item.label} /> : null}
    </Link>
  );
}

/**
 * The name beside an icon on the 64px rail, shown on hover and on keyboard
 * focus. It repeats the row's own (visually hidden) label, so it is hidden
 * from assistive tech. Not shown once the panel has room for labels.
 */
export function RailTip({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 left-full z-30 ml-3 -translate-y-1/2 whitespace-nowrap",
        "rounded-sm border border-line bg-surface px-2 py-1 text-xs font-normal text-ink shadow-soft",
        "opacity-0 transition-opacity duration-(--dur-fast) ease-zox",
        "group-hover:opacity-100 group-focus-visible:opacity-100 lg:hidden",
      )}
    >
      {label}
    </span>
  );
}
