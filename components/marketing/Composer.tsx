"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from "react";
import { cn } from "@/lib/cn";
import { CHAT_MESSAGE_MAX, START_CHAT, cleanChatMessage, whatsAppLinkWithText } from "@/lib/site";
import { COMPOSER } from "./content";

/** Time for the visitor's own bubble to land before the page leaves (when there is one). */
const BUBBLE_MS = 250;
/** How long to wait before offering the fallback, if the page is still showing. */
const FALLBACK_MS = 1500;

export type HandoffStatus = "ready" | "handoff" | "fallback";

/**
 * Sending a composer's message to WhatsApp. It navigates this tab
 * (location.assign), which phones hand to the WhatsApp app. While that
 * happens the status is "handoff"; if the page is still on screen 1.5s
 * later, the hand-off failed or was refused, and the status turns
 * "fallback" so a plain link can be offered. With no WhatsApp number
 * configured it goes to sign-in, like every other chat button on the page.
 *
 * `onSend` gets the cleaned message first; when given, the page waits
 * BUBBLE_MS so the caller can show it as a bubble.
 */
export function useHandoff(onSend?: (message: string) => void) {
  const [status, setStatus] = useState<HandoffStatus>("ready");
  const [href, setHref] = useState<string>(START_CHAT.href);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // Back on this page from WhatsApp (the back-forward cache keeps the old
  // state): offer the link again rather than "Opening WhatsApp".
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) setStatus((current) => (current === "ready" ? current : "fallback"));
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const send = (text: string) => {
    const message = cleanChatMessage(text);
    const target = whatsAppLinkWithText(message) ?? START_CHAT.href;
    const bubble = Boolean(onSend && message);
    setHref(target);
    setStatus("handoff");
    if (bubble) onSend?.(message);
    timers.current.push(
      window.setTimeout(() => window.location.assign(target), bubble ? BUBBLE_MS : 0),
      window.setTimeout(() => {
        if (document.visibilityState === "visible") setStatus("fallback");
      }, FALLBACK_MS),
    );
  };

  return { status, href, send, reset: () => setStatus("ready") };
}

/**
 * Phones: the keyboard shrinks the visual viewport. Returns a focus handler
 * that keeps `target` in view while the input has focus. Never focuses
 * anything itself.
 */
export function useKeepInView(target: RefObject<HTMLElement | null>) {
  return (input: HTMLInputElement) => {
    const viewport = window.visualViewport;
    const element = target.current;
    if (!viewport || !element) return;
    const reveal = () => element.scrollIntoView({ block: "nearest" });
    viewport.addEventListener("resize", reveal);
    input.addEventListener("blur", () => viewport.removeEventListener("resize", reveal), { once: true });
  };
}

/**
 * The line under a composer (DESIGN.md, "Composers"): its hint before
 * sending, "Opening WhatsApp with your message ready" once Send is tapped,
 * then the fallback link if the hand-off is blocked.
 */
export function HandoffNote({
  id,
  status,
  href,
  hint,
  centered = false,
  className,
}: {
  id: string;
  status: HandoffStatus;
  href: string;
  /** Shown before sending: COMPOSER.hint.hero or .cta. */
  hint: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    // min-h holds the line's height, so swapping in the fallback button moves nothing.
    <div id={id} aria-live="polite" className={cn("min-h-11 text-note text-ink-2", centered && "text-center", className)}>
      {status === "ready" ? <p>{hint}</p> : null}
      {status === "handoff" ? <p>{COMPOSER.handoff}</p> : null}
      {status === "fallback" ? (
        <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", centered && "justify-center")}>
          <span>{COMPOSER.handoff}</span>
          <a
            href={href}
            className="inline-flex min-h-11 items-center rounded-full bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors duration-(--dur-fast) ease-zox hover:bg-accent-deep"
          >
            {COMPOSER.fallback}
          </a>
        </p>
      ) : null}
    </div>
  );
}

/**
 * The composer standing on the page (brief 08, the closing section).
 * Whatever is typed goes to WhatsApp as a ready message: WhatsApp fills it
 * in, the person presses send there. The hero's phone has its own,
 * WhatsApp-style composer built on the same hooks (PhoneDemo.tsx).
 */
export function Composer({ className }: { className?: string }) {
  const [text, setText] = useState("");
  const { status, href, send, reset } = useHandoff();
  const formRef = useRef<HTMLFormElement>(null);
  const keepInView = useKeepInView(formRef);
  const inputId = useId();
  const noteId = useId();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(text);
  };

  return (
    <div className={className}>
      <form
        ref={formRef}
        onSubmit={submit}
        className="flex items-center gap-2 rounded-full border border-line bg-card p-1.5 pl-4 shadow-card"
      >
        <label htmlFor={inputId} className="sr-only">
          {COMPOSER.placeholder}
        </label>
        <input
          id={inputId}
          type="text"
          value={text}
          maxLength={CHAT_MESSAGE_MAX}
          onFocus={(event) => keepInView(event.currentTarget)}
          onChange={(event) => {
            setText(event.target.value);
            reset();
          }}
          placeholder={COMPOSER.placeholder}
          aria-describedby={noteId}
          autoComplete="off"
          enterKeyHint="send"
          className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink-2"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-accent-strong px-5 text-sm font-medium text-on-accent transition-[background-color,transform] duration-(--dur-fast) ease-zox hover:bg-accent-deep active:scale-[0.96]"
        >
          {COMPOSER.send}
        </button>
      </form>
      <HandoffNote id={noteId} status={status} href={href} hint={COMPOSER.hint.cta} className="mt-3" />
    </div>
  );
}
