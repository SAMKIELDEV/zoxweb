import type { Tier } from "./api/types";

// ---------------------------------------------------------------------------
// Numbers and money
// ---------------------------------------------------------------------------

const number = new Intl.NumberFormat("en");

/** 1234 becomes "1,234". Accepts the string bigints the backend sends. */
export function formatCount(value: number | string): string {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? number.format(parsed) : "0";
}

/** "1 credit", "2 credits", "1,200 credits". */
export function creditCount(value: number | string): string {
  const parsed = typeof value === "string" ? Number(value) : value;
  return `${formatCount(parsed)} ${parsed === 1 ? "credit" : "credits"}`;
}

/** "1 request", "2 requests", "1,200 requests". */
export function requestCount(value: number | string): string {
  const parsed = typeof value === "string" ? Number(value) : value;
  return `${formatCount(parsed)} ${parsed === 1 ? "request" : "requests"}`;
}

/** "NGN 1,650" or "USD 5.00". Naira is whole; dollars keep cents. */
export function formatMoney(amount: string | number | null | undefined, currency: string | null | undefined): string {
  const parsed = Number(amount);
  if (amount === null || amount === undefined || !Number.isFinite(parsed)) return "";
  const code = (currency || "USD").toUpperCase();
  const digits = code === "NGN" ? 0 : 2;
  return `${code} ${parsed.toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

// ---------------------------------------------------------------------------
// Dates and times
// ---------------------------------------------------------------------------

/**
 * A timestamp as the backend writes it. Group 4 is the zone, when there is one.
 * Matches both Postgres text ("2026-11-12 09:25:00.123456", optionally with
 * "+00" or "+0530") and ISO ("2026-11-12T09:25:00.123Z").
 */
const TIMESTAMP = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.(\d+))?(Z|[+-]\d{2}(?::?\d{2})?)?$/i;

/**
 * Reads a timestamp from the backend.
 *
 * Two shapes arrive. The account endpoint sends its `timestamp` columns as
 * Postgres text with no zone, for example "2026-11-12 09:25:00.123456". That
 * value is UTC clock time, but a browser handed it as-is reads it as local
 * time (an hour out in Lagos) and some reject the shape outright. The
 * purchase lookup sends ISO with a zone. So: a value with no zone is read as
 * UTC, a value with a zone keeps it, and both are rewritten as strict ISO
 * before parsing so every browser agrees. Returns null for anything unreadable.
 */
export function parseTimestamp(value: string | null | undefined): Date | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text) return null;

  let iso = text;
  const match = TIMESTAMP.exec(text);
  if (match) {
    const millis = (match[3] ?? "").slice(0, 3).padEnd(3, "0");
    let zone = (match[4] ?? "Z").toUpperCase();
    if (/^[+-]\d{2}$/.test(zone)) zone += ":00";
    else if (/^[+-]\d{4}$/.test(zone)) zone = `${zone.slice(0, 3)}:${zone.slice(3)}`;
    iso = `${match[1]}T${match[2]}.${millis}${zone}`;
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** The same instant as strict ISO, for a <time dateTime> attribute. */
export function isoTimestamp(value: string | null | undefined): string | undefined {
  return parseTimestamp(value)?.toISOString();
}

const toDate = (value: string | Date) => (typeof value === "string" ? parseTimestamp(value) : value);

const dateTime = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });
const dateOnly = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const monthYear = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
const timeOnly = new Intl.DateTimeFormat("en", { timeStyle: "short" });
const monthDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const monthDayYear = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** How many calendar days `date` is from `now`, in the reader's time zone. */
const dayOffset = (date: Date, now: Date) => Math.round((startOfDay(date) - startOfDay(now)) / 86_400_000);

/** "Nov 12, 2026, 3:40 PM". Empty when the value cannot be read. */
export function formatDateTime(value: string | Date): string {
  const date = toDate(value);
  return date ? dateTime.format(date) : "";
}

/** "Nov 12, 2026". */
export function formatDate(value: string | Date): string {
  const date = toDate(value);
  return date ? dateOnly.format(date) : "";
}

/** "November 2026". */
export function formatMonthYear(value: string | Date): string {
  const date = toDate(value);
  return date ? monthYear.format(date) : "";
}

/** "3:40 PM" in the reader's own time zone. */
export function formatTime(value: string | Date): string {
  const date = toDate(value);
  return date ? timeOnly.format(date) : "";
}

/**
 * A moment said the way a person would: "Today, 3:40 PM",
 * "Yesterday, 9:12 AM", "Tomorrow, 6:00 AM", otherwise "Nov 10, 3:40 PM".
 */
export function formatWhen(value: string | Date, now: Date = new Date()): string {
  const date = toDate(value);
  if (!date) return "";
  const days = dayOffset(date, now);
  const time = timeOnly.format(date);
  if (days === 0) return `Today, ${time}`;
  if (days === -1) return `Yesterday, ${time}`;
  if (days === 1) return `Tomorrow, ${time}`;
  const day = date.getFullYear() === now.getFullYear() ? monthDay.format(date) : monthDayYear.format(date);
  return `${day}, ${time}`;
}

/**
 * The same moment as formatWhen, phrased to sit inside a sentence:
 * "today at 3:40 PM", "tomorrow at 6:00 AM", "on Nov 10 at 3:40 PM".
 */
export function formatWhenInline(value: string | Date, now: Date = new Date()): string {
  const date = toDate(value);
  if (!date) return "";
  const days = dayOffset(date, now);
  const time = timeOnly.format(date);
  if (days === 0) return `today at ${time}`;
  if (days === -1) return `yesterday at ${time}`;
  if (days === 1) return `tomorrow at ${time}`;
  const day = date.getFullYear() === now.getFullYear() ? monthDay.format(date) : monthDayYear.format(date);
  return `on ${day} at ${time}`;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const ACTION_LABELS: Record<string, string> = {
  chat: "Chat",
  webSearch: "Web search",
  youtubeSummary: "YouTube summary",
  pdfReader: "PDF reading",
  imageUnderstanding: "Image reading",
  socialMediaDownload: "Media download",
};

/** Plain name for a backend action type. Unknown types read as "Other". */
export function actionLabel(actionType: string): string {
  // hasOwn, so a type named like a built-in key ("constructor") is still "Other".
  return Object.hasOwn(ACTION_LABELS, actionType) ? ACTION_LABELS[actionType] : "Other";
}

const TIER_LABELS: Record<Tier, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
  max: "Max",
};

export function tierLabel(tier: Tier | undefined | null): string {
  return tier ? TIER_LABELS[tier] ?? "Free" : "Free";
}

const TIER_RANK: Record<Tier, number> = { free: 0, basic: 1, pro: 2, max: 3 };

/** True when `candidate` is a higher plan than `current`. Plans never move down. */
export function isHigherTier(candidate: Tier, current: Tier): boolean {
  return TIER_RANK[candidate] > TIER_RANK[current];
}

/** "Ada Obi" becomes "AO". Falls back to the first letter of the email. */
export function initials(name: string | undefined, email: string): string {
  const source = name?.trim();
  if (source) {
    const parts = source.split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }
  return (email[0] ?? "").toUpperCase();
}

/** WhatsApp numbers are stored as bare digits. Show them with a leading plus. */
export function formatPhone(value: string): string {
  return /^\d{6,15}$/.test(value) ? `+${value}` : value;
}
