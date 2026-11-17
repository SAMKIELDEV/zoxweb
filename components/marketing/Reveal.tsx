"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Plays one section's content animation, once, when it first scrolls into
 * view (DESIGN.md, "Marketing motion"). It only sets a state attribute on
 * its element; the animation itself is CSS on the children, written against
 * the `reveal` group:
 *
 * - no state: the final look. That is what the server renders, what a
 *   visitor without script sees, and what reduced motion keeps.
 * - "ready": the starting pose, set after hydration for a section that is
 *   still below the fold (`group-data-[reveal=ready]/reveal:opacity-0`...).
 * - "shown": back to the final look, with transitions, as it scrolls in.
 *
 * A section already on screen at load is left in its final look: animating
 * something the visitor is already reading would only hide it for a moment.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  threshold = 0.3,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** How much of the element must be visible to start. */
  threshold?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"ready" | "shown" | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return; // On screen already: keep the final look.
    setState("ready");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        // One frame in "ready" so the browser has the start pose before it transitions.
        requestAnimationFrame(() => setState("shown"));
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} data-reveal={state} className={cn("group/reveal", className)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * The same states, played on mount instead of on scroll: for an illustration
 * that is swapped in (the selected job in the editorial variant).
 */
export function PlayOnMount({ className, children }: { className?: string; children: ReactNode }) {
  const [state, setState] = useState<"ready" | "shown" | undefined>(undefined);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("ready");
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setState("shown")));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div data-reveal={state} className={cn("group/reveal", className)}>
      {children}
    </div>
  );
}
