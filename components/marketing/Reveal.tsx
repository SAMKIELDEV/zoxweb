"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";

/** How much of the watched element must show: about half on desktop, about a third on phones. */
export interface InViewAmount {
  desktop: number;
  phone: number;
}

export const DEFAULT_AMOUNT: InViewAmount = { desktop: 0.5, phone: 0.35 };

/** The lowest fifth of the screen does not count as "in view". */
const ROOT_MARGIN = "0px 0px -20% 0px";
const STEPS = Array.from({ length: 21 }, (_, index) => index / 20);

/** True when the visitor's browser runs the reveals: script ran the inline flag and motion is allowed. */
export function motionAllowed(): boolean {
  return document.documentElement.dataset.motion === "ok";
}

/**
 * Calls `onEnter` once, the first time `ref`'s element is genuinely in view
 * (DESIGN.md, "Scroll triggers"): `amount` of it visible above the bottom
 * 20% of the screen, or, for an element taller than the screen, that share
 * of the screen filled by it.
 */
export function useInViewOnce(ref: RefObject<Element | null>, onEnter: () => void, amount: InViewAmount = DEFAULT_AMOUNT) {
  const callback = useRef(onEnter);
  useEffect(() => {
    callback.current = onEnter;
  });
  const { desktop, phone } = amount;

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const share = window.matchMedia("(min-width: 48rem)").matches ? desktop : phone;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry?.isIntersecting) return;
        const screen = entry.rootBounds?.height ?? window.innerHeight * 0.8;
        const needed = Math.min(entry.boundingClientRect.height, screen) * share;
        if (entry.intersectionRect.height + 1 < needed) return;
        observer.disconnect();
        callback.current();
      },
      { rootMargin: ROOT_MARGIN, threshold: STEPS },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, desktop, phone]);
}

/**
 * Plays one section's content animation, once, when it is genuinely in
 * view. It only sets a state attribute on its element; the animation is CSS
 * on the children, written with the `pre-reveal:` variant for the start
 * pose (app/globals.css):
 *
 * - "pending": what the server renders. CSS shows the start pose only when
 *   <html> is data-motion="ok" (script on, motion allowed); otherwise this
 *   is the final look. So the final state never flashes before the
 *   animation, and a visitor without script still sees everything.
 * - "shown": the trigger fired; transitions carry the children to the
 *   final look.
 *
 * Watch the element that animates, not a taller wrapper: on a phone a
 * section's text can be on screen while its illustration is still below.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  amount = DEFAULT_AMOUNT,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  amount?: InViewAmount;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"pending" | "shown">("pending");

  // With reduced motion there is nothing to wait for.
  useEffect(() => {
    if (!motionAllowed()) setState("shown");
  }, []);
  useInViewOnce(ref, () => setState("shown"), amount);

  return (
    <Tag ref={ref} data-reveal={state} className={cn("group/reveal", className)} {...rest}>
      {children}
    </Tag>
  );
}
