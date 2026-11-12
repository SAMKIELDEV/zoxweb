import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const textLinkClass =
  "text-accent-ink underline underline-offset-4 transition-colors duration-(--dur-fast) ease-zox hover:text-ink";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Opens in a new tab and skips the client router. */
  external?: boolean;
}

/** An inline link. The underline is the signal, so color is never the only one. */
export function TextLink({ href, children, className, external }: TextLinkProps) {
  const classes = cn(textLinkClass, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
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
