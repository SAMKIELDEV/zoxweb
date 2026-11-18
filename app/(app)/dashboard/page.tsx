import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import { TopUpAction } from "@/components/home/TopUpAction";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <>
      <PageHeader title="Home" action={<TopUpAction />} />
      <HomeContent />
    </>
  );
}
