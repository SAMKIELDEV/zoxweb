/**
 * How to reach the people behind Zox, for the legal and contact pages.
 * Every value comes from the environment and is read when the site is
 * built, so nothing here is written in code. An unset or unreadable value
 * is null, and the page leaves that line out rather than showing a blank.
 */

export { WHATSAPP_URL } from "./site";

/** The company that operates Zox. Fixed facts, not configuration. */
export const OPERATOR = {
  name: "SAMKIEL Technologies Limited",
  registration: "RC 9540139",
  country: "Nigeria",
} as const;

/** Trimmed, or null when unset or blank. */
function text(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** An address that looks like name@domain.tld, or null. */
function email(value: string | undefined): string | null {
  const candidate = text(value);
  return candidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : null;
}

/** A phone number with 8 to 15 digits, kept as written for display, or null. */
function phone(value: string | undefined): { display: string; href: string } | null {
  const display = text(value);
  if (!display) return null;
  const digits = display.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) return null;
  // "+234 803 ..." dials internationally; a local "0803 ..." is dialled as written.
  return { display, href: `tel:${display.startsWith("+") ? "+" : ""}${digits}` };
}

export const SUPPORT_EMAIL = email(process.env.NEXT_PUBLIC_SUPPORT_EMAIL);
export const DISPUTES_EMAIL = email(process.env.NEXT_PUBLIC_DISPUTES_EMAIL);
export const CONTACT_PHONE = phone(process.env.NEXT_PUBLIC_CONTACT_PHONE);
export const REGISTERED_ADDRESS = text(process.env.NEXT_PUBLIC_REGISTERED_ADDRESS);
