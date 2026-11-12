"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useAccount } from "@/hooks/useAccount";
import { useLinkChallenge, type LinkCodeFailure } from "@/hooks/useLinkChallenge";
import { ACCOUNT_KEY } from "@/lib/api/account";
import { formatTime } from "@/lib/format";

/** How often to check whether the code has been used, while one is live. */
const POLL_MS = 5000;

const FAILURE_COPY: Record<Exclude<LinkCodeFailure, "already-linked">, string> = {
  "too-soon": "You asked for a code a moment ago. Wait a minute, then try again.",
  unavailable: "Linking isn't available right now. Try again later.",
  offline: "Couldn't reach Zox. Check your connection and try again.",
  unknown: "Couldn't get a code. Try again.",
};

/** The backend builds this link. Only a real WhatsApp address is ever opened. */
const isWhatsAppUrl = (url: string) => url.startsWith("https://wa.me/");

/**
 * The code read letter by letter ("K, M, T, R"), so a screen reader never
 * says it as a word. The page shows it as one word, which is what to type.
 */
const spelled = (code: string) => code.split("").join(", ");

type View = "intro" | "code" | "expired";

/**
 * Links a WhatsApp number to the signed-in SAMKIEL ID.
 * 1. Ask for a code. 2. Send it to Zox on WhatsApp. 3. This component
 * polls the account until the link shows up, then the page around it
 * re-renders as linked and this unmounts.
 * Used wherever an unlinked account needs the way forward (Home, Settings).
 */
export function LinkWhatsApp({ identityId }: { identityId: string }) {
  const { mutate } = useSWRConfig();
  const onAlreadyLinked = useCallback(() => void mutate(ACCOUNT_KEY), [mutate]);
  const { challenge, expired, requesting, failure, request } = useLinkChallenge(identityId, { onAlreadyLinked });
  useAccount({ refreshInterval: challenge ? POLL_MS : 0 });

  const view: View = challenge ? "code" : expired ? "expired" : "intro";

  // When the step changes, the button that had focus is gone and focus
  // falls back to the page. Put it on the new heading so keyboard and
  // screen-reader users land on what changed. Two guards keep this from
  // stealing focus: the person must have used this block during this
  // visit (a code restored on page load does not count), and focus must
  // not have moved to something else on the page in the meantime.
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const used = useRef(false);
  const lastView = useRef(view);
  useEffect(() => {
    if (lastView.current === view) return;
    lastView.current = view;
    const active = document.activeElement;
    const focusIsFree = !active || active === document.body || section.current?.contains(active);
    if (used.current && focusIsFree) heading.current?.focus();
  }, [view]);

  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (copy !== "copied") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copy]);

  async function copyCode() {
    if (!challenge) return;
    used.current = true;
    try {
      await navigator.clipboard.writeText(challenge.code);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
  }

  const askForCode = () => {
    used.current = true;
    setCopy("idle");
    void request();
  };

  const failureCopy = failure && failure !== "already-linked" ? FAILURE_COPY[failure] : null;

  return (
    <section ref={section} aria-labelledby="link-whatsapp-heading" className="max-w-160" onFocus={() => (used.current = true)}>
      <h2 id="link-whatsapp-heading" ref={heading} tabIndex={-1} className="text-xl font-semibold text-ink md:text-2xl">
        {view === "code" ? "Send this code to Zox" : view === "expired" ? "That code ran out" : "Connect your WhatsApp"}
      </h2>

      {view === "code" && challenge ? (
        <>
          <p className="mt-4 max-w-[52ch] text-base text-ink-2">
            Send it from the WhatsApp number you want to link. Zox replies once you&apos;re linked, and this page
            updates by itself.
          </p>

          {/* Four capital letters, large: easy to read across a room and to type. */}
          <p
            data-testid="link-code"
            aria-label={`Your code: ${spelled(challenge.code)}`}
            className="mt-10 select-all font-display text-3xl font-semibold tracking-[0.2em] text-ink"
          >
            {challenge.code}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {isWhatsAppUrl(challenge.whatsappUrl) ? (
              <ButtonLink href={challenge.whatsappUrl} variant="primary" external>
                Open WhatsApp
              </ButtonLink>
            ) : null}
            <Button variant="secondary" onClick={copyCode}>
              {copy === "copied" ? "Copied" : "Copy code"}
            </Button>
          </div>

          {copy === "failed" ? (
            <p role="alert" className="mt-4 text-sm text-danger">
              Couldn&apos;t copy it. Select the code above and copy it by hand.
            </p>
          ) : null}

          <p role="status" className="mt-8 text-sm text-ink-2">
            Waiting for your message. The code works until {formatTime(challenge.expiresAt)}.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 max-w-[52ch] text-base text-ink-2">
            {view === "expired"
              ? "Codes last ten minutes. Get a new one and send it to Zox."
              : "Zox lives in WhatsApp. Link your number to see your credits and usage."}
          </p>

          <Button variant="primary" onClick={askForCode} busy={requesting} className="mt-8 w-full sm:w-auto">
            {requesting ? "Getting your code" : view === "expired" ? "Get a new code" : "Connect WhatsApp"}
          </Button>

          {failureCopy ? (
            <p role="alert" className="mt-4 max-w-[52ch] text-sm text-danger">
              {failureCopy}
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
