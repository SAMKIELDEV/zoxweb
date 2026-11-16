"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { flip } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

/** +1 when the number went up, -1 when it went down. */
type Direction = 1 | -1;

// Going up, the old digit flips away upward and the new one comes up from
// below. Going down (credits spent), the other way round.
const digit: Variants = {
  enter: (direction: Direction) => ({ y: `${50 * direction}%`, rotateX: -80 * direction, opacity: 0 }),
  center: { y: "0%", rotateX: 0, opacity: 1 },
  exit: (direction: Direction) => ({ y: `${-50 * direction}%`, rotateX: 80 * direction, opacity: 0 }),
};

/**
 * A whole number, such as a balance, whose digits flip to their new
 * values when it changes. Only the digits that changed move, each a beat
 * after the one to its right, the way a flip counter turns over.
 * Nothing moves on first render: a number that was already true should
 * just be there. With reduced motion it switches without moving.
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reduced = useReducedMotion();

  // Which way the last change went, worked out while rendering so the
  // new digits and the leaving ones agree on it. Setting state here makes
  // React render again at once with the new direction, before painting.
  const [last, setLast] = useState<{ value: number; direction: Direction }>({ value, direction: 1 });
  if (last.value !== value) setLast({ value, direction: value < last.value ? -1 : 1 });
  const direction = last.direction;

  const text = formatCount(value);
  const chars = text.split("");

  return (
    <span className={cn("tabular-nums", className)}>
      <span aria-hidden="true" className="inline-flex" style={{ perspective: "600px" }}>
        {reduced
          ? text
          : chars.map((char, index) => {
              // Keyed by place value (ones, tens, ...) so a digit keeps its
              // slot when the number gains or loses a digit at the front.
              const place = chars.length - 1 - index;
              if (!/\d/.test(char)) return <span key={`sep-${place}`}>{char}</span>;
              return (
                <span key={place} className="inline-grid">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.span
                      key={char}
                      custom={direction}
                      variants={digit}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ ...flip.transition, delay: place * flip.stagger }}
                      className="[grid-area:1/1] inline-block [backface-visibility:hidden]"
                    >
                      {char}
                    </motion.span>
                  </AnimatePresence>
                </span>
              );
            })}
      </span>
      {/* Screen readers get the settled value, never the moving digits. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
