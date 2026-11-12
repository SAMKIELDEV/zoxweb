import { cn } from "@/lib/cn";

/**
 * A placeholder block. Size it with classes so it matches the final
 * layout: a skeleton that is the wrong size causes a jump when data lands.
 *
 * To stand in for one line of text exactly, give it that text's size and
 * `h-lh`: `<Skeleton className="h-lh w-32 text-sm" />` is one line of
 * text-sm tall, whatever the line height is.
 *
 * Corners default to rounded-sm. Pass a `rounded-*` class to change them.
 */
export function Skeleton({ className }: { className?: string }) {
  // Only one radius class may reach the element. With two, the winner is
  // whichever comes later in the stylesheet, not the one passed in.
  const radius = className && /(^|\s)rounded-/.test(className) ? null : "rounded-sm";
  return <div aria-hidden="true" className={cn(radius, "bg-wash motion-safe:animate-pulse", className)} />;
}

/** Wraps a group of skeletons and tells assistive tech that content is loading. */
export function LoadingRegion({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-label={label} className={className}>
      {children}
    </div>
  );
}
