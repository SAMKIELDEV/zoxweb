"use client";

import { useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { ACCOUNT_KEY } from "@/lib/api/account";
import { isApiError, type ApiError } from "@/lib/api/client";
import { getTransaction, transactionKey } from "@/lib/api/payments";
import type { TransactionLookup, TransactionStatus } from "@/lib/api/types";

/** How often to ask while the purchase is still pending. */
const POLL_MS = 2500;
/** How long to keep asking before offering a manual "Check again". */
const WINDOW_MS = 60_000;

/** Statuses that will not change by themselves, so polling stops. */
const SETTLED: ReadonlySet<TransactionStatus> = new Set([
  "completed",
  "succeeded",
  "needs_review",
  "failed",
  "expired",
  "refunded",
]);

/**
 * What the purchase screen should say.
 * - confirming: pending, still inside the polling window
 * - waiting:    pending, the window ran out; offer "Check again"
 * - credited:   paid and the credits are in the wallet
 * - review:     the backend flagged it for a manual check
 * - unpaid:     failed or expired; no credits were added
 * - refunded:   marked refunded
 * - not-found:  no such purchase on this account
 * - error:      the status could not be fetched
 */
export type PurchasePhase =
  | "confirming"
  | "waiting"
  | "credited"
  | "review"
  | "unpaid"
  | "refunded"
  | "not-found"
  | "error";

function phaseFor(status: TransactionStatus, timedOut: boolean): PurchasePhase {
  if (status === "completed" || status === "succeeded") return "credited";
  if (status === "needs_review") return "review";
  if (status === "failed" || status === "expired") return "unpaid";
  if (status === "refunded") return "refunded";
  return timedOut ? "waiting" : "confirming";
}

/**
 * Follows one purchase until it settles.
 *
 * Credits are added by the payment provider's signed webhook, never by
 * the redirect back to this site, so nothing in the URL is trusted: the
 * only source of truth is the transaction's status from the backend.
 * Polls every 2.5 seconds for up to a minute, pauses while the tab is
 * hidden, and refreshes the account snapshot once when credits land so
 * the balance and plan update everywhere.
 */
export function useTransactionStatus(id: string) {
  const { mutate: mutateGlobal } = useSWRConfig();
  const [windowStart, setWindowStart] = useState(() => Date.now());
  const [timedOut, setTimedOut] = useState(false);

  const { data, error, isValidating, mutate } = useSWR<TransactionLookup, ApiError>(
    transactionKey(id),
    () => getTransaction(id),
    {
      refreshInterval: (latest) => (timedOut || (latest && SETTLED.has(latest.transaction.status)) ? 0 : POLL_MS),
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      dedupingInterval: 1000,
      // 401 is on its way to sign-in; 404 will not change by asking again.
      shouldRetryOnError: (failure) => !(isApiError(failure) && (failure.status === 401 || failure.status === 404)),
      errorRetryCount: 3,
    },
  );

  const transaction = data?.transaction;
  const settled = transaction ? SETTLED.has(transaction.status) : false;

  // Stop polling when the window runs out.
  useEffect(() => {
    if (settled || timedOut) return;
    const remaining = Math.max(0, WINDOW_MS - (Date.now() - windowStart));
    const timer = window.setTimeout(() => setTimedOut(true), remaining);
    return () => window.clearTimeout(timer);
  }, [settled, timedOut, windowStart]);

  // Credits landed: refresh the shared snapshot once.
  const refreshed = useRef(false);
  const credited = transaction?.status === "completed" || transaction?.status === "succeeded";
  useEffect(() => {
    if (!credited || refreshed.current) return;
    refreshed.current = true;
    void mutateGlobal(ACCOUNT_KEY);
  }, [credited, mutateGlobal]);

  let phase: PurchasePhase;
  if (transaction) phase = phaseFor(transaction.status, timedOut);
  else if (error?.status === 404) phase = "not-found";
  else if (error && error.status !== 401) phase = "error";
  else phase = "confirming";

  /** Start a fresh polling window and ask straight away. */
  const checkAgain = () => {
    setTimedOut(false);
    setWindowStart(Date.now());
    void mutate();
  };

  return { transaction, phase, isChecking: isValidating, checkAgain };
}
