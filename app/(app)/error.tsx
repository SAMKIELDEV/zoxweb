"use client";

import { ErrorState } from "@/components/ui/States";

/** Catches a page that crashed while rendering. Data failures are handled inside each block. */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState message="This page hit a problem and couldn't finish loading." onRetry={reset} />;
}
