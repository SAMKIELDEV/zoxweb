import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "soft" | "quiet" | "danger";
export type ButtonSize = "lg" | "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,transform] duration-(--dur-fast) ease-zox " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-50";

/** One primary per view. Everything else is secondary or quiet. */
const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent-strong text-on-accent hover:bg-accent-deep",
  secondary: "border border-line text-ink hover:bg-wash",
  soft: "bg-surface text-ink hover:bg-wash",
  quiet: "text-ink-2 hover:bg-wash hover:text-ink",
  danger: "border border-line text-danger hover:bg-wash",
};

/**
 * md is 44px tall, the minimum tap target. sm is for dense desktop rows.
 * lg (52px) is the landing page's main call to action.
 * Each size sets its own text size, so no two size classes ever meet.
 */
const sizes: Record<ButtonSize, string> = {
  lg: "h-13 px-6 text-copy",
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
};

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Work this button started is still running. It looks disabled and
   * ignores presses, but stays focusable. Use this, not `disabled`, for
   * "in progress": a natively disabled button drops keyboard focus, and
   * the person has to find it again when the work ends or fails.
   * Keep `disabled` for "this cannot be done right now".
   */
  busy?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** Stops a press, including the form submit it would otherwise trigger. */
const swallow = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

export function Button({ variant, size, className, type = "button", busy = false, onClick, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      aria-disabled={busy || undefined}
      aria-busy={busy || undefined}
      onClick={busy ? swallow : onClick}
      className={buttonClass(variant, size, className)}
      {...rest}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Opens in a new tab and skips the client router. */
  external?: boolean;
}

/** A link that looks like a button, for actions that navigate. */
export function ButtonLink({ href, variant, size, className, children, external }: ButtonLinkProps) {
  const classes = buttonClass(variant, size, className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
