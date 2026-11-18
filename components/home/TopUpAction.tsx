"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useAccount } from "@/hooks/useAccount";

/**
 * Home's one primary action, in the page header. Shown only once a
 * WhatsApp number is linked: before that, the link flow's own button is
 * the one primary action on the page.
 */
export function TopUpAction() {
  const { snapshot } = useAccount();
  if (!snapshot?.linked) return null;

  return (
    <ButtonLink href="/dashboard/billing" variant="primary">
      Top up
    </ButtonLink>
  );
}
