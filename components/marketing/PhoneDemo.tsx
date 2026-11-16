"use client";

import {
  ArrowLeft,
  Camera,
  CheckCheck,
  Clock3,
  EllipsisVertical,
  Mic,
  Paperclip,
  Phone,
  SendHorizontal,
  Smile,
  Video,
} from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { LogoMark } from "@/components/ui/Logo";
import {
  HERO_CHAT,
  type ChatAttachment,
  type ChatScript,
  type ChatStep,
  type MessageStep,
  type ReplyStep,
} from "@/content/chat-script";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";
import { CHAT_MESSAGE_MAX } from "@/lib/site";
import { HandoffNote, useHandoff, useKeepInView } from "./Composer";
import { COMPOSER } from "./content";
import { PhoneStatusBar, chatTime, useNow } from "./PhoneStatusBar";

/**
 * - idle: nothing playing. Before the demo starts, and after it ends.
 * - demo: the script is playing.
 * - typing: the visitor is using the composer; the conversation is complete.
 * - handoff: the visitor sent a message and the page is leaving for WhatsApp.
 */
export type PhonePhase = "idle" | "demo" | "typing" | "handoff";

/** How long after hydration, at most, to wait for idle time before playing. */
const START_TIMEOUT = 1200;

const isBubble = (step: ChatStep): step is MessageStep | ReplyStep => step.type !== "typing";

/** A WhatsApp-style bubble: tail on the first corner, time (and ticks) tucked bottom-right. */
function Bubble({
  from,
  text,
  attachment,
  time,
  receipt,
}: {
  from: "person" | "zox";
  text: string;
  attachment?: ChatAttachment;
  time: string;
  /** read: the two blue ticks. pending: a clock, for a message not yet sent. */
  receipt?: "read" | "pending";
}) {
  const person = from === "person";
  return (
    <div
      className={cn(
        "relative rounded-md px-2.5 pt-1.5 pb-2 text-sm leading-snug text-wa-ink shadow-wa",
        person ? "rounded-tr-none bg-wa-out" : "rounded-tl-none bg-wa-in",
      )}
    >
      {/* The tail. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 h-3 w-2",
          person
            ? "-right-2 bg-wa-out [clip-path:polygon(0_0,100%_0,0_100%)]"
            : "-left-2 bg-wa-in [clip-path:polygon(0_0,100%_0,100%_100%)]",
        )}
      />
      <span className="sr-only">{person ? "You: " : "Zox: "}</span>
      {attachment ? (
        <span className="-mx-1 mb-1.5 flex items-center gap-2.5 rounded-sm bg-wa-doc px-2.5 py-2">
          <span
            aria-hidden="true"
            className="flex h-8 w-6.5 shrink-0 items-end justify-center rounded-xs bg-wa-pdf pb-1 text-[0.5rem] font-bold text-on-bubble"
          >
            PDF
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-medium">{attachment.name}</span>
            <span className="block text-micro text-wa-meta">{attachment.detail}</span>
          </span>
        </span>
      ) : null}
      <span className="break-words">{text}</span>
      {/* Room at the end of the last line for the time, as WhatsApp leaves it. */}
      <span aria-hidden="true" className={cn("inline-block", receipt ? "w-17" : "w-12")} />
      <span aria-hidden="true" className="absolute right-2 bottom-1 flex items-center gap-0.5 text-micro text-wa-meta">
        {time}
        {receipt === "read" ? <CheckCheck size={15} strokeWidth={2} className="text-wa-tick" /> : null}
        {receipt === "pending" ? <Clock3 size={11} strokeWidth={2} /> : null}
      </span>
    </div>
  );
}

/**
 * The hero phone (DESIGN.md, "Marketing motion", effect 2): a generic
 * handset drawn in CSS, with a WhatsApp-style chat with Zox on its screen,
 * and a composer that really sends.
 *
 * It plays `script` once after the page has painted: the person's message,
 * "typing…" under Zox's name, then Zox's reply, each bubble rising 8px as
 * it fades in. It pauses while the phone is off screen or the tab is hidden.
 * Every bubble is in the page from the first paint, hidden, so nothing
 * shifts as the demo plays and screen readers get the whole exchange.
 *
 * Any focus, press or typing in the composer ends the demo: what is left
 * fades in quickly, from wherever it was. Sending adds the visitor's
 * message as a bubble with a "sending" clock (nothing has been sent yet,
 * so no ticks and no reply), then hands over to WhatsApp. With reduced
 * motion the conversation is simply there.
 */
