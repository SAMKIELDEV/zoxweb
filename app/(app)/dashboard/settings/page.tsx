import type { Metadata } from "next";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Settings" };

/** The Settings route. SettingsContent resolves every state of the page. */
export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <SettingsContent />
    </>
  );
}
