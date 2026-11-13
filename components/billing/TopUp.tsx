"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/Button";
import { RadioInput, radioLabelFocus } from "@/components/ui/RadioInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { TextLink } from "@/components/ui/TextLink";
import { usePackages } from "@/hooks/usePackages";
import { ACCOUNT_KEY } from "@/lib/api/account";
import { isApiError } from "@/lib/api/client";
import { createCheckout } from "@/lib/api/payments";
import type { CreditPackage, Currency, PackageId, Tier } from "@/lib/api/types";
import { openCheckoutOverlay } from "@/lib/checkoutOverlay";
import { cn } from "@/lib/cn";
import { formatCount, formatMoney, isHigherTier, tierLabel } from "@/lib/format";
import { paymentStatusPath } from "@/lib/paths";

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "NGN", label: "Naira (NGN)" },
  { code: "USD", label: "US dollars (USD)" },
];

type Failure = "email" | "not-linked" | "out-of-step" | "too-many" | "unavailable" | "offline" | "bad-address";

function failureFor(error: unknown): Failure {
  if (!isApiError(error)) return "bad-address";
  if (error.status === 400) return "email";
  if (error.status === 403) return "not-linked";
  if (error.status === 409) return "out-of-step";
  if (error.status === 429) return "too-many";
  if (error.status === 0) return "offline";
  return "unavailable";
}

function failureCopy(failure: Failure, currency: Currency | null, usdOpen: boolean, ngnOpen: boolean): string {
  switch (failure) {
    case "email":
      return "Couldn't start checkout. Check that your SAMKIEL ID has a valid email, then try again.";
    case "not-linked":
      return "Connect WhatsApp before topping up.";
    case "out-of-step":
      return "That didn't go through cleanly. Try again.";
    case "too-many":
      return "You've started a few purchases in the last minute. Give it a minute, then try again.";
    case "offline":
      return "Couldn't reach Zox. Check your connection and try again.";
    case "bad-address":
      return "Checkout sent back an address we can't open. Try again.";
    case "unavailable":
      if (currency === "NGN" && usdOpen) return "Naira checkout isn't available right now. Try again shortly, or pay in US dollars.";
      if (currency === "USD" && ngnOpen) return "Dollar checkout isn't available right now. Try again shortly, or pay in naira.";
      return "Checkout isn't available right now. Try again shortly.";
  }
}

/** The package's price in the chosen currency, falling back to dollars. */
function priceOf(pack: CreditPackage, currency: Currency | null): string {
  return currency === "NGN" && pack.amountNgn !== null
    ? formatMoney(pack.amountNgn, "NGN")
    : formatMoney(pack.amountUsd, "USD");
}

/** Provider checkout pages are always https. Anything else is not opened. */
function httpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

const legend = "mb-3 text-sm font-medium text-ink";

/**
 * Buying credits: pick a package, pick a currency, pay in the provider's
 * checkout, which opens as a modal over this page (Paystack's popup for
 * naira, Bachs' overlay for dollars). If the modal can't open, for
 * example because a browser shield blocked the provider's script, the
 * page goes to the provider's checkout instead.
 *
 * Prices come from the backend, including a live naira price that the
 * backend re-quotes at checkout. Each package and currency choice gets
 * its own checkout key, so pressing the button twice, or closing the
 * modal and pressing it again, resumes the same purchase and never
 * starts a second.
 */
