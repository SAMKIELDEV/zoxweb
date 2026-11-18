import { cn } from "@/lib/cn";

/**
 * Flat drawings for the landing page, built from the design tokens only
 * (fill-* and stroke-* classes), so they follow the theme. No people, no
 * gradients. Each is decorative: the text beside it says the same thing.
 */

const sketch = "stroke-ink-2 [stroke-linecap:round] [stroke-linejoin:round]";

/**
 * The Problem section's one animation (DESIGN.md, "Marketing motion"),
 * inside a Reveal. The final look, which is also what reduced motion and the
 * server render show, is the collapse already done: one large chat bubble.
 * The "ready" pose is the messy pile; when it scrolls in, each piece slides
 * into the bubble's place and shrinks away, and the bubble grows into the
 * middle. Under 1.2 seconds, transform and opacity only.
 */
const collapse =
  "origin-center [transform-box:fill-box] transition-[transform,opacity] duration-700 ease-zox opacity-0 " +
  "[transform:translate(var(--dx),var(--dy))_scale(0.15)] " +
  "pre-reveal:opacity-100 pre-reveal:[transform:none]";
const fadeTrails = "transition-opacity duration-500 ease-zox opacity-0 pre-reveal:opacity-100";
const bubble =
  "origin-center [transform-box:fill-box] transition-transform duration-700 ease-zox [transition-delay:350ms] " +
  "[transform:translate(-144px,-128px)_scale(1.6)] pre-reveal:[transform:none]";

/**
 * Brief 04: a messy pile of tabs and papers collapsing into one chat
 * bubble.
 */
export function ProblemArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 480 380" fill="none" className={cn("h-auto w-full", className)}>
      <g className={sketch} strokeWidth="2">
        {/* A browser tab with a search bar */}
        <g className={collapse} style={{ ["--dx" as string]: "115px", ["--dy" as string]: "105px", transitionDelay: "0ms" }}>
          <g transform="rotate(-8 120 80)">
          <rect x="40" y="30" width="170" height="110" rx="10" className="fill-card" />
          <path d="M40 54h170" />
          <circle cx="56" cy="42" r="3" className="fill-line" />
          <circle cx="68" cy="42" r="3" className="fill-line" />
          <rect x="56" y="68" width="138" height="18" rx="9" className="fill-surface" />
          <path d="M64 108h90M64 122h60" className="stroke-track" />
        </g>
        </g>

        {/* A lecture PDF, folded corner */}
        <g className={collapse} style={{ ["--dx" as string]: "-91px", ["--dy" as string]: "98px", transitionDelay: "60ms" }}>
          <g transform="rotate(7 330 90)">
          <path d="M270 20h96l26 26v118H270z" className="fill-card" />
          <path d="M366 20v26h26" />
          <rect x="286" y="40" width="40" height="16" rx="4" className="fill-accent-tint stroke-accent" />
          <path d="M286 76h88M286 92h88M286 108h64M286 124h80M286 140h50" className="stroke-track" />
        </g>
        </g>

        {/* A video with its play button */}
        <g className={collapse} style={{ ["--dx" as string]: "128px", ["--dy" as string]: "-40px", transitionDelay: "120ms" }}>
          <g transform="rotate(-4 110 230)">
          <rect x="24" y="178" width="176" height="104" rx="10" className="fill-forest-tint" />
          <path d="M100 210v40l32-20z" className="fill-forest stroke-forest" />
          <path d="M40 270h144" className="stroke-track" />
          <circle cx="78" cy="270" r="5" className="fill-card" />
        </g>
        </g>

        {/* A blurry photo of the board */}
        <g className={collapse} style={{ ["--dx" as string]: "-34px", ["--dy" as string]: "-54px", transitionDelay: "180ms" }}>
          <g transform="rotate(10 270 250)">
          <rect x="214" y="196" width="120" height="96" rx="8" className="fill-wash" />
          <path
            d="M232 222c10-8 18 6 28-2s16 4 26-4M232 246c14-6 22 4 34-2M232 268c8-4 16 4 30 0"
            className="stroke-track"
            strokeWidth="3"
          />
        </g>
        </g>

        {/* A sticky note with a question mark */}
        <g className={collapse} style={{ ["--dx" as string]: "43px", ["--dy" as string]: "28px", transitionDelay: "240ms" }}>
          <g transform="rotate(-12 196 160)">
          <rect x="166" y="132" width="62" height="60" rx="4" className="fill-accent-tint" />
          <path d="M188 150c2-8 18-8 18 2 0 8-8 8-8 16M198 178v1" className="stroke-accent-ink" strokeWidth="2.5" />
        </g>
        </g>

        {/* Everything falling toward the bubble */}
        <g className={cn("stroke-track", fadeTrails)} strokeDasharray="3 7">
          <path d="M150 150c60 40 120 80 190 130" />
          <path d="M330 170c10 40 20 70 30 104" />
          <path d="M200 260c50 20 90 30 130 34" />
        </g>
      </g>

      {/* The one chat bubble: in the final look it sits large in the middle, everything else gone into it. */}
      <g className={bubble}>
        <path
          d="M318 284h132a14 14 0 0 1 14 14v38a14 14 0 0 1-14 14H352l-20 16v-16h-14a14 14 0 0 1-14-14v-38a14 14 0 0 1 14-14z"
          className="fill-accent stroke-accent-strong"
          strokeWidth="2"
        />
        <path d="M324 304h112" className="stroke-on-bubble [stroke-linecap:round]" strokeWidth="3" />
        {/* What the pile was, now inside the one chat: a PDF, a video, a photo, a search. */}
        <rect x="324" y="318" width="26" height="18" rx="4" className="fill-accent-tint" />
        <path d="M330 324h14M330 330h9" className="stroke-accent-strong [stroke-linecap:round]" strokeWidth="2" />
        <rect x="356" y="318" width="26" height="18" rx="4" className="fill-forest-tint" />
        <path d="M366 322v10l8-5z" className="fill-forest" />
        <rect x="388" y="318" width="26" height="18" rx="4" className="fill-wash" />
        <path d="M392 332l6-6 4 4 3-3 5 5" className="stroke-ink-2 [stroke-linecap:round] [stroke-linejoin:round]" strokeWidth="1.6" />
        <rect x="420" y="318" width="26" height="18" rx="4" className="fill-card" />
        <circle cx="431" cy="326" r="4" className="stroke-ink-2" strokeWidth="1.6" />
        <path d="M434 329l4 4" className="stroke-ink-2 [stroke-linecap:round]" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
