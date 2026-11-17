"use client";

import useSWR from "swr";
import { ACCOUNT_KEY, getAccount } from "@/lib/api/account";
import { isApiError, type ApiError } from "@/lib/api/client";
import type { Snapshot } from "@/lib/api/types";

export interface UseAccountOptions {
  /**
   * Poll interval in ms: faster while a WhatsApp link code is live, and on
   * Home so the balance follows chats. Polling pauses while the tab is hidden.
   */
  refreshInterval?: number;
}

/**
 * Every signed-in page re-reads the account this often (and when the tab
 * comes back into focus), so a change made in the chat, such as an UNLINK,
 * shows here within seconds instead of after a reload.
 */
export const ACCOUNT_SYNC_MS = 15_000;

/**
 * The account snapshot, shared by every page through SWR's cache: the
 * first page shows skeletons once, later pages render at once and
 * revalidate quietly.
 */
export function useAccount(options: UseAccountOptions = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Snapshot, ApiError>(ACCOUNT_KEY, getAccount, {
    refreshInterval: options.refreshInterval || ACCOUNT_SYNC_MS,
    refreshWhenHidden: false,
    revalidateOnFocus: true,
    dedupingInterval: 4000,
    // 401 redirects to sign-in and 403 is a closed account: retrying helps neither.
    shouldRetryOnError: (failure) => !(isApiError(failure) && (failure.status === 401 || failure.status === 403)),
    errorRetryCount: 2,
  });

  // SWR keeps the last good answer when a refetch fails. If the account
  // was closed while the dashboard was open, that would leave its old data
  // on screen under the "account can't be used" notice. So a 403 means no
  // snapshot, and every page takes its closed-account branch.
  const closed = error?.status === 403;

  return {
    snapshot: closed ? undefined : data,
    error,
    /** True only before the first answer. */
    isLoading,
    isValidating,
    /** Refetch now, for example after a purchase is confirmed. */
    refresh: () => mutate(),
  };
}
