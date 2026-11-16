"use client";

import { ArrowUp } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { ICON_STROKE } from "@/components/shell/nav";
import { START_CHAT, whatsAppLinkWithText } from "@/lib/site";
import { COMPOSER } from "./content";

interface ComposerProps {
  /** Show the suggestion chips above the input (the hero does, the closing section does not). */
  suggestions?: boolean;
  className?: string;
}

/**
 * The landing page's composer (brief 02 and 08). Whatever is typed goes to
 * WhatsApp as a ready message: WhatsApp fills it in, the person presses
 * send there. Tapping a chip fills the input. After a send it shows the
 * hand-off line and a plain link, for when the browser blocks the new tab.
 * With no WhatsApp number configured it sends people to sign-in, like
 * every other chat button on the page.
 */
export function Composer({ suggestions = false, className }: ComposerProps) {
  const [text, setText] = useState("");
  const [handoff, setHandoff] = useState<string | null>(null);
  const inputId = useId();
  const noteId = useId();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const href = whatsAppLinkWithText(text) ?? START_CHAT.href;
    setHandoff(href);
    if (!START_CHAT.external) {
      window.location.assign(href);
      return;
    }
    const tab = window.open(href, "_blank");
    if (tab) tab.opener = null;
  };

  return (
    <div className={className}>
      {suggestions ? (
        <ul role="list" aria-label="Suggestions" className="mb-3 flex flex-wrap gap-2">
          {COMPOSER.suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => {
                  setText(suggestion);
                  setHandoff(null);
                  document.getElementById(inputId)?.focus();
                }}
                className="min-h-9 rounded-full border border-line bg-card px-3 text-note text-ink-2 transition-colors duration-(--dur-fast) ease-zox hover:border-track hover:text-ink max-sm:min-h-11"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-line bg-card p-1.5 pl-4 shadow-card">
        <label htmlFor={inputId} className="sr-only">
          {COMPOSER.placeholder}
        </label>
        <input
          id={inputId}
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setHandoff(null);
          }}
          placeholder={COMPOSER.placeholder}
          aria-describedby={noteId}
          autoComplete="off"
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-ink-2"
        />
        <button
          type="submit"
          aria-label={COMPOSER.sendLabel}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-strong text-on-accent transition-[background-color,transform] duration-(--dur-fast) ease-zox hover:bg-accent-deep active:scale-[0.96]"
        >
          <ArrowUp aria-hidden="true" size={20} strokeWidth={ICON_STROKE + 0.4} />
        </button>
      </form>

      <div id={noteId} aria-live="polite" className="mt-3 text-note text-ink-2">
        {handoff ? (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>{COMPOSER.handoff}</span>
            <a
              href={handoff}
              target={START_CHAT.external ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex min-h-11 items-center font-medium text-accent-ink underline underline-offset-4 sm:min-h-0"
            >
              {COMPOSER.fallback}
            </a>
          </p>
        ) : (
          <p>{COMPOSER.microcopy}</p>
        )}
      </div>
    </div>
  );
}
