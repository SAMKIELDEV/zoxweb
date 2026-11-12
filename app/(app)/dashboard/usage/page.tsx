import type { Metadata } from "next";
import { UsageContent } from "@/components/usage/UsageContent";

export const metadata: Metadata = { title: "Usage" };

/** Usage: all-time totals, where the credits went, and recent activity. */
export default function UsagePage() {
  return <UsageContent />;
}
