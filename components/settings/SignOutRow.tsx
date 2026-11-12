"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useSignOut } from "@/hooks/useSignOut";

/**
 * The way out of the dashboard. It needs no account data, so it renders
 * in every state of the page: on mobile there is no sidebar, and this row
 * is the only place to sign out.
 * States: ready, signing out (the button is marked busy and ignores
 * presses, but keeps keyboard focus), and failed, which adds a line under
 * the row and leaves the button ready for another try.
 */
export function SignOutRow() {
  const { busy, failed, signOut } = useSignOut();

  // The failure message lands under the row, where a phone's bottom nav can
  // cover it, so bring it into view. Focus normally stays on the button; if
  // it has been lost to the page, put it on the message, one step from the
  // button. Focus the person has moved elsewhere is left alone.
  const alert = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!failed) return;
    alert.current?.scrollIntoView({ block: "nearest" });
    const active = document.activeElement;
    if (!active || active === document.body) alert.current?.focus();
  }, [failed]);

  return (
    <section aria-labelledby="sign-out-heading">
      <h2 id="sign-out-heading" className="mb-4 text-lg font-semibold text-ink">
        Sign out
      </h2>
      <div className="flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-baseline sm:justify-between">
        {/* The session is SAMKIEL ID's and shared, so this is not only Zox. */}
        <p className="text-base text-ink-2">Sign out of Zox and your SAMKIEL ID in this browser.</p>
        <Button variant="secondary" onClick={() => void signOut()} busy={busy} className="w-full shrink-0 sm:w-auto">
          {busy ? "Signing out" : "Sign out"}
        </Button>
      </div>
      {failed ? (
        <p ref={alert} role="alert" tabIndex={-1} className="mt-3 text-sm text-danger">
          Couldn&apos;t sign you out. Try again.
        </p>
      ) : null}
    </section>
  );
}
