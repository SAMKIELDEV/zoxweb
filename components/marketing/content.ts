/**
 * The landing page's words, kept apart from its layout so they can be
 * edited without touching markup. The copy is the design's, word for word.
 */

import { FileText, ImageIcon, MessageSquareMore, Play, Search, type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Hero conversation
// ---------------------------------------------------------------------------

export interface ChatMessage {
  /** Who sent it. A person's message is a plain bubble; Zox's replies are colored. */
  from: "person" | "zox";
  text: string;
  /** The time shown under the message. */
  time: string;
}

/**
 * The chat shown beside the headline: two short exchanges, in order.
 * The component places them; change only the words here.
 */
export const HERO_CONVERSATION: readonly ChatMessage[] = [
  { from: "person", text: "Summarise this 40-page PDF for me 📄", time: "10:32 AM" },
  { from: "zox", text: "Here are the 5 key takeaways from your document ✨", time: "10:32 AM" },
  { from: "person", text: "What's this research paper about?", time: "Yesterday" },
  { from: "zox", text: "It covers quantum entanglement in layman's terms. Want a breakdown?", time: "Yesterday" },
];

/** What the chat illustration shows, for people who cannot see it. */
export const HERO_CONVERSATION_SUMMARY =
  "A WhatsApp chat with Zox. Someone asks for a summary of a 40-page PDF and Zox replies with five key takeaways. They ask what a research paper is about and Zox explains it in plain terms.";

// ---------------------------------------------------------------------------
// What Zox does
// ---------------------------------------------------------------------------

export interface Feature {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Which tint the icon sits on. The design alternates the two. */
  tone: "accent" | "forest";
}

export const FEATURES: readonly Feature[] = [
  {
    title: "AI Chat",
    body: "Talk through anything. Get smart, contextual answers back — not search results.",
    icon: MessageSquareMore,
    tone: "accent",
  },
  {
    title: "Web Search",
    body: "Ask Zox to look something up. It searches, reads, and comes back with the answer.",
    icon: Search,
    tone: "forest",
  },
  {
    title: "PDF Summaries",
    body: "Drop a PDF in the chat. Zox reads the whole thing and sends back the key points.",
    icon: FileText,
    tone: "accent",
  },
  {
    title: "YouTube Summaries",
    body: "Send a video link. Get the gist — without sitting through the whole thing.",
    icon: Play,
    tone: "forest",
  },
  {
    title: "Image Understanding",
    body: "Share a photo, diagram, or screenshot — Zox tells you what it sees.",
    icon: ImageIcon,
    tone: "accent",
  },
];

// ---------------------------------------------------------------------------
// Why Zox
// ---------------------------------------------------------------------------

export interface Reason {
  title: string;
  body: string;
}

export const REASONS: readonly Reason[] = [
  {
    title: "No app to download.",
    body: "You already have WhatsApp. Zox lives there — no new habit, no onboarding maze, no \"download our app\" moment.",
  },
  {
    title: "Personality first.",
    body: "Zox isn't a command-line bot wearing a chat interface. It's direct, warm, and genuinely useful — built to feel like a smart friend, not a search engine.",
  },
  {
    title: "Pay only for what you use.",
    body: "Simple credit system. No monthly subscription trap, no surprise bills. Top up when you need to.",
  },
];

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

/**
 * Pages the footer links to. They do not exist yet; the paths are their
 * final ones, so the links start working the day each page lands.
 */
export const FOOTER_LINKS: readonly { label: string; href: string }[] = [
  { label: "Guide", href: "/guide" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
