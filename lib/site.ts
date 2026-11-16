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
 *
 * In development a missing or unreadable number throws, so it is noticed
 * at once instead of every chat button quietly pointing at sign-in. A
 * production build keeps the sign-in fallback.
 */
function resolveWhatsAppUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER ?? "";
  const digits = raw.replace(/\D/g, "");
  if (/^\d{8,15}$/.test(digits)) return `https://wa.me/${digits}`;
  if (process.env.NODE_ENV === "development") {
    throw new Error(
      raw
        ? `NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER is "${raw}", which is not a phone number. ` +
            "Use the country code and number, 8 to 15 digits, for example +2348012345678."
        : "NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER is not set, so every chat button on the public pages would go to sign-in. " +
            "Add it to .env.local (country code first, see .env.example) and restart pnpm dev.",
    );
  }
  return null;
}

export const WHATSAPP_URL = resolveWhatsAppUrl();

/**
 * Where "start chatting" buttons lead. With no WhatsApp number configured
 * (a production build only; development throws above) they go to sign-in, where the dashboard's own link flow hands over the
 * real chat link, so the buttons are never dead.
 */
export const START_CHAT = WHATSAPP_URL
  ? ({ href: WHATSAPP_URL, external: true } as const)
  : ({ href: "/login", external: false } as const);

/**
 * The chat link with a message ready to send, for the landing page's
 * composer. WhatsApp fills the text in; the person still presses send.
 * Null when no number is configured.
 */
export function whatsAppLinkWithText(text: string): string | null {
  if (!WHATSAPP_URL) return null;
  const trimmed = text.trim();
  return trimmed ? `${WHATSAPP_URL}?text=${encodeURIComponent(trimmed)}` : WHATSAPP_URL;
}

/** Optional profile links for the footer. One with no address is not shown. */
export const X_URL = httpsUrl(process.env.NEXT_PUBLIC_ZOX_X_URL);
export const INSTAGRAM_URL = httpsUrl(process.env.NEXT_PUBLIC_ZOX_INSTAGRAM_URL);
