/**
 * The landing page's words, kept apart from its layout so they can be
 * edited without touching markup. Source: landing-copy/ at the repo root
 * (00-README to 09-footer), word for word; change both together.
 * Its rules hold for every line: no em dashes, no banned words, no stats
 * except the one real number, and no prices typed in (they come from
 * lib/pricing.ts and the Pricing page).
 */

// ---------------------------------------------------------------------------
// 01 Header
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
}

/** The section the hero's "See how it works" and the nav's "How it works" jump to. */
export const HOW_IT_WORKS_ID = "how-it-works";

export const NAV_LINKS: readonly NavLink[] = [
  { label: "How it works", href: `/#${HOW_IT_WORKS_ID}` },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Sign in", href: "/login" },
];

/** Takes the place of "Sign in" for a visitor who is already signed in. */
export const NAV_SIGNED_IN: NavLink = { label: "Dashboard", href: "/dashboard" };

export const NAV_BUTTON = "Text Zox";

// ---------------------------------------------------------------------------
// 02 Hero
// ---------------------------------------------------------------------------

export const HERO = {
  headline: ["Text it.", "Zox gets to the point."],
  subtitle:
    "Ask a question, send a PDF, snap a photo of a problem. Zox answers on WhatsApp, with no app to install.",
  primary: "Open WhatsApp",
  secondary: "See how it works",
} as const;

/**
 * Every composer that sends a message to WhatsApp: the hero phone and the
 * closing section (DESIGN.md, "Composers"). Each has its own line under it
 * before sending, saying the same thing in different words.
 */
export const COMPOSER = {
  placeholder: "Type your message here",
  /** The button's text, or the accessible name of an icon button. */
  send: "Send",
  /** Tapping one fills the input. */
  suggestions: ["Summarize this YouTube video", "Explain this like I'm 12", "Plan my week around exams"],
  /** The line under each composer before sending. */
  hint: {
    hero: "Type your message, tap Send, and it goes to Zox on WhatsApp.",
    cta: "Write it here. Send takes it straight to Zox on WhatsApp.",
  },
  handoff: "Opening WhatsApp with your message ready",
  /** Shown when the browser blocks the hand-off. */
  fallback: "Open WhatsApp",
} as const;

// The hero phone's conversation is data of its own: content/chat-script.ts.

// ---------------------------------------------------------------------------
// 03 Trust
// ---------------------------------------------------------------------------

/**
 * The page's one number.
 * OPEN ITEM (brief, 00-README #2): confirm what it measures and keep the
 * line honest. Update it by hand, or wire it to a real count, on launch day.
 */
export const TRUST = {
  count: "467+",
  line: "people already text Zox.",
  // Owner's changes: 2026-11-16 replaced the brief's "Made by SAMKIEL in Ile-Ife, Nigeria.";
  // 2026-11-18 dropped any location (the brand reads as global) and linked the studio.
  maker: { prefix: "A product of", studio: "SAMKIEL Studio", href: "https://samkiel.tech" },
} as const;

// ---------------------------------------------------------------------------
// 04 Problem
// ---------------------------------------------------------------------------

export const PROBLEM = {
  heading: ["Your assignment is due at 8.", "Your notes are in five places."],
  body: "A lecture PDF, a YouTube video, a blurry photo of the board, a question you're too tired to look up. You spend the evening switching apps instead of finishing.",
} as const;

// ---------------------------------------------------------------------------
// 05 Solution
// ---------------------------------------------------------------------------

export type JobArt = "ask" | "search" | "pdf" | "video" | "photo";

export interface Job {
  title: string;
  body: string;
  art: JobArt;
}

export const SOLUTION = {
  heading: ["Five jobs.", "One chat."],
  subtitle: "It all happens in the same conversation, so you never switch apps.",
} as const;

