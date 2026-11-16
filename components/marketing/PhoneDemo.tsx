"use client";

import { ArrowLeft, Camera, EllipsisVertical, Mic, Paperclip, Phone, SendHorizontal, Smile, Video } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { LogoMark } from "@/components/ui/Logo";
import {
  HERO_HISTORY_IDS,
  HERO_SCENARIOS,
  playableScenarios,
  type ChatActor,
  type ChatContent,
  type ChatScenario,
  type ChatStep,
} from "@/content/chat-script";
import { cn } from "@/lib/cn";
import { CHAT_MESSAGE_MAX } from "@/lib/site";
import { ChatBubble, type Receipt } from "./ChatBubble";
import { HandoffNote, useHandoff, useKeepInView } from "./Composer";
import { COMPOSER } from "./content";
import { PhoneStatusBar, chatTime, useNow } from "./PhoneStatusBar";

/**
 * - idle: nothing playing yet (before hydration, or with reduced motion).
 * - demo: scenarios are playing, one after another.
 * - typing: the visitor is using the composer; the demo has stopped.
 * - handoff: the visitor sent a message and the page is leaving for WhatsApp.
 */
export type PhonePhase = "idle" | "demo" | "typing" | "handoff";

interface ChatMessage {
  key: string;
  from: ChatActor;
  content: ChatContent;
  receipt?: Receipt;
  /** Added after the page loaded, so it fades in. */
  fresh?: boolean;
}

/** How long after hydration, at most, to wait for idle time before playing. */
const START_TIMEOUT = 1200;
/** The pause between one scenario's last bubble and the next one's first. */
const SCENARIO_GAP = 2600;
/** Older bubbles beyond this are dropped; they are long out of view. */
const KEEP = 12;
/** The gap between bubbles (gap-1.5), for the scroll. */
const BUBBLE_GAP = 6;

type SendStep = Extract<ChatStep, { type: "send" }>;
const sends = (scenario: ChatScenario) => scenario.steps.filter((step): step is SendStep => step.type === "send");

const toMessage = (step: SendStep, key: string, fresh: boolean): ChatMessage => ({
  key,
  from: step.from,
  content: step.content,
  receipt: step.from === "person" ? "read" : undefined,
  fresh,
});

/** What is already in the chat when the page loads. The same on the server and in the browser. */
const HISTORY: ChatMessage[] = HERO_HISTORY_IDS.flatMap((id) => {
  const scenario = HERO_SCENARIOS.find((item) => item.id === id);
  return scenario ? sends(scenario).map((step, index) => toMessage(step, `history-${id}-${index}`, false)) : [];
});

/** A shuffled round of scenario ids, never starting with the one that just played. */
function shuffledRound(ids: string[], last?: string): string[] {
  const round = [...ids];
  for (let i = round.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [round[i], round[j]] = [round[j], round[i]];
  }
  if (round.length > 1 && round[0] === last) [round[0], round[1]] = [round[1], round[0]];
  return round;
}

/**
 * The hero phone (DESIGN.md, "Marketing motion", effect 2): a tall,
 * generic handset drawn in CSS, with a WhatsApp-style chat with Zox on it
 * and a composer that really sends.
 *
 * The chat opens with HERO_HISTORY already there, so the first paint is a
 * full conversation. After hydration it plays the other scenarios (a
 * YouTube link, voice notes both ways, a photo of a problem, a generated
 * poster, a web search...) in a shuffled order, and repeats none until
 * every one has played. Zox shows "typing…" or "recording audio…" under
 * its name first, as WhatsApp does. New bubbles fade in and the chat
 * scrolls up under them. It runs only while the phone is on screen and
 * the tab is showing.
 *
 * Any focus, press or typing in the composer stops the demo; a half-played
 * exchange finishes at once. Sending adds the visitor's message with a
 * "sending" clock (nothing has been sent yet, so no ticks and no reply),
 * then hands over to WhatsApp. With reduced motion the opening
 * conversation stays as it is.
 */
