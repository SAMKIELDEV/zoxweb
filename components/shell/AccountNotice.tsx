"use client";

import { useAccount } from "@/hooks/useAccount";

/**
 * Shown above the page when the account itself is closed to use
 * (suspended or banned: the backend answers 403). Pages cannot recover
 * from this, so it is said once here and not repeated in each block.
 */
export function AccountNotice() {
  const { error } = useAccount();
  if (error?.status !== 403) return null;

  return (
    <div role="alert" className="border-b border-line bg-surface px-5 py-4 md:px-8 lg:px-12">
      <p className="max-w-[60ch] text-sm text-ink">
        This account can&apos;t be used right now, so there&apos;s nothing to show here.
      </p>
    </div>
  );
}
