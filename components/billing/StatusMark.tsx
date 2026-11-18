import type { TransactionStatus } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { statusTone, statusWord } from "@/lib/purchases";

const dot = {
  positive: "bg-positive",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-track",
} as const;

/**
 * A purchase's status: a small dot in its status color, then the word.
 * The word carries the meaning; the dot only repeats it. Text stays in
 * `ink-2`, since `warning` is a mark color only (DESIGN.md section 2).
 */
export function StatusMark({ status, className }: { status: TransactionStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-ink-2", className)}>
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot[statusTone(status)])} />
      {statusWord(status)}
    </span>
  );
}
