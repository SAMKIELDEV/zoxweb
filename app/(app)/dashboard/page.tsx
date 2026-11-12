import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return <HomeContent />;
}
