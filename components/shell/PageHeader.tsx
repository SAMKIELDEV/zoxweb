import type { ReactNode } from "react";

interface PageHeaderProps {
  /** The page's one h1. */
  title: string;
  /** One short line under the title, in `ink-2`. */
  subtitle?: ReactNode;
  /** At most one primary action, set to the right of the title. */
  action?: ReactNode;
}

/**
 * The top of every dashboard page, inside the content area (DESIGN.md,
 * "Dashboard shell"): the serif title, an optional one-line subtitle, and
 * at most one primary action. It renders in every state of the page, so
 * the title is there while the content loads or fails.
 */
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="mb-10 flex items-end justify-between gap-4 md:mb-12">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-[60ch] text-base text-ink-2">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
