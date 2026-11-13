/**
 * Opens a provider's checkout as a modal over the billing page, the way
 * Paystack's popup and Bachs' overlay are meant to be used, instead of
 * sending the whole page away.
 *
 * Both providers host the card form in their own frame, so card details
 * never touch this site. The modal is only a convenience: credits are
 * granted by the backend from the provider's signed webhook, never from
 * anything that happens in the browser.
 *
 * Anything that stops the modal from opening (a blocked script, a URL we
 * do not recognise) makes `openCheckoutOverlay` reject, and the caller
 * falls back to the full-page checkout.
 */

/** How the person left the modal. `paid` is only what the browser saw. */
export type OverlayOutcome = "paid" | "closed";

type PaystackCallbacks = {
  onSuccess?: (transaction: unknown) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
};

type BachsEvent = { type: string; data?: Record<string, unknown> };

declare global {
  interface Window {
    PaystackPop?: new () => {
      resumeTransaction: (accessCode: string, callbacks?: PaystackCallbacks) => unknown;
    };
    Bachs?: {
      Initialize: (options: { baseUrl?: string; onEvent?: (event: BachsEvent) => void }) => unknown;
      Checkout: {
        open: (args: { checkoutUrl: string; onEvent?: (event: BachsEvent) => void }) => Promise<unknown>;
      };
    };
  }
}

const PAYSTACK_SCRIPT = "https://js.paystack.co/v2/inline.js";
const BACHS_SCRIPT = "https://checkout.bachs.io/bachs.js";
const SCRIPT_TIMEOUT_MS = 10_000;

const loading = new Map<string, Promise<void>>();

/** Adds a provider script once. Rejects if it is blocked or slow. */
function loadScript(src: string): Promise<void> {
  const existing = loading.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => fail(new Error(`Timed out loading ${src}`)), SCRIPT_TIMEOUT_MS);
    function fail(error: Error) {
      window.clearTimeout(timer);
      script.remove();
      loading.delete(src);
      reject(error);
    }
    script.src = src;
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    script.onerror = () => fail(new Error(`Couldn't load ${src}`));
    document.head.appendChild(script);
  });
  loading.set(src, promise);
  return promise;
}

/**
 * Paystack's checkout address is https://checkout.paystack.com/<access code>,
 * and its popup resumes a server-started transaction from that code.
 */
function paystackAccessCode(url: URL): string | null {
  if (url.hostname !== "checkout.paystack.com") return null;
  const [code, ...rest] = url.pathname.split("/").filter(Boolean);
  return code && rest.length === 0 && /^[A-Za-z0-9]+$/.test(code) ? code : null;
}

/** Bachs checkout lives on checkout.bachs.io, or a sandbox host under bachs.io. */
function isBachsCheckout(url: URL): boolean {
  return url.hostname === "bachs.io" || url.hostname.endsWith(".bachs.io");
}

async function openPaystack(accessCode: string): Promise<OverlayOutcome> {
  await loadScript(PAYSTACK_SCRIPT);
  const Popup = window.PaystackPop;
  if (!Popup) throw new Error("Paystack popup is unavailable");

  return new Promise<OverlayOutcome>((resolve, reject) => {
    new Popup().resumeTransaction(accessCode, {
      onSuccess: () => resolve("paid"),
      onCancel: () => resolve("closed"),
      onError: (error) => reject(error instanceof Error ? error : new Error("Paystack popup failed")),
    });
  });
}

async function openBachs(checkoutUrl: URL): Promise<OverlayOutcome> {
  await loadScript(BACHS_SCRIPT);
  const Bachs = window.Bachs;
  if (!Bachs) throw new Error("Bachs overlay is unavailable");

  // The overlay only opens URLs on the origin it was set up with. A
  // sandbox checkout lives on a different host from a live one, so take
  // the origin from the URL the backend handed us.
  Bachs.Initialize({ baseUrl: checkoutUrl.origin });

  return new Promise<OverlayOutcome>((resolve, reject) => {
    let paid = false;
    let opened = false;
    Bachs.Checkout.open({
      checkoutUrl: checkoutUrl.href,
      onEvent: (event) => {
        if (event.type === "checkout.completed") paid = true;
        // The overlay closes itself shortly after a successful payment.
        if (event.type === "checkout.closed") resolve(paid ? "paid" : "closed");
        if (event.type === "checkout.error" && !opened) reject(new Error("Bachs overlay failed"));
      },
    }).then(
      () => {
        opened = true;
      },
      reject,
    );
  });
}

/**
 * Opens the checkout for `checkoutUrl` in a modal and settles when the
 * person leaves it. Rejects when no modal can be shown for this URL.
 */
export async function openCheckoutOverlay(checkoutUrl: string): Promise<OverlayOutcome> {
  const url = new URL(checkoutUrl);
  if (url.protocol !== "https:") throw new Error("Checkout address was not https");

  const accessCode = paystackAccessCode(url);
  if (accessCode) return openPaystack(accessCode);
  if (isBachsCheckout(url)) return openBachs(url);
  throw new Error(`No checkout modal for ${url.hostname}`);
}
