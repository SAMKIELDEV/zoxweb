"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isApiError } from "@/lib/api/client";
import { unlinkWhatsApp } from "@/lib/api/account";

interface UnlinkWhatsAppProps {
  /** The number as shown on the page, for the confirmation line. */
  phone: string;
  /** Called once the number is unlinked; the parent refetches the account. */
  onUnlinked: () => void;
}

/**
 * Disconnects the WhatsApp number from this SAMKIEL ID, after a second
 * press. Nothing is lost: credits, plan and chats belong to the number and
 * come back when it is linked again.
 * States: ready; confirming (the explanation and two buttons, focus on the
 * safe one); unlinking (busy, keeps focus); failed (a line under the row,
 * ready for another try).
 */
export function UnlinkWhatsApp({ phone, onUnlinked }: UnlinkWhatsAppProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const keepRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);

  // Focus follows the step: onto "Keep it linked" when the question opens,
  // back to the first button when it closes.
  useEffect(() => {
    if (confirming) {
      opened.current = true;
      keepRef.current?.focus();
    } else if (opened.current) {
      openRef.current?.focus();
    }
  }, [confirming]);

  async function unlink() {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await unlinkWhatsApp();
      onUnlinked();
    } catch (error) {
      // Already unlinked somewhere else (from WhatsApp, say): same outcome.
      if (isApiError(error) && error.status === 409) {
        onUnlinked();
        return;
      }
      // 401 is on its way to sign-in; anything else, a lost connection
      // included, gets a line and another try.
      if (!(isApiError(error) && error.status === 401)) setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      {!confirming ? (
        <div className="flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-base text-ink-2">Disconnect this number from your SAMKIEL ID.</p>
          <Button ref={openRef} variant="secondary" onClick={() => setConfirming(true)} className="w-full shrink-0 sm:w-auto">
            Unlink WhatsApp
          </Button>
        </div>
      ) : (
        <div role="group" aria-labelledby="unlink-question" className="border-y border-line py-4">
          <p id="unlink-question" className="text-base text-ink">
            Unlink {phone}?
          </p>
          <p className="mt-2 text-sm text-ink-2">
            Your credits, plan and chats stay with the number, and come back when you link it again. You can also unlink
            from WhatsApp by sending UNLINK.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button variant="danger" busy={busy} onClick={() => void unlink()} className="w-full sm:w-auto">
              {busy ? "Unlinking" : "Unlink"}
            </Button>
            <Button ref={keepRef} variant="quiet" disabled={busy} onClick={() => setConfirming(false)} className="w-full sm:w-auto">
              Keep it linked
            </Button>
          </div>
        </div>
      )}
      {failed ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          Couldn&apos;t unlink. Try again.
        </p>
      ) : null}
    </div>
  );
}
