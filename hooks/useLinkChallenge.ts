"use client";

import { useCallback, useEffect, useState } from "react";
import { createLinkCode } from "@/lib/api/account";
import { isApiError } from "@/lib/api/client";
import type { LinkChallenge } from "@/lib/api/types";

const STORAGE_KEY = "zox-link-challenge";

/**
 * The code is kept for this tab so a reload does not lose it: the backend
 * will not issue another for 60 seconds, and a new code cancels the old one.
 * It is stored with the identity that asked for it and is only restored
 * for that same identity, so a second person signing in on this tab can
 * never be shown someone else's code.
 */
interface StoredChallenge extends LinkChallenge {
  identityId: string;
}

const isLive = (challenge: LinkChallenge) => new Date(challenge.expiresAt).getTime() > Date.now();

function readStored(identityId: string): LinkChallenge | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<StoredChallenge>;
    if (
      stored.identityId !== identityId ||
      typeof stored.code !== "string" ||
      typeof stored.expiresAt !== "string" ||
      typeof stored.whatsappUrl !== "string"
    ) {
      return null;
    }
    const challenge = { code: stored.code, expiresAt: stored.expiresAt, whatsappUrl: stored.whatsappUrl };
    return isLive(challenge) ? challenge : null;
  } catch {
    return null;
  }
}

function writeStored(identityId: string, challenge: LinkChallenge): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...challenge, identityId } satisfies StoredChallenge));
  } catch {
    // Storage can be blocked. The code still shows until the page reloads.
  }
}

/** Forget any stored code. Called on sign-out. */
export function clearStoredChallenge(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** Why asking for a code failed, for the UI to put into words. */
export type LinkCodeFailure = "already-linked" | "too-soon" | "unavailable" | "offline" | "unknown";

function failureFor(error: unknown): LinkCodeFailure {
  if (!isApiError(error)) return "unknown";
  if (error.status === 409) return "already-linked";
  if (error.status === 429) return "too-soon";
  if (error.status === 503) return "unavailable";
  if (error.status === 0) return "offline";
  return "unknown";
}

interface UseLinkChallengeOptions {
  /** Called when the backend says this identity is linked already. */
  onAlreadyLinked?: () => void;
}

/**
 * Asks for a ZOX- link code and tracks its ten-minute life.
 * It does not poll for the link itself: the caller does that by reading
 * the account snapshot on an interval while `challenge` is set.
 */
export function useLinkChallenge(identityId: string, options: UseLinkChallengeOptions = {}) {
  const { onAlreadyLinked } = options;
  const [challenge, setChallenge] = useState<LinkChallenge | null>(null);
  const [expired, setExpired] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [failure, setFailure] = useState<LinkCodeFailure | null>(null);

  // Pick up a code issued earlier in this tab.
  useEffect(() => {
    const stored = readStored(identityId);
    if (stored) setChallenge(stored);
  }, [identityId]);

  // Retire the code when its time is up. Timers are throttled in hidden
  // tabs, so the check also runs when the tab becomes visible again.
  useEffect(() => {
    if (!challenge) return;

    const retireIfDue = () => {
      if (isLive(challenge)) return false;
      clearStoredChallenge();
      setChallenge(null);
      setExpired(true);
      return true;
    };

    if (retireIfDue()) return;
    const remaining = new Date(challenge.expiresAt).getTime() - Date.now();
    const timer = window.setTimeout(retireIfDue, Math.min(remaining, 2 ** 31 - 1));
    document.addEventListener("visibilitychange", retireIfDue);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", retireIfDue);
    };
  }, [challenge]);

  const request = useCallback(async () => {
    setRequesting(true);
    setFailure(null);
    try {
      const issued = await createLinkCode();
      writeStored(identityId, issued);
      setExpired(false);
      setChallenge(issued);
    } catch (error) {
      const reason = failureFor(error);
      if (reason === "already-linked") onAlreadyLinked?.();
      setFailure(reason);
    } finally {
      setRequesting(false);
    }
  }, [identityId, onAlreadyLinked]);

  return { challenge, expired, requesting, failure, request };
}
