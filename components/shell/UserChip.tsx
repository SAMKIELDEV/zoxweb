"use client";

import Link from "next/link";
import { useAccount } from "@/hooks/useAccount";
import { initials, tierLabel } from "@/lib/format";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Who is signed in and on which plan. Links to Settings.
 * Loading: skeletons the same size. Error: renders nothing here, because
 * the page content already reports the failed load.
 */
export function UserChip() {
  const { snapshot, isLoading } = useAccount();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="hidden flex-col items-end gap-1 md:flex">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="size-9 rounded-full" />
      </div>
    );
  }

  if (!snapshot) return null;

  const { identity } = snapshot;
  const displayName = identity.name?.trim() || identity.email;
  const plan = `${tierLabel(snapshot.linked ? snapshot.account.tier : null)} plan`;

  return (
    <Link
      href="/dashboard/settings"
      aria-label={`${displayName}, ${plan}. Open settings`}
      className="flex min-h-11 items-center gap-3 rounded-md"
    >
      <span className="hidden min-w-0 flex-col items-end md:flex">
        <span className="max-w-48 truncate text-sm font-medium text-ink">{displayName}</span>
        <span className="text-xs text-ink-2">{plan}</span>
      </span>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-xs font-semibold text-ink"
      >
        {initials(identity.name, identity.email)}
      </span>
    </Link>
  );
}
