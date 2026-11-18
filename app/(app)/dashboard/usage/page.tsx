import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/PageHeader";
import { UsageContent } from "@/components/usage/UsageContent";

export const metadata: Metadata = { title: "Usage" };

/** Usage: credits per day over a chosen period, where they went, and recent activity. */
export default function UsagePage() {
  return (
    <>
      <PageHeader title="Usage" />
      <UsageContent />
    </>
  );
}
