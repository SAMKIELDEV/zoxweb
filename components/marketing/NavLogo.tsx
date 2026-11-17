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

/** How far the O and X travel toward the Z as they fade. */
const OX_SLIDE = -0.3 * NAV_LOGO_WIDTH;

/**
 * The header's wordmark, in two layers cut from the supplied file at its
 * subpaths (docs/brand/README.md): the Z, which never moves, and the O and
 * X, which fade and slide into it when `compact`. Laid over each other the
 * two layers are the wordmark exactly; nothing is redrawn.
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
        src={zPart}
        alt=""
        loading="eager"
        className="absolute top-0 left-0 max-w-none"
        style={{ width: NAV_LOGO_WIDTH, height: NAV_LOGO_HEIGHT }}
      />
      <Image
        src={oxPart}
        alt=""
        loading="eager"
        className={cn(
          "absolute top-0 left-0 max-w-none",
          animate && "transition-[opacity,transform] duration-(--dur-nav) ease-nav",
        )}
        style={{
          width: NAV_LOGO_WIDTH,
          height: NAV_LOGO_HEIGHT,
          opacity: compact ? 0 : 1,
          transform: compact ? `translateX(${OX_SLIDE}px)` : "none",
        }}
      />
    </span>
  );
}