export function PhoneDemo() {
  const [phase, setPhase] = useState<PhonePhase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>(HISTORY);
  const [status, setStatus] = useState<"online" | "typing" | "recording">("online");
  const [current, setCurrent] = useState<{ scenario: ChatScenario; cursor: number } | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [text, setText] = useState("");
  const currentRef = useRef(current);
  const round = useRef<string[]>([]);
  const lastPlayed = useRef<string | undefined>(undefined);
  const counter = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const keepInView = useKeepInView(formRef);
  const now = useNow();
  const inputId = useId();
  const noteId = useId();
  const time = now ? chatTime(now) : "";

  const append = useCallback((added: ChatMessage[]) => {
    setMessages((list) => [...list, ...added].slice(-KEEP));
  }, []);

  const { status: handoff, href, send } = useHandoff(
    useCallback(
      (message: string) => {
        append([
          {
            key: `sent-${counter.current++}`,
            from: "person",
            content: { kind: "text", text: message },
            receipt: "pending",
            fresh: true,
          },
        ]);
        setPhase("handoff");
      },
      [append],
    ),
  );

  // Reduced motion: no demo. Otherwise start once the page is idle after hydration.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    if (query.matches) return;
    const start = () => setPhase((value) => (value === "idle" ? "demo" : value));
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: START_TIMEOUT });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 200);
    return () => window.clearTimeout(id);
  }, []);

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

  // The runner: one timer for the next thing to happen.
  useEffect(() => {
    if (phase !== "demo" || !onScreen) return;
    let timer: number;
    if (!current) {
      // Between scenarios: the next from this round; a new shuffled round once all have played.
      timer = window.setTimeout(() => {
        if (round.current.length === 0) {
          const ids = playableScenarios().map((scenario) => scenario.id);
          // The first round skips what the chat opened with, since it has just been seen.
          const opening = lastPlayed.current === undefined;
          round.current = shuffledRound(
            opening ? ids.filter((id) => !(HERO_HISTORY_IDS as readonly string[]).includes(id)) : ids,
            lastPlayed.current,
          );
        }
        const id = round.current.shift();
        const scenario = HERO_SCENARIOS.find((item) => item.id === id);
        if (scenario) {
          lastPlayed.current = scenario.id;
          setCurrent({ scenario, cursor: 0 });
        }
      }, SCENARIO_GAP);
      return () => window.clearTimeout(timer);
    }
    const step = current.scenario.steps[current.cursor];
    const next = () => setCurrent((value) => (value ? { ...value, cursor: value.cursor + 1 } : value));
    if (!step) {
      setCurrent(null);
      return;
    }
    if (step.type === "wait") {
      timer =
        status === "online"
          ? window.setTimeout(() => setStatus(step.status), step.delay)
          : window.setTimeout(() => {
              setStatus("online");
              next();
            }, step.duration);
    } else {
      timer = window.setTimeout(() => {
        append([toMessage(step, `${current.scenario.id}-${counter.current++}`, true)]);
        next();
      }, step.delay);
    }
    return () => window.clearTimeout(timer);
  }, [phase, onScreen, current, status, append]);

  // The chat scrolls up under a new bubble: the list is pushed down by the
  // bubble's height, then eases back. A transform only, so nothing is laid
  // out again; with reduced motion the global rule makes it instant.
  const shown = useRef(messages.length);
  useLayoutEffect(() => {
    const list = listRef.current;
    const added = messages.length - shown.current;
    shown.current = messages.length;
    const last = list?.lastElementChild as HTMLElement | null;
    if (!list || !last || added < 1 || reduced) return;
    list.style.transition = "none";
    list.style.transform = `translateY(${last.offsetHeight + BUBBLE_GAP}px)`;
    void list.offsetHeight;
    list.style.transition = "transform var(--dur-slow) var(--ease-zox)";
    list.style.transform = "";
  }, [messages, reduced]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // The visitor takes over: stop the demo, and finish a half-played exchange at once.
  const engage = useCallback(() => {
    setPhase((value) => (value === "handoff" ? value : "typing"));
    setStatus("online");
    const value = currentRef.current;
    if (value) {
      currentRef.current = null;
      const rest = value.scenario.steps.slice(value.cursor).filter((step): step is SendStep => step.type === "send");
      if (rest.length) append(rest.map((step) => toMessage(step, `${value.scenario.id}-${counter.current++}`, true)));
    }
    setCurrent(null);
  }, [append]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    engage();
    send(text);
    setText(""); // As WhatsApp does: the message leaves the field.
  };

  const hasText = text.trim().length > 0;
  const statusLine = status === "typing" ? "typing…" : status === "recording" ? "recording audio…" : "online";

  return (
    <div ref={rootRef} data-phase={phase}>
      {/* The handset: a tall, slim phone (19.5:9 screen), thin even bezels, buttons on the right. Dark in both themes. */}
      <div className="relative rounded-[2.6rem] bg-device p-2 shadow-device ring-1 ring-device-edge">
        <span aria-hidden="true" className="absolute top-32 -right-0.75 h-20 w-0.75 rounded-r-sm bg-device-edge" />
        <span aria-hidden="true" className="absolute top-56 -right-0.75 h-12 w-0.75 rounded-r-sm bg-device-edge" />

        {/* On wide screens the frame and the line under it fit the window: shorter on a short window, never taller than 19.5:9. */}
        <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.15rem] bg-wa-bg lg:aspect-auto lg:h-[clamp(28rem,calc(100dvh-9.75rem),41rem)]">
          <PhoneStatusBar live={onScreen && !reduced} className="shrink-0 bg-wa-bar" />

          {/* Chat header: Zox, then "online", "typing…" or "recording audio…". */}
          <div className="flex h-14 shrink-0 items-center gap-1.5 bg-wa-bar pr-2 pl-1.5 text-wa-icon">
            <ArrowLeft aria-hidden="true" size={20} strokeWidth={2} className="shrink-0" />
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-tint">
              <LogoMark alt="" className="size-5" />
            </span>
            <div className="ml-1 min-w-0 flex-1 leading-tight">
              <p className="text-copy font-semibold text-wa-ink">Zox</p>
              <p className="text-xs text-wa-meta">{statusLine}</p>
            </div>
            <span aria-hidden="true" className="flex items-center gap-4">
              <Video size={20} strokeWidth={1.8} />
              <Phone size={18} strokeWidth={1.8} />
              <EllipsisVertical size={20} strokeWidth={1.8} />
            </span>
          </div>

          <div className="wa-wallpaper flex min-h-0 flex-1 flex-col">
            {/* Newest at the bottom; older bubbles slide up and out of view. */}
            <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 pt-3 pb-2">
              <div ref={listRef} role="list" aria-label="A chat with Zox" className="flex flex-col gap-1.5">
                <div
                  role="listitem"
                  aria-hidden="true"
                  className="mb-1 self-center rounded-md bg-wa-date px-2.5 py-1 text-micro text-wa-meta shadow-wa"
                >
                  Today
                </div>
                {messages.map((message) => (
                  <div
                    key={message.key}
                    role="listitem"
                    className={cn(
                      message.from === "person" ? "ml-auto max-w-[84%]" : "mr-auto max-w-[86%]",
                      message.fresh && "animate-[zox-bubble-in_var(--dur-base)_var(--ease-zox)_both]",
                    )}
                  >
                    <ChatBubble from={message.from} content={message.content} time={time} receipt={message.receipt} />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions, in one row that scrolls sideways. Tapping one fills the input. */}
            <ul
              role="list"
              aria-label="Suggestions"
              className="flex shrink-0 gap-2 overflow-x-auto px-2 pb-2 [scrollbar-width:none]"
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
            <form ref={formRef} onSubmit={submit} className="flex shrink-0 items-end gap-1.5 px-1.5 pb-2">
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
            <div aria-hidden="true" className="flex h-5 shrink-0 items-start justify-center">
              <span className="h-1 w-28 rounded-full bg-wa-meta opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <HandoffNote id={noteId} status={handoff} href={href} centered className="mt-4" />
    </div>
  );
}
