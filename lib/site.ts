/**
 * Facts about the site itself: its address (for page metadata) and the
 * outside links the public pages point at.
 *
 * The NEXT_PUBLIC_ values are read when the site is built, so a change
 * needs a rebuild to show up.
 */

/** The public address from the brand pack, used when no origin is configured. */
const DEFAULT_SITE_URL = "https://zox.samkiel.tech";

/**
 * Where the site is served. APP_ORIGIN is the same variable the session
 * layer uses to check request origins (lib/server.ts), so the two cannot
 * disagree. An unset or unreadable value falls back to the public address.
 */
function resolveSiteUrl(): string {
  const configured = process.env.APP_ORIGIN;
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // Fall through to the default.
    }
  }
  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Zox";

/**
 * The social preview images from the brand pack (app/opengraph-image.png
 * and app/twitter-image.png). Next adds them to every page by itself, but
 * a page that sets its own `openGraph` or `twitter` metadata replaces what
 * it inherits, images included. Such a page must name them again: use these.
 */
const SOCIAL_IMAGE_ALT = "The Zox wordmark in terracotta on a cream background";
export const OPEN_GRAPH_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, type: "image/png", alt: SOCIAL_IMAGE_ALT };
export const TWITTER_IMAGE = { url: "/twitter-image.png", width: 1200, height: 600, type: "image/png", alt: SOCIAL_IMAGE_ALT };

/** An https address from the environment, or null when unset or not https. */
function httpsUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * The chat link for Zox's WhatsApp number, or null when
 * NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER is not set. The number is never written
 * in code. wa.me wants digits only, country code first, 8 to 15 long.
 */
function resolveWhatsAppUrl(): string | null {
  const digits = (process.env.NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  return /^\d{8,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
}

export const WHATSAPP_URL = resolveWhatsAppUrl();

/**
 * Where "start chatting" buttons lead. With no WhatsApp number configured
 * they go to sign-in, where the dashboard's own link flow hands over the
 * real chat link, so the buttons are never dead.
 */
export const START_CHAT = WHATSAPP_URL
  ? ({ href: WHATSAPP_URL, external: true } as const)
  : ({ href: "/login", external: false } as const);

/** Optional profile links for the footer. One with no address is not shown. */
export const X_URL = httpsUrl(process.env.NEXT_PUBLIC_ZOX_X_URL);
export const INSTAGRAM_URL = httpsUrl(process.env.NEXT_PUBLIC_ZOX_INSTAGRAM_URL);
