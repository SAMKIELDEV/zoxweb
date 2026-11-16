/**
 * Scripted chats, as plain data. The landing page's phone plays HERO_CHAT;
 * anything else that shows a chat can reuse the format. Every value is
 * JSON-serialisable (no functions, no dates), so a script can also live in
 * a .json file or come from an API and pass straight through.
 *
 * Times are in milliseconds. `delay` is the pause before a step starts.
 * A bubble's `time` is the clock text shown in it; leave it out and the
 * phone shows the visitor's own time, as if the chat were happening now.
 */

export type ChatActor = "person" | "zox";

/** Zox shows "typing…" under its name for `duration`, as WhatsApp does. */
export interface TypingStep {
  type: "typing";
  actor: "zox";
  delay: number;
  duration: number;
}

/** A file sent with a message, drawn as a document card in the bubble. */
export interface ChatAttachment {
  kind: "pdf";
  name: string;
  /** The line under the name, for example "12 pages • 2 MB". */
  detail: string;
}

/** A message from the person. */
export interface MessageStep {
  type: "message";
  actor: "person";
  text: string;
  attachment?: ChatAttachment;
  time?: string;
  delay: number;
}

/** A reply from Zox. It arrives whole, as a WhatsApp message does. */
export interface ReplyStep {
  type: "reply";
  actor: "zox";
  text: string;
  time?: string;
  delay: number;
}

export type ChatStep = TypingStep | MessageStep | ReplyStep;

export interface ChatScript {
  /** A stable name, for logs and tests. */
  id: string;
  steps: ChatStep[];
}

/**
 * The hero phone's demo: a lecture PDF summed up, then the brief's sample
 * question about a mutex.
 * OPEN ITEM (landing brief, 00-README #1): placeholder. Replace with a
 * real, trimmed Zox conversation before launch; only this object changes.
 */
export const HERO_CHAT: ChatScript = {
  id: "hero-sample-pdf-mutex",
  steps: [
    {
      type: "message",
      actor: "person",
      text: "sum this up, short pls",
      attachment: { kind: "pdf", name: "CSC 305 Week 4.pdf", detail: "12 pages • PDF" },
      delay: 300,
    },
    { type: "typing", actor: "zox", delay: 400, duration: 1300 },
    {
      type: "reply",
      actor: "zox",
      text: "Week 4 in three lines: threads share memory. Two writing at once causes a race condition. A mutex stops that by letting only one in at a time.",
      delay: 0,
    },
    { type: "message", actor: "person", text: "can you explain what a mutex is, like i'm 12", delay: 1100 },
    { type: "typing", actor: "zox", delay: 500, duration: 1600 },
    {
      type: "reply",
      actor: "zox",
      text: "A mutex is a lock on a shared thing. Only one person can hold it at a time. Think of one bathroom key: if someone has it, you wait. That's all it is.",
      delay: 0,
    },
  ],
};
