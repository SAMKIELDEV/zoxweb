import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      <PageHeader title="Home" subtitle="Pick up where you left off with Zox." />
      <HomeContent />
    </>
  );
}
