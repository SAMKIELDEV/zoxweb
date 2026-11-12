/**
 * Browser-side client for the dashboard's own /api routes. Credentials
 * travel only as SAMKIEL ID's httpOnly cookies; no token reaches this code.
 */

import { loginUrl } from "@/lib/paths";
import { renewSession } from "./renew";

export { safeNext } from "@/lib/paths";

export class ApiError extends Error {
  readonly status: number;
  /** Present when a checkout failed after the purchase row was created. */
  readonly transactionId?: string;

  constructor(status: number, message: string, transactionId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.transactionId = transactionId;
  }
}

/** Status 0 means the request never got an answer. */
export const NETWORK_ERROR = 0;

/** The session is over and could not be renewed: sign in again, then come back here. */
function goToLogin(): void {
  if (window.location.pathname === "/login") return;
  window.location.assign(loginUrl(window.location.pathname, true));
}

export interface RequestOptions {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  /**
   * What a 401 leads to: renew the session and ask again, and failing that
   * go to sign-in. Signing out opts out, since it needs no live session.
   */
  redirectOn401?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, redirectOn401 = true } = options;
  const send = () =>
    fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

  let response: Response;
  try {
    response = await send();
    // The access token lasts 15 minutes, so a 401 usually means it ran out.
    // Renew the session once and ask again. Repeating is safe: a 401 means
    // the first attempt did nothing, and checkout carries its own key.
    if (response.status === 401 && redirectOn401 && (await renewSession())) response = await send();
  } catch {
    throw new ApiError(NETWORK_ERROR, "Network request failed");
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // A body that is not JSON is handled by the status check below.
  }

  if (!response.ok) {
    if (response.status === 401 && redirectOn401) goToLogin();
    const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
    throw new ApiError(
      response.status,
      typeof record.error === "string" ? record.error : "Request failed",
      typeof record.transactionId === "string" ? record.transactionId : undefined,
    );
  }

  return data as T;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
