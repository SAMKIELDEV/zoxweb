"use client";

import type { ReactNode } from "react";
import { useSignedIn } from "./useSignedIn";

/** Shows its children only to a visitor who is not signed in (the footer's "Sign in"). */
export function HideWhenSignedIn({ children }: { children: ReactNode }) {
  return useSignedIn() ? null : <>{children}</>;
}
