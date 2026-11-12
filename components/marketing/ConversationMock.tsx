import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { HERO_CONVERSATION, HERO_CONVERSATION_SUMMARY, type ChatMessage } from "./content";

/**
 * Where each bubble sits in the frame and which corner is its tail, in
 * the order the messages are written. This is layout only: the words live
 * in content.ts.
 */
const PLACEMENT = [
  { position: "top-[10%] right-[10%] max-w-52.5", tail: "rounded-br-xs" },
  { position: "top-[32%] right-[4%] max-w-57.5", tail: "rounded-tr-xs" },
  { position: "bottom-[24%] left-[6%] max-w-47.5", tail: "rounded-br-xs" },
  { position: "bottom-[8%] right-[12%] max-w-55", tail: "rounded-tl-xs" },
] as const;

/** Zox's replies take the two brand colors in turn. */
const REPLY_TONES = [
  {
    bubble: "bg-linear-to-br from-bubble-accent to-bubble-accent-end shadow-bubble-accent",
    text: "text-on-bubble",
    time: "text-on-bubble/60",
  },
  {
    bubble: "bg-linear-to-br from-bubble-forest to-bubble-forest-end shadow-bubble-forest",
    text: "text-on-bubble/90",
    time: "text-on-bubble/40",
  },
] as const;

// The time uses ink-2, not the design's fainter grey: on a white bubble that grey is under 4.5:1.
const PERSON_TONE = { bubble: "border border-line bg-card shadow-bubble", text: "text-ink", time: "text-ink-2" } as const;

/** Pairs each message with its look: a person's bubble, or the next reply color. */
function withTones(messages: readonly ChatMessage[]) {
  let replies = 0;
  return messages.map((message) => ({
    message,
    tone: message.from === "person" ? PERSON_TONE : REPLY_TONES[replies++ % REPLY_TONES.length],
  }));
}

/**
 * The hero's illustration: a short WhatsApp exchange with Zox, built from
 * markup so it stays sharp and themes with the page. It is a picture of
 * the product, so assistive technology gets one description of it and not
 * the loose fragments. Shown from 1024px, where there is room beside the
 * headline.
 */
export function ConversationMock({ className }: { className?: string }) {
  return (
    <div role="img" aria-label={HERO_CONVERSATION_SUMMARY} className={cn("relative h-115", className)}>
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        {/* Soft color behind the chat. */}
        <div className="absolute top-[8%] right-[5%] h-75 w-80 rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-accent opacity-[0.11] blur-[56px]" />
        <div className="absolute bottom-[12%] left-[8%] h-47.5 w-50 rounded-[44%_56%_36%_64%/60%_44%_56%_40%] bg-forest opacity-10 blur-2xl" />
        <div className="absolute top-[40%] left-[30%] h-27.5 w-30 rounded-full bg-accent opacity-[0.07] blur-xl" />
        {/* The brand's "z", large and faint. */}
        <LogoMark alt="" className="size-70 opacity-[0.08]" />

        {withTones(HERO_CONVERSATION).map(({ message, tone }, index) => {
          const place = PLACEMENT[index % PLACEMENT.length];
          return (
            <div key={message.text} className={cn("absolute rounded-lg px-4 py-3", place.position, place.tail, tone.bubble)}>
              <p className={cn("text-note", tone.text)}>{message.text}</p>
              <p className={cn("mt-1 text-micro", tone.time)}>{message.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