/** In the brief's order. The first is the largest card. */
export const JOBS: readonly Job[] = [
  {
    title: "Ask anything",
    body: "Questions, essays, code, ideas. Zox answers short, and tells you straight when it's unsure.",
    art: "ask",
  },
  { title: "Search the web", body: "Doesn't know something? Zox looks it up instead of guessing.", art: "search" },
  { title: "Read a PDF", body: "Send the file. Get the point in seconds.", art: "pdf" },
  { title: "Watch a video", body: "Paste a YouTube link. Get the summary, not the 90 minutes.", art: "video" },
  { title: "See a photo", body: "Snap a handwritten problem or a diagram. Zox reads it and explains it.", art: "photo" },
];

// ---------------------------------------------------------------------------
// 06 Pricing teaser
// ---------------------------------------------------------------------------

/**
 * The allowance figure is FREE_DAILY_CREDITS from lib/pricing.ts (a chat
 * costs from 1 credit), so the component fills it in; it is not typed here.
 * OPEN ITEM (brief, 00-README #3): confirm "around N chats" against real usage.
 */
export const PRICING_TEASER = {
  heading: "Free to start.",
  allowance: (chats: number) =>
    `Everyone gets a daily allowance, enough for around ${chats} chats a day. It resets every 24 hours.`,
  more: "Need more? Buy credits and use them whenever. Tools like PDFs and videos cost more credits than a plain chat, because they take more work.",
  button: "See pricing",
} as const;

// ---------------------------------------------------------------------------
// 07 FAQ
// ---------------------------------------------------------------------------

/** The owner's heading, 2026-11-18 (the brief gave the section none). */
export const FAQ_HEADING = "You may be wondering";

export interface Faq {
  question: string;
  answer: string;
  /** Optional link sentence after the answer. */
  link?: NavLink;
}

/**
 * OPEN ITEM (brief, 00-README #4): the data answer must match the Privacy
 * page. Checked against app/(marketing)/privacy on 2026-11-16: it does
 * (messages are kept for as long as you use Zox).
 */
export const FAQS: readonly Faq[] = [
  {
    question: "Is Zox free?",
    answer: "Yes to start. You get a daily allowance that resets every 24 hours. If you need more, you can buy credits.",
  },
  {
    question: "Do I need to install anything?",
    answer: "No. Zox lives in WhatsApp. Open the chat and send a message.",
  },
  {
    question: "What can I send?",
    answer: "Text, PDFs, photos, and YouTube links. Zox reads what you send and answers in the chat.",
  },
  {
    question: "Can Zox be wrong?",
    answer:
      "Yes, like any AI. When Zox doesn't know something, it searches the web first. For anything important, double-check.",
  },
  {
    question: "What happened to SAMKIEL BOT?",
    answer:
      "Zox is the next version. If you used SAMKIEL BOT, your account was moved over. Sign in with SAMKIEL ID and set a password the first time.",
  },
  {
    question: "Is my data private?",
    answer: "Zox stores your messages so it can answer and keep your history.",
    link: { label: "The privacy policy spells out how we handle your data.", href: "/privacy" },
  },
];

// ---------------------------------------------------------------------------
// 08 Call to action
// ---------------------------------------------------------------------------

/** Two lines and the composer (2026-11-18: the separate button went; the composer's Send is the action). */
export const CTA = {
  heading: ["Stop switching apps.", "Just text Zox."],
} as const;

// ---------------------------------------------------------------------------
// 09 Footer
// ---------------------------------------------------------------------------

export const FOOTER_TAGLINE = "Zox gets to the point.";

export const FOOTER_LEGAL_LINE = "© 2026 SAMKIEL Technologies Limited. RC 9540139.";

/** Small print after the company line. Kept from the earlier footer at the owner's request. */
export const FOOTER_DISCLAIMER = "Not affiliated with Meta Platforms, Inc.";

export interface FooterColumn {
  title: string;
  links: readonly (NavLink & { external?: boolean })[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: `/#${HOW_IT_WORKS_ID}` },
      // Not in the brief's footer; added 2026-11-16 so the Guide page is reachable from every page.
      { label: "Guide", href: "/guide" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "SAMKIEL", href: "https://samkiel.tech", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refunds", href: "/refunds" },
      { label: "Acceptable use", href: "/acceptable-use" },
    ],
  },
];