export function TopUp({ currentTier }: { currentTier: Tier }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { catalog, error, isValidating, refresh } = usePackages(true);

  const [packageId, setPackageId] = useState<PackageId | null>(null);
  const [pickedCurrency, setPickedCurrency] = useState<Currency | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  /** The purchase whose checkout modal was just closed without paying. */
  const [closedId, setClosedId] = useState<string | null>(null);
  const checkoutKey = useRef({ selection: "", value: "" });
  const alert = useRef<HTMLParagraphElement>(null);

  // The button stays busy while the browser leaves for the provider (the
  // full-page fallback when the modal can't open). If the person comes
  // straight back, the browser may restore this page as it was, so release
  // the button then.
  useEffect(() => {
    const release = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", release);
    return () => window.removeEventListener("pageshow", release);
  }, []);

  useEffect(() => {
    if (failure) alert.current?.focus();
  }, [failure]);

  if (!catalog) {
    if (error && error.status !== 401) {
      return (
        <ErrorState
          message="Couldn't load the packages. Try again."
          onRetry={() => void refresh()}
          retryLabel={isValidating ? "Trying again" : "Try again"}
        />
      );
    }
    return <TopUpSkeleton />;
  }

  const { packages, available } = catalog;
  if (packages.length === 0 || (!available.NGN && !available.USD)) {
    return <EmptyState message="Top-ups aren't open yet. Check back soon." className="border-y border-line" />;
  }

  const pack = packages.find((item) => item.id === packageId) ?? packages[0];
  const canPayIn = (code: Currency) => available[code] && (code === "USD" || pack.amountNgn !== null);
  // Naira first when it can be used; otherwise whichever currency works.
  const preferred = pickedCurrency ?? "NGN";
  const currency: Currency | null = canPayIn(preferred) ? preferred : canPayIn("USD") ? "USD" : canPayIn("NGN") ? "NGN" : null;
  const nairaRateMissing = available.NGN && packages.some((item) => item.amountNgn === null);
  const movesUp = isHigherTier(pack.id, currentTier);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currency || busy) return;

    const selection = `${pack.id}:${currency}`;
    if (checkoutKey.current.selection !== selection) {
      checkoutKey.current = { selection, value: crypto.randomUUID() };
    }

    setBusy(true);
    setFailure(null);
    setClosedId(null);
    try {
      const result = await createCheckout({ packageId: pack.id, currency, checkoutKey: checkoutKey.current.value });
      // A resumed purchase that is no longer waiting for payment, or one
      // with no checkout page yet: show its status, do not reopen checkout.
      if (!result.checkoutUrl || (result.status && result.status !== "pending")) {
        router.push(paymentStatusPath(result.transactionId));
        return;
      }
      const url = httpsUrl(result.checkoutUrl);
      if (!url) throw new Error("Checkout address was not https");

      let outcome;
      try {
        outcome = await openCheckoutOverlay(url);
      } catch {
        // No modal for this checkout: go to the provider's page instead.
        window.location.assign(url);
        return;
      }
      if (outcome === "paid") {
        router.push(paymentStatusPath(result.transactionId));
        return;
      }
      // Closed without paying. The checkout key is kept, so pressing the
      // button again reopens this same purchase.
      setClosedId(result.transactionId);
      setBusy(false);
    } catch (caught) {
      // The purchase exists but its checkout is uncertain: follow it.
      if (isApiError(caught) && caught.transactionId) {
        router.push(paymentStatusPath(caught.transactionId));
        return;
      }
      const reason = failureFor(caught);
      if (reason === "out-of-step") checkoutKey.current = { selection: "", value: "" };
      if (reason === "not-linked") void mutate(ACCOUNT_KEY);
      setFailure(reason);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset disabled={busy}>
        <legend className={legend}>Package</legend>
        <div className="divide-y divide-line border-y border-line">
          {packages.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex cursor-pointer items-center gap-4 px-3 py-4 transition-colors duration-(--dur-fast) ease-zox",
                "hover:bg-wash has-[:checked]:bg-wash",
                radioLabelFocus,
              )}
            >
              <RadioInput
                name="package"
                value={item.id}
                checked={item.id === pack.id}
                onChange={() => {
                  setPackageId(item.id);
                  setFailure(null);
                  setClosedId(null);
                }}
              />
              <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-semibold tabular-nums text-ink">{formatCount(item.credits)}</span>
                  <span className="text-sm text-ink-2">credits</span>
                </span>
                <span className="text-sm text-ink-2">{item.name}</span>
              </span>
              <span className="w-28 shrink-0 text-right text-base tabular-nums text-ink">{priceOf(item, currency)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={busy}>
        <legend className={legend}>Pay in</legend>
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          {CURRENCIES.map(({ code, label }) => {
            const usable = canPayIn(code);
            const reason = !available[code] ? "Not available yet" : !usable ? "Rate unavailable" : null;
            return (
              <label
                key={code}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md",
                  usable ? "cursor-pointer" : "cursor-not-allowed",
                  radioLabelFocus,
                )}
              >
                <RadioInput
                  name="currency"
                  value={code}
                  checked={currency === code}
                  disabled={!usable}
                  onChange={() => {
                    setPickedCurrency(code);
                    setFailure(null);
                    setClosedId(null);
                  }}
                />
                <span className={cn("text-base", usable ? "text-ink" : "text-ink-3")}>{label}</span>
                {reason ? <span className="text-sm text-ink-2">{reason}</span> : null}
              </label>
            );
          })}
        </div>
        {nairaRateMissing ? (
          <div className="mt-3">
            <p className="max-w-[52ch] text-sm text-ink-2">The naira rate isn&apos;t loading right now.</p>
            {/* On its own line so the tap target can be a full 44px tall. */}
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isValidating}
              className="flex min-h-11 items-center rounded-sm text-sm text-accent-ink underline underline-offset-4 hover:text-ink disabled:opacity-50"
            >
              {isValidating ? "Checking" : "Check the rate again"}
            </button>
          </div>
        ) : currency === "NGN" ? (
          <p className="mt-3 max-w-[52ch] text-sm text-ink-2">
            Naira prices follow the live exchange rate, so the amount can shift slightly at checkout.
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-base text-ink" data-testid="checkout-summary">
            <span className="font-medium">{formatCount(pack.credits)} credits</span>
            {currency ? ` for ${priceOf(pack, currency)}` : null}
          </p>
          {movesUp ? (
            <p className="mt-1 text-sm text-ink-2">This also moves you to the {tierLabel(pack.id)} plan.</p>
          ) : null}
        </div>

        {failure ? (
          <p ref={alert} role="alert" tabIndex={-1} className="max-w-[52ch] text-sm text-danger">
            {failureCopy(failure, currency, canPayIn("USD"), canPayIn("NGN"))}
          </p>
        ) : null}
        {!currency ? (
          <p className="max-w-[52ch] text-sm text-ink-2">This package can&apos;t be paid for right now.</p>
        ) : null}
        {closedId && !failure ? (
          <p role="status" className="max-w-[52ch] text-sm text-ink-2">
            Checkout closed. Continue to pick up where you left off. Already paid?{" "}
            <TextLink href={paymentStatusPath(closedId)}>Check this purchase</TextLink>.
          </p>
        ) : null}

        <div>
          <Button type="submit" variant="primary" busy={busy} disabled={!currency} className="w-full sm:w-auto">
            {busy ? "Opening checkout" : "Continue to payment"}
          </Button>
          <p className="mt-3 max-w-[52ch] text-sm text-ink-2">
            You pay in a {currency === "USD" ? "Bachs" : "Paystack"} window over this page. Credits arrive
            once the payment is confirmed.
          </p>
        </div>
      </div>
    </form>
  );
}

export function TopUpSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8">
      <div>
        <Skeleton className="mb-3 h-5 w-20" />
        <ul className="divide-y divide-line border-y border-line">
          {[0, 1, 2].map((index) => (
            <li key={index} className="flex items-center justify-between gap-4 px-3 py-4">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-6 w-24" />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Skeleton className="mb-3 h-5 w-16" />
        <Skeleton className="h-11 w-64 max-w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-11 w-full rounded-md sm:w-48" />
      </div>
    </div>
  );
}
