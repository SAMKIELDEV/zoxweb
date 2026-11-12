/**
 * Shapes returned by the backend through the dashboard proxy
 * (lib/server.ts). These mirror the backend contract and must not drift
 * from it. Postgres bigint and numeric columns arrive as strings.
 */

import type { PackageId } from "@/lib/pricing";

export type Tier = "free" | "basic" | "pro" | "max";

export interface Identity {
  id: string;
  samkielId: string;
  name?: string;
  email: string;
}

export interface Account {
  id: string;
  whatsapp_number: string;
  tier: Tier;
  status: "active";
  created_at: string;
}

export interface Wallet {
  /** Total spendable credits, free and permanent together. */
  credits: number;
  /** The part of `credits` that resets every 24 hours. */
  free_credits: number;
  tokens_used_this_cycle: number;
  last_free_grant_at: string;
}

export type ActionType =
  | "chat"
  | "webSearch"
  | "youtubeSummary"
  | "pdfReader"
  | "imageUnderstanding"
  | "socialMediaDownload";

/** All-time totals for one action type. */
export interface UsageTotal {
  action_type: ActionType | (string & {});
  requests: number;
  tokens: string;
  credits: string;
}

export interface Activity {
  action_type: ActionType | (string & {});
  tokens_used: number;
  credits_charged: number;
  created_at: string;
}

export type TransactionStatus =
  | "pending"
  | "completed"
  | "succeeded"
  | "failed"
  | "expired"
  | "needs_review"
  | "refunded";

export type Currency = "NGN" | "USD";

export interface Transaction {
  id: string;
  status: TransactionStatus;
  credits_added: number;
  amount_usd: string;
  paid_amount: string | null;
  paid_currency: string | null;
  currency: string | null;
  expected_amount: string | null;
  provider: "paystack" | "bachs";
  created_at: string;
}

export interface UnlinkedSnapshot {
  identity: Identity;
  linked: false;
  account: null;
}

export interface LinkedSnapshot {
  identity: Identity;
  linked: true;
  account: Account;
  wallet: Wallet;
  usage: UsageTotal[];
  /** Newest 20 events. The backend does not page further. */
  recent: Activity[];
  /** Newest 20 purchases. The backend does not page further. */
  transactions: Transaction[];
}

export type Snapshot = UnlinkedSnapshot | LinkedSnapshot;

export interface LinkChallenge {
  /** ZOX- followed by 12 hex characters. Valid for 10 minutes. */
  code: string;
  expiresAt: string;
  whatsappUrl: string;
}

/** Package ids come from the shared pricing constants, so Billing and the landing page agree. */
export type { PackageId } from "@/lib/pricing";

export interface CreditPackage {
  id: PackageId;
  name: string;
  credits: number;
  amountUsd: string;
  /** Null when the live naira rate could not be fetched. */
  amountNgn: string | null;
  ngnError: string | null;
}

export interface Catalog {
  packages: CreditPackage[];
  available: Record<Currency, boolean>;
}

export interface CheckoutRequest {
  packageId: PackageId;
  currency: Currency;
  /** A fresh UUID per package and currency choice. Makes retries safe. */
  checkoutKey: string;
}

export interface CheckoutResult {
  transactionId: string;
  /** Null on a replay whose provider checkout is not ready yet. */
  checkoutUrl: string | null;
  status?: TransactionStatus;
}

export interface TransactionLookup {
  transaction: Transaction;
}
