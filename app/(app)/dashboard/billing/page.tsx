import type { Metadata } from "next";
import { BillingContent } from "@/components/billing/BillingContent";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" />
      <BillingContent />
    </>
  );
}
