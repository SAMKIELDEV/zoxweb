import Image from "next/image";
import oxPart from "@/public/brand/zox-logo-ox.svg";
import zPart from "@/public/brand/zox-logo-z.svg";
import { cn } from "@/lib/cn";

/**
 * The wordmark's geometry, from public/brand/zox-logo.svg (viewBox 791 by
 * 269). The Z is the file's first subpath and ends at x = 254.41.
 */
const VIEWBOX_W = 791;
const VIEWBOX_H = 269;
const Z_RIGHT = 254.41;

/** Drawn 24px tall, as the Logo component's default. */
export const NAV_LOGO_HEIGHT = 24;
export const NAV_LOGO_WIDTH = (NAV_LOGO_HEIGHT * VIEWBOX_W) / VIEWBOX_H;
export const NAV_Z_WIDTH = (NAV_LOGO_WIDTH * Z_RIGHT) / VIEWBOX_W;

/** Where the O begins in the wordmark: the O and X fold left by this much, to sit under the Z. */
const OX_START = (NAV_LOGO_WIDTH * 251) / VIEWBOX_W;

/**
 * The header's wordmark, in two layers cut from the supplied file at its
 * subpaths (docs/brand/README.md): the Z, which never moves, and the O and
 * X, which fold into it as the header folds: they slide left under the Z
 * while squashing from their left edge, like an accordion closing, and fade
 * out over the second half. The Z is the top layer, so they go behind it.
 * Laid over each other the two layers are the wordmark exactly; nothing is
 * redrawn.
 *
 * Decorative: the link around it carries the name "Zox, home".
 */
export function NavLogo({ compact, animate }: { compact: boolean; animate: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative block"
      // The box is the Z alone when compact, so the focus ring and tap area
      // fit what is visible. It switches at once; only the layers animate.
      style={{ width: compact ? NAV_Z_WIDTH : NAV_LOGO_WIDTH, height: NAV_LOGO_HEIGHT }}
    >
      <Image
        src={oxPart}
        alt=""
        loading="eager"
        className={cn(
          "absolute top-0 left-0 max-w-none",
          animate && "transition-[opacity,transform] duration-(--dur-fast) ease-out",
        )}
        // Follows the header's fold progress (--nav-p, set by MarketingNav).
        style={{
          width: NAV_LOGO_WIDTH,
          height: NAV_LOGO_HEIGHT,
          // Fully there for the first part of the fold, gone at the end.
          opacity: "clamp(0, calc((1 - var(--nav-p, 0)) * 1.8), 1)",
          transformOrigin: `${OX_START}px 50%`,
          transform: `translateX(calc(var(--nav-p, 0) * ${-OX_START}px)) scaleX(calc(1 - var(--nav-p, 0) * 0.85))`,
        }}
      />
      {/* The Z last, on top: the O and X fold in behind it. */}
      <Image
        src={zPart}
        alt=""
        loading="eager"
        className="absolute top-0 left-0 max-w-none"
        style={{ width: NAV_LOGO_WIDTH, height: NAV_LOGO_HEIGHT }}
      />
    </span>
  );
}
