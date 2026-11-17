"use client";

import { useEffect, useState } from "react";

/** One question per page load, shared by every component that asks. */
let answer: Promise<boolean> | null = null;

function ask(): Promise<boolean> {
  answer ??= fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
    .then((response) => (response.ok ? response.json() : { signedIn: false }))
    .then((body: { signedIn?: unknown }) => body.signedIn === true)
    .catch(() => false);
  return answer;
}

/**
 * Whether the visitor looks signed in (they carry SAMKIEL ID's cookies).
 * False until the answer arrives, so the server render and the first paint
 * agree and show "Sign in".
 */
export function useSignedIn(): boolean {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let live = true;
    void ask().then((value) => live && setSignedIn(value));
    return () => {
      live = false;
    };
  }, []);
  return signedIn;
}
