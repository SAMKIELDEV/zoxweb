"use client";

import useSWR from "swr";
import { getUsage, usageKey } from "@/lib/api/account";
import { isApiError, type ApiError } from "@/lib/api/client";
import type { UsagePeriod, UsageSeries } from "@/lib/api/types";
import { ACCOUNT_SYNC_MS } from "./useAccount";

/** The reader's own time zone, or UTC where the browser will not say. */
function readerTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Credits and requests per day over the last `days` days, and per tool
 * over the same days. Pass `enabled: false` while the account is not
 * linked: the backend has nothing to count. While a new period loads, the
 * last one stays on screen, so the toggle never drops the chart to a
 * skeleton.
 */
export function useUsageSeries(days: UsagePeriod, enabled: boolean) {
  const key = enabled ? usageKey(days, readerTimeZone()) : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR<UsageSeries, ApiError>(key, getUsage, {
    refreshInterval: ACCOUNT_SYNC_MS,
    refreshWhenHidden: false,
    keepPreviousData: true,
    dedupingInterval: 4000,
    shouldRetryOnError: (failure) => !(isApiError(failure) && [401, 403, 409].includes(failure.status)),
    errorRetryCount: 2,
  });

  return { series: data, error, isLoading, isValidating, refresh: () => mutate() };
}
