"use client";

import "./globals.css";

/**
 * Last-resort screen when the root layout itself fails. It replaces the
 * whole document, so it cannot rely on the layout's fonts or theme script.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto flex min-h-dvh w-full max-w-280 flex-col items-start px-5 pt-24 md:px-8 lg:px-12">
          <h1 className="text-2xl font-semibold text-ink">Zox couldn&apos;t load</h1>
          <p className="mt-3 max-w-[52ch] text-base text-ink-2">Something broke on our side. Trying again usually fixes it.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex h-11 items-center rounded-md bg-accent-strong px-5 text-sm font-medium text-on-accent hover:bg-accent-deep"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
