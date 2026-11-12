import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import type { Transaction } from "@/lib/api/types";
import { creditCount, formatWhen, isoTimestamp } from "@/lib/format";
import { paymentStatusPath } from "@/lib/paths";
import { purchaseAmount, statusWord } from "@/lib/purchases";

/** The backend returns at most this many purchases and has no further pages. */
const BACKEND_LIMIT = 20;

/**
 * Past purchases, newest first. Each row opens that purchase's status
 * page. Status is always written as a word, never shown by color alone.
 */
export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <section aria-labelledby="purchases-heading">
      <h2 id="purchases-heading" className="mb-4 text-lg font-semibold text-ink">
        Purchases
      </h2>
      {transactions.length === 0 ? (
        <EmptyState message="No purchases yet. Top-ups you make show up here." className="border-y border-line" />
      ) : (
        <>
          {/* role="list": Safari drops list semantics from a list with no markers. */}
          <ul role="list" className="divide-y divide-line border-y border-line">
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <Link
                  href={paymentStatusPath(transaction.id)}
                  className="flex items-baseline justify-between gap-4 px-3 py-4 transition-colors duration-(--dur-fast) ease-zox hover:bg-wash"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <span className="text-base text-ink">{creditCount(transaction.credits_added)}</span>
                    <time dateTime={isoTimestamp(transaction.created_at)} className="text-sm tabular-nums text-ink-2">
                      {formatWhen(transaction.created_at)}
                    </time>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 md:flex-row md:items-baseline md:gap-4">
                    <span className="text-sm tabular-nums text-ink md:w-28 md:text-right">{purchaseAmount(transaction)}</span>
                    <span className="text-sm text-ink-2 md:w-24 md:text-right">{statusWord(transaction.status)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {transactions.length >= BACKEND_LIMIT ? (
            <p className="mt-3 text-sm text-ink-2">Showing your {BACKEND_LIMIT} most recent purchases.</p>
          ) : null}
        </>
      )}
    </section>
  );
}

export function TransactionListSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-7 w-32" />
      <ul className="divide-y divide-line border-y border-line">
        {[0, 1, 2, 3].map((index) => (
          // Laid out like a real row, so it is the same height at every width:
          // two lines each side on phones, one line from md.
          <li key={index} className="flex items-center justify-between gap-4 px-3 py-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:justify-between md:gap-4">
              <Skeleton className="h-lh w-24 text-base" />
              <Skeleton className="h-lh w-28 text-sm" />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 md:flex-row md:items-center md:gap-4">
              <Skeleton className="h-lh w-20 text-sm" />
              <Skeleton className="h-lh w-16 text-sm" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
