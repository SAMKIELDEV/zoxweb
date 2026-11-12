"use client";

import useSWR from "swr";
import type { ApiError } from "@/lib/api/client";
import { PACKAGES_KEY, getPackages } from "@/lib/api/payments";
import type { Catalog } from "@/lib/api/types";

/**
 * The credit packages and which currencies can be paid in right now.
 *
 * Every fetch makes the backend ask for three live exchange-rate quotes,
 * so this is deliberately lazy: no polling, no refetch on tab focus, and
 * revisits within a minute reuse the last answer. `refresh` fetches on
 * demand. Pass `enabled: false` to skip the request (an unlinked account
 * cannot buy, so there is nothing to price).
 */
export function usePackages(enabled: boolean) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Catalog, ApiError>(enabled ? PACKAGES_KEY : null, getPackages, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60_000,
    errorRetryCount: 1,
  });

  return { catalog: data, error, isLoading, isValidating, refresh: () => mutate() };
}
