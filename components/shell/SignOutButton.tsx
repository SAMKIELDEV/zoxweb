"use client";

import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/cn";
import { NAV_ICON_SIZE } from "./nav";

interface SignOutButtonProps {
  className?: string;
  /** Classes for the text label, so the sidebar rail can hide it. */
  labelClassName?: string;
}

/**
 * The sign-out row at the foot of the sidebar and of the phone menu.
 * Settings has its own, built on the same hook.
 *
 * While signing out, the button is marked aria-disabled and ignores
 * presses. It is not natively disabled, because that would drop keyboard
 * focus and leave nothing focused if the sign-out fails.
 *
 * A failure is always visible: under the button in the open sidebar and
 * the phone menu, and as a small note beside the 64px icon rail (768 to
 * 1023px), where there is no room under it.
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
        <SignOut aria-hidden="true" size={NAV_ICON_SIZE} className="shrink-0" />
        <span className={labelClassName}>{busy ? "Signing out" : "Sign out"}</span>
      </button>
      {failed ? (
        <p
          role="alert"
          className={
            "px-3 text-xs text-danger " +
            "md:max-lg:absolute md:max-lg:bottom-1 md:max-lg:left-full md:max-lg:ml-3 md:max-lg:w-max " +
            "md:max-lg:rounded-md md:max-lg:border md:max-lg:border-line md:max-lg:bg-surface md:max-lg:py-2 md:max-lg:shadow-soft"
          }
        >
          Couldn&apos;t sign you out. Try again.
        </p>
      ) : null}
    </div>
  );
}
