"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

interface EmptyStateProps {
  /** One short line in Zox's voice. */
  message: string;
  /** One clear next step, if there is one. */
  action?: ReactNode;
  className?: string;
}

/** Nothing to show yet. No illustration: a line and, at most, one action. */
export function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-start gap-4 py-6", className)}>
      <p className="max-w-[52ch] text-base text-ink-2">{message}</p>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  /** What failed, in plain words. Never a raw error or status code. */
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Something failed to load. Says what, and offers another go.
 *
 * Only the message is the alert. The retry button sits outside it, so a
 * change of its label ("Try again", "Trying again") is not read out as a
 * fresh alert each time.
 */
export function ErrorState({ message, onRetry, retryLabel = "Try again", className }: ErrorStateProps) {
  const block = useRef<HTMLDivElement>(null);

  // When a retry works, the page replaces this block and the button that
  // had focus is gone. Hand focus to the page's main region so a keyboard
  // user is not dropped back at the top of the document. This runs as a
  // layout cleanup because that is the last moment the button is still in
  // the page and still focused.
  useLayoutEffect(() => {
    const node = block.current;
    return () => {
      if (!node || !node.contains(document.activeElement)) return;
      const main = node.closest("main");
      if (main instanceof HTMLElement) queueMicrotask(() => main.focus({ preventScroll: true }));
    };
  }, []);

  return (
    <div ref={block} className={cn("flex flex-col items-start gap-4 py-6", className)}>
      <p role="alert" className="max-w-[52ch] text-base text-ink">
        {message}
      </p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
