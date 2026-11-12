import { ChartNoAxesColumn, House, Settings, Wallet, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** The four pages, in order. The label is also the page title. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/billing", label: "Billing", icon: Wallet },
  { href: "/dashboard/usage", label: "Usage", icon: ChartNoAxesColumn },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

/** Home matches exactly; the others also match their sub-pages. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function titleFor(pathname: string): string {
  return NAV_ITEMS.find((item) => isActive(pathname, item.href))?.label ?? "Zox";
}

/** One icon set, one stroke weight (DESIGN.md section 6). */
export const ICON_STROKE = 1.6;
