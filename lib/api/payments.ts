import { request } from "./client";
import type { Catalog, CheckoutRequest, CheckoutResult, TransactionLookup } from "./types";

export const PACKAGES_KEY = "/api/account/payments/packages";

/**
 * Packages with a live naira price. Each call makes the backend fetch
 * three exchange-rate quotes, so call it on demand, never on a timer.
 */
export function getPackages(): Promise<Catalog> {
  return request<Catalog>(PACKAGES_KEY);
}

export function createCheckout(body: CheckoutRequest): Promise<CheckoutResult> {
  return request<CheckoutResult>("/api/account/payments/checkout", { method: "POST", body });
}

export const transactionKey = (id: string) =>
  `/api/account/payments/transactions/${encodeURIComponent(id)}`;

export function getTransaction(id: string): Promise<TransactionLookup> {
  return request<TransactionLookup>(transactionKey(id));
}
