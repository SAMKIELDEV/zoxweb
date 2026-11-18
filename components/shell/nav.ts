import type { Icon } from "@phosphor-icons/react";
import { ChartBar, GearSix, House, Wallet } from "@phosphor-icons/react/dist/ssr";

export interface NavItem {
  href: string;
  label: string;
  icon: Icon;
}

/** The pages in the body of the nav, in order. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/usage", label: "Usage", icon: ChartBar },
  { href: "/dashboard/billing", label: "Billing", icon: Wallet },
];

/** Settings sits at the foot of the nav, with the theme and Sign out (DESIGN.md, "Dashboard shell"). */
export const SETTINGS_ITEM: NavItem = { href: "/dashboard/settings", label: "Settings", icon: GearSix };

/** Home matches exactly; the others also match their sub-pages. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Icon size in the nav rows. Phosphor, regular weight (DESIGN.md section 6). */
export const NAV_ICON_SIZE = 20;

/** Stroke for the Lucide icons the public pages still use, until they move to Phosphor. */
export const ICON_STROKE = 1.6;
