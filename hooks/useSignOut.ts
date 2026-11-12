"use client";

import { useCallback, useState } from "react";
import { clearStoredChallenge } from "@/hooks/useLinkChallenge";
import { signOut as endSession } from "@/lib/api/session";

/**
 * Ends the session, then loads the sign-in page fresh so nothing from
 * this account lingers in memory. Shared by the sidebar and Settings.
 * `failed` is true after an attempt that did not go through.
 */
export function useSignOut() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const signOut = useCallback(async () => {
    setBusy(true);
    setFailed(false);
    try {
      await endSession();
      // A link code belongs to the person who asked for it.
      clearStoredChallenge();
      window.location.assign("/login");
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }, []);

  return { busy, failed, signOut };
}
