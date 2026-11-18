"use client";

import type { UsagePeriod } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { radioLabelFocus } from "@/components/ui/RadioInput";

export const USAGE_PERIODS: { days: UsagePeriod; label: string; short: string }[] = [
  { days: 7, label: "7 days", short: "7d" },
  { days: 30, label: "30 days", short: "30d" },
  { days: 90, label: "90 days", short: "90d" },
];

/**
 * Which period the Usage chart covers. Native radios (arrow keys move
 * between them, the group is announced as one choice), drawn as a row of
 * three segments. Each segment is 44px tall, the minimum tap target.
 */
export function PeriodToggle({ value, onChange }: { value: UsagePeriod; onChange: (days: UsagePeriod) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Period</legend>
      <div className="inline-flex rounded-md border border-line p-0.5">
        {USAGE_PERIODS.map((period) => (
          <label
            key={period.days}
            className={cn(
              "relative flex h-11 min-w-14 cursor-pointer items-center justify-center rounded-sm px-3 text-sm tabular-nums",
              "transition-colors duration-(--dur-fast) ease-zox",
              "text-ink-2 hover:text-ink has-[:checked]:bg-wash has-[:checked]:font-medium has-[:checked]:text-ink",
              radioLabelFocus,
            )}
          >
            <input
              type="radio"
              name="usage-period"
              value={period.days}
              checked={value === period.days}
              onChange={() => onChange(period.days)}
              className="sr-only"
            />
            <span aria-hidden="true">{period.short}</span>
            <span className="sr-only">{period.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
