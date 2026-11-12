import type { Transaction, TransactionStatus } from "./api/types";
import { formatMoney } from "./format";

/**
 * A purchase's status in a word or two. `succeeded` is an older name for
 * `completed`. Refunds and disputes arrive as `needs_review`.
 */
const STATUS_WORDS: Record<TransactionStatus, string> = {
  pending: "Pending",
  completed: "Paid",
  succeeded: "Paid",
  failed: "Failed",
  expired: "Expired",
  needs_review: "Being checked",
  refunded: "Refunded",
};

export function statusWord(status: TransactionStatus): string {
  return STATUS_WORDS[status] ?? "Pending";
}

/**
 * What was paid, or what was asked for if payment has not landed:
 * "NGN 8,250" or "USD 5.00".
 */
export function purchaseAmount(transaction: Transaction): string {
  if (transaction.paid_amount) {
    return formatMoney(transaction.paid_amount, transaction.paid_currency ?? transaction.currency);
  }
  if (transaction.expected_amount) return formatMoney(transaction.expected_amount, transaction.currency);
  return formatMoney(transaction.amount_usd, "USD");
}
