import { cn } from "@/lib/cn";
import type { JobArt } from "./content";

/**
 * Flat drawings for the landing page, built from the design tokens only
 * (fill-* and stroke-* classes), so they follow the theme. No people, no
 * gradients. Each is decorative: the text beside it says the same thing.
 */

const sketch = "stroke-ink-2 [stroke-linecap:round] [stroke-linejoin:round]";

/**
 * Brief 04: a messy pile of tabs and papers collapsing into one chat
 * bubble.
 */
export function ProblemArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 480 380" fill="none" className={cn("h-auto w-full", className)}>
      <g className={sketch} strokeWidth="2">
        {/* A browser tab with a search bar */}
        <g transform="rotate(-8 120 80)">
          <rect x="40" y="30" width="170" height="110" rx="10" className="fill-card" />
          <path d="M40 54h170" />
          <circle cx="56" cy="42" r="3" className="fill-line" />
          <circle cx="68" cy="42" r="3" className="fill-line" />
          <rect x="56" y="68" width="138" height="18" rx="9" className="fill-surface" />
          <path d="M64 108h90M64 122h60" className="stroke-track" />
        </g>

        {/* A lecture PDF, folded corner */}
        <g transform="rotate(7 330 90)">
          <path d="M270 20h96l26 26v118H270z" className="fill-card" />
          <path d="M366 20v26h26" />
          <rect x="286" y="40" width="40" height="16" rx="4" className="fill-accent-tint stroke-accent" />
          <path d="M286 76h88M286 92h88M286 108h64M286 124h80M286 140h50" className="stroke-track" />
        </g>

        {/* A video with its play button */}
        <g transform="rotate(-4 110 230)">
          <rect x="24" y="178" width="176" height="104" rx="10" className="fill-forest-tint" />
          <path d="M100 210v40l32-20z" className="fill-forest stroke-forest" />
          <path d="M40 270h144" className="stroke-track" />
          <circle cx="78" cy="270" r="5" className="fill-card" />
        </g>

        {/* A blurry photo of the board */}
        <g transform="rotate(10 270 250)">
          <rect x="214" y="196" width="120" height="96" rx="8" className="fill-wash" />
          <path
            d="M232 222c10-8 18 6 28-2s16 4 26-4M232 246c14-6 22 4 34-2M232 268c8-4 16 4 30 0"
            className="stroke-track"
            strokeWidth="3"
          />
        </g>

        {/* A sticky note with a question mark */}
        <g transform="rotate(-12 196 160)">
          <rect x="166" y="132" width="62" height="60" rx="4" className="fill-accent-tint" />
          <path d="M188 150c2-8 18-8 18 2 0 8-8 8-8 16M198 178v1" className="stroke-accent-ink" strokeWidth="2.5" />
        </g>

        {/* Everything falling toward the bubble */}
        <g className="stroke-track" strokeDasharray="3 7">
          <path d="M150 150c60 40 120 80 190 130" />
          <path d="M330 170c10 40 20 70 30 104" />
          <path d="M200 260c50 20 90 30 130 34" />
        </g>
      </g>

      {/* The one chat bubble */}
      <g>
        <path
          d="M318 284h132a14 14 0 0 1 14 14v38a14 14 0 0 1-14 14H352l-20 16v-16h-14a14 14 0 0 1-14-14v-38a14 14 0 0 1 14-14z"
          className="fill-accent stroke-accent-strong"
          strokeWidth="2"
        />
        <path d="M324 308h112M324 326h74" className="stroke-on-bubble [stroke-linecap:round]" strokeWidth="3" />
      </g>
    </svg>
  );
}

/** Brief 05: one small drawing per card. */
export function JobIllustration({ art, className }: { art: JobArt; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 96" fill="none" className={cn("h-auto w-full", className)}>
      <g className={sketch} strokeWidth="1.8">
        {art === "ask" ? <AskArt /> : null}
        {art === "search" ? <SearchArt /> : null}
        {art === "pdf" ? <PdfArt /> : null}
        {art === "video" ? <VideoArt /> : null}
        {art === "photo" ? <PhotoArt /> : null}
      </g>
    </svg>
  );
}

function AskArt() {
  return (
    <>
      <path d="M14 14h78a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H34l-12 10V50h-8a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" className="fill-card" />
      <path d="M20 28h64M20 38h40" className="stroke-track" />
      <path
        d="M68 46h78a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-8v10l-12-10H68a8 8 0 0 1-8-8V54a8 8 0 0 1 8-8z"
        className="fill-accent stroke-accent-strong"
      />
      <path d="M74 60h64M74 70h30" className="stroke-on-bubble" strokeWidth="2.4" />
    </>
  );
}

function SearchArt() {
  return (
    <>
      <rect x="10" y="12" width="104" height="72" rx="8" className="fill-card" />
      <path d="M22 30h56M22 44h80M22 58h70M22 72h44" className="stroke-track" />
      <circle cx="112" cy="50" r="22" className="fill-forest-tint stroke-forest" strokeWidth="2.4" />
      <path d="M128 66l18 18" className="stroke-forest" strokeWidth="5" />
    </>
  );
}

function PdfArt() {
  return (
    <>
      <path d="M40 6h58l18 18v66H40z" className="fill-card" />
      <path d="M98 6v18h18" />
      <path d="M52 34h52M52 46h52M52 58h40M52 70h48" className="stroke-track" />
      <rect x="48" y="52" width="48" height="10" rx="3" className="fill-accent-tint stroke-accent" strokeWidth="1.4" />
      <path d="M124 40l14 8-14 8" className="stroke-accent-ink" strokeWidth="2.4" />
    </>
  );
}

function VideoArt() {
  return (
    <>
      <rect x="10" y="10" width="96" height="62" rx="8" className="fill-forest-tint" />
      <path d="M50 28v26l22-13z" className="fill-forest stroke-forest" />
      <path d="M18 82h80" className="stroke-track" strokeWidth="3" />
      <path d="M18 82h20" className="stroke-forest" strokeWidth="3" />
      <rect x="114" y="22" width="38" height="50" rx="6" className="fill-card" />
      <path d="M121 34h24M121 44h24M121 54h16" className="stroke-track" />
    </>
  );
}

function PhotoArt() {
  return (
    <>
      <g transform="rotate(-5 70 48)">
        <rect x="16" y="10" width="112" height="76" rx="6" className="fill-card" />
        <rect x="24" y="18" width="96" height="60" rx="3" className="fill-wash" />
        <path
          d="M34 36c4-6 8 6 12 0M54 36h8M58 32v8M70 36c4-8 10 8 14-2M92 36h8M92 40h8"
          className="stroke-ink"
          strokeWidth="1.6"
        />
        <path d="M34 60c8-10 18 4 26-4s14 2 22-2" className="stroke-ink" strokeWidth="1.6" />
      </g>
      <ellipse cx="78" cy="56" rx="30" ry="14" className="stroke-accent" strokeWidth="2.4" />
    </>
  );
}
