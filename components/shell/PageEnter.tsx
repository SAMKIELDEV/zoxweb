"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { pageEnter, reducedFade } from "@/lib/motion";

/**
 * The page-enter motion: fade plus an 8px rise, once per navigation.
 * With reduced motion the rise is dropped and the fade is cut to 80ms.
 */
export function PageEnter({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : pageEnter.initial}
      animate={reduced ? { opacity: 1 } : pageEnter.animate}
      transition={reduced ? reducedFade : pageEnter.transition}
    >
      {children}
    </motion.div>
  );
}
