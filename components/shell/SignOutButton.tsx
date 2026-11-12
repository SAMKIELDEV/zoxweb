"use client";

import { LogOut } from "lucide-react";
import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/cn";
import { ICON_STROKE } from "./nav";

interface SignOutButtonProps {
  className?: string;
  /** Classes for the text label, so the sidebar rail can hide it. */
  labelClassName?: string;
}

/**
 * The sidebar's sign-out row. Settings has its own, built on the same hook.
 *
 * While signing out, the button is marked aria-disabled and ignores
 * presses. It is not natively disabled, because that would drop keyboard
 * focus and leave nothing focused if the sign-out fails.
 *
 * A failure is always visible: under the button in the open sidebar, and
 * as a small note beside the 64px icon rail, where there is no room under it.
 */
export function SignOutButton({ className, labelClassName }: SignOutButtonProps) {
  const { busy, failed, signOut } = useSignOut();

  return (
    <div className="relative flex flex-col gap-1">
      <button
        type="button"
        onClick={() => {
          if (!busy) void signOut();
        }}
        aria-disabled={busy || undefined}
        title="Sign out"
        className={cn(
          "flex h-11 items-center gap-3 rounded-md px-3 text-sm text-ink-2",
          "transition-colors duration-(--dur-fast) ease-zox hover:bg-wash hover:text-ink aria-disabled:opacity-50",
          className,
        )}
      >
        <LogOut aria-hidden="true" size={18} strokeWidth={ICON_STROKE} className="shrink-0" />
        <span className={labelClassName}>{busy ? "Signing out" : "Sign out"}</span>
      </button>
      {failed ? (
        <p
          role="alert"
          className={
            "px-3 text-xs text-danger " +
            "max-lg:absolute max-lg:bottom-1 max-lg:left-full max-lg:ml-3 max-lg:w-max " +
            "max-lg:rounded-md max-lg:border max-lg:border-line max-lg:bg-surface max-lg:py-2 max-lg:shadow-soft"
          }
        >
          Couldn&apos;t sign you out. Try again.
        </p>
      ) : null}
    </div>
  );
}
