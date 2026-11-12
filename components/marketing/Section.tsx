import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The landing page's content column: 1152px at most, 24px side padding. */
export const container = "mx-auto w-full max-w-6xl px-6";

/**
 * The small all-caps label above a section title. It is a paragraph, not
 * a heading: the h2 under it is the section's name.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-2.5 text-xs font-semibold tracking-[0.12em] text-eyebrow uppercase">{children}</p>;
}

/**
 * Letter-spacing for the public pages' headings. The dashboard tightens its
 * headings a little (globals.css); the landing page design does not.
 */
export const headingTracking = "tracking-normal";

/** A section title. `lines` are stacked, as the design breaks them. */
export function SectionTitle({ id, lines, className }: { id: string; lines: readonly string[]; className?: string }) {
  return (
    <h2 id={id} className={cn("font-display text-title font-semibold text-ink", headingTracking, className)}>
      {lines.map((line, index) => (
        <span key={line} className="block">
          {line}
          {/* A space between the stacked lines, so the heading reads as one sentence. */}
          {index < lines.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}
