"use client";

import { useState } from "react";
import { RadioInput, radioLabelFocus } from "@/components/ui/RadioInput";
import { cn } from "@/lib/cn";
import { formatCount, formatMoney } from "@/lib/format";

type Currency = "NGN" | "USD";

export interface PricingRow {
  id: string;
  name: string;
  credits: number;
  amountUsd: string;
  amountNgn: string | null;
}

interface PricingTableProps {
  packs: readonly PricingRow[];
  freeDailyCredits: number;
  /** Chosen on the server: the visitor's saved choice, else their country. */
  initialCurrency: Currency;
  /** Which currencies checkout can charge now. */
  checkout: Record<Currency, boolean>;
}

/** The same names Billing uses for the two currencies. */
const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "NGN", label: "Naira (NGN)" },
  { code: "USD", label: "US dollars (USD)" },
];

/** Remember the choice for this page's next visit (a year, this site only). */
function saveCurrency(code: Currency) {
  document.cookie = `zox-currency=${code}; path=/pricing; max-age=31536000; samesite=lax`;
}

/**
 * The packs and their prices in the visitor's currency, with a switch,
 * because the country guess behind the first choice can be wrong. Naira
 * amounts follow today's exchange rate; checkout shows the exact amount.
 */
export function PricingTable({ packs, freeDailyCredits, initialCurrency, checkout }: PricingTableProps) {
  const nairaShown = packs.every((pack) => pack.amountNgn !== null);
  const [picked, setPicked] = useState<Currency>(initialCurrency);
  // Naira cannot be shown without today's rate: fall back to dollars until it loads.
  const currency: Currency = picked === "NGN" && !nairaShown ? "USD" : picked;

  const price = (pack: PricingRow) =>
    currency === "NGN" && pack.amountNgn !== null ? formatMoney(pack.amountNgn, "NGN") : formatMoney(pack.amountUsd, "USD");

  return (
    <div>
      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-ink">Show prices in</legend>
        <div className="flex flex-col sm:flex-row sm:gap-6">
          {CURRENCIES.map(({ code, label }) => {
            const usable = code === "USD" || nairaShown;
            return (
              <label
                key={code}
                className={cn("flex min-h-11 items-center gap-3 rounded-md", usable ? "cursor-pointer" : "cursor-not-allowed", radioLabelFocus)}
              >
                <RadioInput
                  name="currency"
                  value={code}
                  checked={currency === code}
                  disabled={!usable}
                  onChange={() => {
                    setPicked(code);
                    saveCurrency(code);
                  }}
                />
                <span className={cn("text-base", usable ? "text-ink" : "text-ink-3")}>{label}</span>
                {usable ? null : <span className="text-sm text-ink-2">Rate unavailable</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <table className="w-full text-left">
        <caption className="sr-only">Credit packs and their prices in {currency === "NGN" ? "naira" : "US dollars"}</caption>
        <thead>
          <tr className="border-b border-line text-sm text-ink-2">
            <th scope="col" className="py-3 pr-4 font-medium">Pack</th>
            <th scope="col" className="py-3 pr-4 font-medium">Credits</th>
            <th scope="col" className="py-3 text-right font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line">
            <th scope="row" className="py-5 pr-4 align-top font-normal">
              <span className="block font-display text-lg font-semibold text-ink">Free</span>
              <span className="block text-sm text-ink-2">Every day, no card</span>
            </th>
            <td className="py-5 pr-4 align-top text-base tabular-nums text-ink">{formatCount(freeDailyCredits)} a day</td>
            <td className="py-5 text-right align-top text-base tabular-nums text-ink">{formatMoney(0, currency)}</td>
          </tr>
          {packs.map((pack) => (
            <tr key={pack.id} className="border-b border-line">
              <th scope="row" className="py-5 pr-4 align-top font-display text-lg font-semibold text-ink">
                {pack.name}
              </th>
              <td className="py-5 pr-4 align-top text-base tabular-nums text-ink">{formatCount(pack.credits)}</td>
              <td className="py-5 text-right align-top text-base font-medium tabular-nums text-ink">
                {currency === "NGN" ? <span className="sr-only">about </span> : null}
                {price(pack)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex max-w-[68ch] flex-col gap-2 text-sm text-ink-2">
        {currency === "NGN" ? <p>Naira prices follow today&rsquo;s exchange rate. Checkout shows the exact amount before you pay.</p> : null}
        {!nairaShown ? <p>The naira rate isn&rsquo;t loading right now, so prices are in US dollars.</p> : null}
        {!checkout.NGN && checkout.USD ? <p>Naira checkout isn&rsquo;t open right now. You can pay in US dollars.</p> : null}
        {!checkout.USD && checkout.NGN ? <p>Dollar checkout isn&rsquo;t open right now. You can pay in naira.</p> : null}
        <p>Any fee the payment provider charges is added at checkout, and you see it before you pay.</p>
      </div>
    </div>
  );
}
