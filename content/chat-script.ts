/**
 * The hero phone's chats, as plain data. Every value is JSON-serialisable
 * (no functions, no dates), so scenarios can also live in a .json file or
 * come from an API and pass straight through.
 *
 * A scenario is one short exchange that shows one thing Zox does. The
 * phone opens on HERO_HISTORY (already in the chat when the page loads),
 * then plays the rest of HERO_SCENARIOS in a shuffled order, and only
 * repeats one after every other has played.
 *
 * Times are in milliseconds. `delay` is the pause before a step starts.
 * Bubble times are the visitor's own clock, as if the chat were happening
 * now.
 */

export type ChatActor = "person" | "zox";

/** What a bubble holds. */
export type ChatContent =
  | { kind: "text"; text: string }
  /** A document, drawn as a file card, with an optional message under it. */
  | { kind: "pdf"; name: string; detail: string; text?: string }
  /** A link, with WhatsApp's preview card. `image` is a file in /public. */
  | {
      kind: "link";
      url: string;
      preview: { site: "youtube" | "instagram"; title: string; byline?: string; image?: string };
      text?: string;
    }
  /** A voice note. `transcript` is what screen readers get. */
  | { kind: "voice"; seconds: number; transcript: string }
  /** A picture: a photo the person took, an image Zox made, or a video Zox fetched. */
  | { kind: "image"; art: "worksheet" | "poster" | "reel"; caption?: string; video?: boolean };

/** One bubble arriving. */
export interface SendStep {
  type: "send";
  from: ChatActor;
  content: ChatContent;
  delay: number;
}

/** Zox shows "typing…" or "recording audio…" under its name for `duration`, as WhatsApp does. */
export interface WaitStep {
  type: "wait";
  status: "typing" | "recording";
  delay: number;
  duration: number;
}

export type ChatStep = SendStep | WaitStep;

export interface ChatScenario {
  /** A stable name, for the shuffle and for tests. */
  id: string;
  steps: ChatStep[];
}

const ask = (content: ChatContent, delay = 500): SendStep => ({ type: "send", from: "person", content, delay });
const answer = (content: ChatContent): SendStep => ({ type: "send", from: "zox", content, delay: 0 });
const typing = (duration = 1400): WaitStep => ({ type: "wait", status: "typing", delay: 450, duration });
const recording = (duration = 2000): WaitStep => ({ type: "wait", status: "recording", delay: 450, duration });

/**
 * A reel or post from the SAMKIEL Instagram (instagram.com/samkiel_), for
 * the download scenario. Instagram does not list posts without signing
 * in, so this needs pasting by hand. While it is empty that scenario is
 * left out of the rotation.
 */
export const SAMKIEL_INSTAGRAM_POST = "";

/**
 * OPEN ITEM (landing brief, 00-README #1): the exchanges below are
 * written for the demo. Swap in real, trimmed Zox conversations when you
 * have them; nothing else changes.
 */
export const HERO_SCENARIOS: ChatScenario[] = [
  {
    id: "pdf",
    steps: [
      ask({ kind: "pdf", name: "CSC 305 Week 4.pdf", detail: "12 pages • PDF", text: "sum this up, short pls" }, 300),
      typing(1300),
      answer({
        kind: "text",
        text: "Week 4 in three lines: threads share memory. Two writing at once causes a race condition. A mutex stops that by letting only one in at a time.",
      }),
    ],
  },
  {
    id: "explain",
    steps: [
      ask({ kind: "text", text: "can you explain what a mutex is, like i'm 12" }, 900),
      typing(1500),
      answer({
        kind: "text",
        text: "A mutex is a lock on a shared thing. Only one person can hold it at a time. Think of one bathroom key: if someone has it, you wait. That's all it is.",
      }),
    ],
  },
  {
    id: "youtube",
    steps: [
      ask({
        kind: "link",
        url: "https://www.youtube.com/watch?v=AZECKTp9tEI",
        preview: {
          site: "youtube",
          title: "How to Permanently Activate Windows (Step-by-Step Guide) | SAMKIEL",
          byline: "SAMKIEL",
          image: "/demo/youtube-AZECKTp9tEI.jpg",
        },
        text: "summarize this",
      }),
      typing(1700),
      answer({
        kind: "text",
        text: "It's SAMKIEL's step-by-step guide to activating Windows for good. Want the steps as a short checklist you can follow along?",
      }),
    ],
  },
  {
    id: "voice-in",
    steps: [
      ask({ kind: "voice", seconds: 6, transcript: "What does photosynthesis actually make?" }),
      typing(1400),
      answer({
        kind: "text",
        text: "Glucose and oxygen. The plant uses light to turn water and carbon dioxide into glucose for energy, and lets the oxygen out.",
      }),
    ],
  },
  {
    id: "voice-out",
    steps: [
      ask({ kind: "text", text: "explain recursion as a voice note, i'm walking" }),
      recording(2200),
      answer({
        kind: "voice",
        seconds: 21,
        transcript:
          "Recursion is when a function solves a problem by calling itself on a smaller piece of it, until the piece is so small the answer is obvious.",
      }),
    ],
  },
  {
    id: "photo",
    steps: [
      ask({ kind: "image", art: "worksheet", caption: "how do i solve this" }),
      typing(1500),
      answer({ kind: "text", text: "Take 3 from both sides: 2x = 8. Halve it: x = 4. Check: 2 × 4 + 3 = 11." }),
    ],
  },
  {
    id: "make-image",
    steps: [
      ask({ kind: "text", text: "make a poster for our study group, thursday 6pm" }),
      typing(1800),
      answer({ kind: "image", art: "poster", caption: "Here you go. Want it in another colour?" }),
    ],
  },
  {
    id: "search",
    steps: [
      ask({ kind: "text", text: "any free courses on data structures?" }),
      typing(1600),
      answer({
        kind: "text",
        text: "Two good ones: MIT OpenCourseWare's 6.006 Introduction to Algorithms, and Princeton's Algorithms on Coursera. Both are free to follow.",
      }),
    ],
  },
  {
    id: "instagram",
    steps: [
      ask({
        kind: "link",
        url: SAMKIEL_INSTAGRAM_POST,
        preview: { site: "instagram", title: "SAMKIEL (@samkiel_) on Instagram", byline: "instagram.com" },
        text: "download this",
      }),
      typing(1500),
      answer({ kind: "image", art: "reel", video: true, caption: "Here's the video." }),
    ],
  },
];

/** Already in the chat when the page loads, in this order. */
export const HERO_HISTORY_IDS = ["pdf", "explain"] as const;

/** The scenarios that can play: the Instagram one only once it has a link. */
export function playableScenarios(): ChatScenario[] {
  return HERO_SCENARIOS.filter((scenario) => scenario.id !== "instagram" || SAMKIEL_INSTAGRAM_POST !== "");
}
