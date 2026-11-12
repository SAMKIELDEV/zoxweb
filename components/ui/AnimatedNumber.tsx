"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { duration, ease } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/**
 * A whole number that counts to its new value when it changes, for
 * example a balance after a top-up. It does not count up on first
 * render: a number that was already true should just be there.
 * With reduced motion it switches without counting.
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduced = useReducedMotion();
  // React writes this text once. After that the effect owns the node, so
  // a re-render can never snap the number to its end value mid-count.
  const [initialText] = useState(() => formatCount(value));

  useEffect(() => {
    const element = node.current;
    const from = shown.current;
    if (!element || from === value) return;

    if (reduced) {
      shown.current = value;
      element.textContent = formatCount(value);
      return;
    }

    const controls = animate(from, value, {
      duration: duration.slow,
      ease,
      onUpdate: (latest) => {
        shown.current = Math.round(latest);
        element.textContent = formatCount(shown.current);
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return (
    <span className={cn("tabular-nums", className)}>
      <span ref={node} aria-hidden="true">
        {initialText}
      </span>
      {/* Screen readers get the settled value, not every step of the count. */}
      <span className="sr-only">{formatCount(value)}</span>
    </span>
  );
}