export function PhoneDemo({ script = HERO_CHAT }: { script?: ChatScript }) {
  const steps = script.steps;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<PhonePhase>("idle");
  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [text, setText] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const keepInView = useKeepInView(formRef);
  const now = useNow();
  // Every bubble without a scripted time shows the visitor's own clock.
  const timeOf = (time?: string) => time ?? (now ? chatTime(now) : "");
  const inputId = useId();
  const noteId = useId();

  const finish = useCallback(() => {
    setRevealed(steps.length);
    setTyping(false);
  }, [steps.length]);

  const { status, href, send } = useHandoff(
    useCallback((message: string) => {
      setSent(message);
      setPhase("handoff");
    }, []),
  );

  // Start once the page is idle after hydration. Reduced motion: show it all.
  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    const start = () => setPhase((current) => (current === "idle" ? "demo" : current));
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: START_TIMEOUT });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 200);
    return () => window.clearTimeout(id);
  }, [reduced, finish]);

  // Play only while the phone is on screen and the tab is showing.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let inView = false;
    const update = () => setOnScreen(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.25 },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // The script runner: one timer for the next thing to happen.
  useEffect(() => {
    if (phase !== "demo" || !onScreen) return;
    const step = steps[revealed];
    if (!step) {
      setPhase("idle");
      return;
    }
    let timer: number;
    if (step.type === "typing") {
      timer = typing
        ? window.setTimeout(() => {
            setTyping(false);
            setRevealed((n) => n + 1);
          }, step.duration)
        : window.setTimeout(() => setTyping(true), step.delay);
    } else {
      timer = window.setTimeout(() => setRevealed((n) => n + 1), step.delay);
    }
    return () => window.clearTimeout(timer);
  }, [phase, onScreen, revealed, typing, steps]);

  const engage = useCallback(() => {
    finish();
    setPhase((current) => (current === "handoff" ? current : "typing"));
  }, [finish]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    engage();
    send(text);
    setText(""); // As WhatsApp does: the message leaves the field.
  };

  const rise = reduced ? { duration: 0 } : { duration: duration.base, ease };
  const hasText = text.trim().length > 0;

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={rootRef} data-phase={phase}>
        {/* The handset: a tall, slim phone (19.5:9 screen), thin even bezels, buttons on the right. Dark in both themes. */}
        <div className="relative rounded-[2.6rem] bg-device p-2 shadow-device ring-1 ring-device-edge">
          <span aria-hidden="true" className="absolute top-32 -right-0.75 h-20 w-0.75 rounded-r-sm bg-device-edge" />
          <span aria-hidden="true" className="absolute top-56 -right-0.75 h-12 w-0.75 rounded-r-sm bg-device-edge" />

          <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.15rem] bg-wa-bg">
            {/* Status bar: real time, live Wi-Fi, signal and battery, the front camera in the middle. */}
            <PhoneStatusBar live={onScreen && !reduced} className="bg-wa-bar" />

            {/* Chat header: Zox, "online" or "typing…". */}
            <div className="flex h-14 items-center gap-1.5 bg-wa-bar pr-2 pl-1.5 text-wa-icon">
              <ArrowLeft aria-hidden="true" size={20} strokeWidth={2} className="shrink-0" />
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-tint">
                <LogoMark alt="" className="size-5" />
              </span>
              <div className="ml-1 min-w-0 flex-1 leading-tight">
                <p className="text-copy font-semibold text-wa-ink">Zox</p>
                <p aria-live="off" className="text-xs text-wa-meta">
                  {typing ? "typing…" : "online"}
                </p>
              </div>
              <span aria-hidden="true" className="flex items-center gap-4">
                <Video size={20} strokeWidth={1.8} />
                <Phone size={18} strokeWidth={1.8} />
                <EllipsisVertical size={20} strokeWidth={1.8} />
              </span>
            </div>

            <div className="wa-wallpaper flex min-h-0 flex-1 flex-col">
              {/* The screen's height is fixed by the phone, newest at the bottom: nothing moves as messages arrive. */}
              <ol
                role="list"
                aria-label="A chat with Zox"
                className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pt-3 pb-2"
              >
                <li aria-hidden="true" className="mb-1 self-center rounded-md bg-wa-date px-2.5 py-1 text-micro text-wa-meta shadow-wa">
                  Today
                </li>
                {steps.map((step, index) => {
                  if (!isBubble(step)) return null;
                  const person = step.actor === "person";
                  return (
                    <m.li
                      key={index}
                      data-chat-reveal=""
                      initial={{ opacity: 0, y: 8 }}
                      animate={index < revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={rise}
                      className={person ? "ml-auto max-w-[82%]" : "mr-auto max-w-[86%]"}
                    >
                      <Bubble
                        from={step.actor}
                        text={step.text}
                        attachment={step.type === "message" ? step.attachment : undefined}
                        time={timeOf(step.time)}
                        receipt={person ? "read" : undefined}
                      />
                    </m.li>
                  );
                })}
                {sent ? (
                  <m.li
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={rise}
                    className="ml-auto max-w-[82%]"
                  >
                    <Bubble from="person" text={sent} time={timeOf()} receipt="pending" />
                  </m.li>
                ) : null}
              </ol>

              {/* Suggestions, in one row that scrolls sideways. Tapping one fills the input. */}
              <ul
                role="list"
                aria-label="Suggestions"
                className="flex gap-2 overflow-x-auto px-2 pb-2 [scrollbar-width:none]"
              >
                {COMPOSER.suggestions.map((suggestion) => (
                  <li key={suggestion} className="shrink-0">
                    <button
                      type="button"
                      onPointerDown={engage}
                      onClick={() => {
                        engage();
                        setText(suggestion);
                      }}
                      className="min-h-9 rounded-full bg-wa-in px-3 text-note whitespace-nowrap text-wa-ink shadow-wa transition-colors duration-(--dur-fast) ease-zox hover:bg-wa-out max-sm:min-h-11"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>

              {/* The composer, WhatsApp style: the field, then the round button (mic when empty, send when not). */}
              <form ref={formRef} onSubmit={submit} className="flex items-end gap-1.5 px-1.5 pb-2">
                <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-wa-in px-3 text-wa-icon shadow-wa">
                  <Smile aria-hidden="true" size={22} strokeWidth={1.8} className="shrink-0" />
                  <label htmlFor={inputId} className="sr-only">
                    {COMPOSER.placeholder}
                  </label>
                  <input
                    id={inputId}
                    type="text"
                    value={text}
                    maxLength={CHAT_MESSAGE_MAX}
                    onPointerDown={engage}
                    onFocus={(event) => {
                      engage();
                      keepInView(event.currentTarget);
                    }}
                    onChange={(event) => {
                      engage();
                      setText(event.target.value);
                    }}
                    placeholder={COMPOSER.placeholder}
                    aria-describedby={noteId}
                    autoComplete="off"
                    enterKeyHint="send"
                    className="min-w-0 flex-1 bg-transparent py-2 text-base text-wa-ink outline-none placeholder:text-wa-meta"
                  />
                  <Paperclip aria-hidden="true" size={19} strokeWidth={1.8} className="shrink-0 -rotate-45" />
                  {hasText ? null : <Camera aria-hidden="true" size={20} strokeWidth={1.8} className="shrink-0" />}
                </div>
                <button
                  type="submit"
                  aria-label={COMPOSER.sendLabel}
                  onPointerDown={engage}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-wa-green text-wa-on-green transition-transform duration-(--dur-fast) ease-zox active:scale-[0.96]"
                >
                  {hasText ? (
                    <SendHorizontal aria-hidden="true" size={20} strokeWidth={2} />
                  ) : (
                    <Mic aria-hidden="true" size={21} strokeWidth={2} />
                  )}
                </button>
              </form>

              {/* The gesture bar. */}
              <div aria-hidden="true" className="flex h-5 items-start justify-center">
                <span className="h-1 w-28 rounded-full bg-wa-meta opacity-50" />
              </div>
            </div>
          </div>
        </div>

        <HandoffNote id={noteId} status={status} href={href} centered className="mt-5" />
      </div>
    </LazyMotion>
  );
}
