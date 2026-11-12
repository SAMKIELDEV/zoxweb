"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LinkWhatsApp } from "@/components/account/LinkWhatsApp";
import { LoadingRegion } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useAccount } from "@/hooks/useAccount";
import { cn } from "@/lib/cn";
import { IdentityRows, IdentityRowsSkeleton } from "./IdentityRows";
import { SignOutRow } from "./SignOutRow";
import { WhatsAppRows, WhatsAppRowsSkeleton } from "./WhatsAppRows";

const blocks = "flex flex-col gap-12 lg:gap-16";

/**
 * The page's one column. Sign out closes it whatever sits above, and
 * because it is rendered here once, a sign-out in progress carries on
 * when the sections above it change.
 */
function Column({ children }: { children?: ReactNode }) {
  return (
    <div className={cn("max-w-160", blocks)}>
      {children}
      <SignOutRow />
    </div>
  );
}

/**
 * Settings, in each of its states:
 * - loading: skeleton sections laid out like the linked page
 * - failed: one line saying so, with a retry
 * - not linked: the WhatsApp link flow first, because it is the one thing
 *   to do here, then who is signed in
 * - linked: who is signed in, then the linked number and plan. When the
 *   link lands during this visit, one line above them confirms it
 * A closed account (403) renders none of these; the shell already says why.
 * Sign out follows in every state, that one included.
 * The details shown are read-only: the backend has nothing to change them with.
 */
export function SettingsContent() {
  const { snapshot, error, isValidating, refresh } = useAccount();

  // Remember if this visit started unlinked, to confirm the link when it lands.
  const [startedUnlinked, setStartedUnlinked] = useState(false);
  useEffect(() => {
    if (snapshot && !snapshot.linked) setStartedUnlinked(true);
  }, [snapshot]);

  if (!snapshot) {
    if (error?.status === 403) return <Column />;
    // 401 is already on its way to the sign-in page, so keep the skeleton.
    if (error && error.status !== 401) {
      return (
        <Column>
          <ErrorState
            message="Couldn't load your settings. Try again."
            onRetry={() => void refresh()}
            retryLabel={isValidating ? "Trying again" : "Try again"}
          />
        </Column>
      );
    }
    return (
      <Column>
        <LoadingRegion label="Loading your settings" className={blocks}>
          <IdentityRowsSkeleton />
          <WhatsAppRowsSkeleton />
        </LoadingRegion>
      </Column>
    );
  }

  if (!snapshot.linked) {
    return (
      <Column>
        <LinkWhatsApp identityId={snapshot.identity.id} />
        <IdentityRows identity={snapshot.identity} />
      </Column>
    );
  }

  return (
    <Column>
      <div className="flex flex-col gap-6">
        {startedUnlinked ? (
          <p role="status" className="text-sm text-positive">
            WhatsApp is linked.
          </p>
        ) : null}
        <IdentityRows identity={snapshot.identity} />
      </div>
      <WhatsAppRows account={snapshot.account} />
    </Column>
  );
}
