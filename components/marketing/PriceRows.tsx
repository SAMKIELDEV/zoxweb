"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { formatCount, formatMoney } from "@/lib/format";
import { CREDIT_PACKAGES, FREE_DAILY_CREDITS } from "@/lib/pricing";

interface Row {
  id: string;
  name: string;
  credits: string;
  price: string | null;
}

interface Answer {
  currency: string;
  freeDailyCredits: number;
  packages: { id: string; name: string; credits: number; price: string }[];
}

/** What the rows hold before prices arrive: names and credits are known, prices wait. */
function initialRows(): Row[] {
  return [
    { id: "free", name: "Free", credits: `${FREE_DAILY_CREDITS} credits a day`, price: "Free" },
    ...CREDIT_PACKAGES.map((pack) => ({ id: pack.id, name: pack.name, credits: `${formatCount(pack.credits)} credits`, price: null })),
  ];
}

// The row reveal (DESIGN.md, "Marketing motion"): each row rises 8px as it fades in, 50ms apart.
const rowMotion =
  "transition-[opacity,transform] duration-(--dur-slow) ease-zox group-data-[reveal=ready]/reveal:opacity-0 group-data-[reveal=ready]/reveal:translate-y-2";

/**
 * The pricing teaser's rows: Free, then each pack with its credits and its
 * price in the visitor's currency (/api/public-pricing, the same prices and
 * currency rule as the Pricing page and checkout). Until the prices arrive a
 * quiet placeholder holds their place, so a Nigerian visitor never sees
 * dollars flash first; if the request fails, the dollar prices from the
 * shared constants show.
 */
export function PriceRows() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [currency, setCurrency] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const fallback = () =>
      live &&
      setRows((current) =>
        current.map((row) => {
          const pack = CREDIT_PACKAGES.find((item) => item.id === row.id);
          return pack ? { ...row, price: formatMoney(pack.amountUsd, "USD") } : row;
        }),
      );
    fetch("/api/public-pricing", { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<Answer>) : Promise.reject(new Error("pricing"))))
      .then((answer) => {
        if (!live) return;
        setCurrency(answer.currency);
        setRows([
          { id: "free", name: "Free", credits: `${answer.freeDailyCredits} credits a day`, price: "Free" },
          ...answer.packages.map((pack) => ({ id: pack.id, name: pack.name, credits: `${formatCount(pack.credits)} credits`, price: pack.price })),
        ]);
      })
      .catch(fallback);
    return () => {
      live = false;
    };
  }, []);

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {currency ? `Prices shown in ${currency === "NGN" ? "naira" : "US dollars"}.` : ""}
      </p>
      <ul role="list" className="border-t border-line">
        {rows.map((row, index) => (
          <li
            key={row.id}
            className={cn("grid grid-cols-[1fr_auto_auto] items-baseline gap-x-6 border-b border-line py-4", rowMotion)}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="font-display text-lead font-semibold text-ink">{row.name}</span>
            <span className="text-copy text-ink-2 tabular-nums">{row.credits}</span>
            <span className="min-w-24 text-right text-copy font-medium text-ink tabular-nums">
              {row.price ?? (
                <span aria-hidden="true" className="inline-block h-4 w-20 translate-y-0.5 rounded-sm bg-wash" />
              )}
              {row.price ? null : <span className="sr-only">Loading price</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
