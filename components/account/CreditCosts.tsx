import { CREDIT_COSTS } from "@/lib/costs";

/** What each kind of request costs. Fixed prices, so there is no loading state. */
export function CreditCosts() {
  return (
    <section aria-labelledby="credit-costs-heading">
      <h2 id="credit-costs-heading" className="mb-4 text-lg font-semibold text-ink">
        What a credit covers
      </h2>
      <dl className="divide-y divide-line border-y border-line">
        {CREDIT_COSTS.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="text-sm text-ink-2">{row.label}</dt>
            <dd className="text-right text-sm tabular-nums text-ink">{row.cost}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm text-ink-2">Chat is priced by how much Zox reads and writes, so longer conversations can cost more than one credit.</p>
    </section>
  );
}
