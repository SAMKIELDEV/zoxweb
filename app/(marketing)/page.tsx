import type { Metadata } from "next";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { WhyZox } from "@/components/marketing/WhyZox";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Zox: your WhatsApp, actually useful now";
const description =
  "Search the web, summarize PDFs and chat through ideas, all from a WhatsApp message. No downloads and no new apps.";

// The basics only: title, description, canonical address and social
// preview. The preview images are the brand pack's, named here because
// setting openGraph and twitter on a page replaces the inherited ones.
// Fuller search work comes in the polish part.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE_NAME, title, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [TWITTER_IMAGE] },
};

/**
 * The public landing page. It is static: no session is read and nothing
 * is fetched, so it is built once and served as plain HTML. Each section
 * is its own component in components/marketing.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <WhyZox />
      <PricingTeaser />
    </>
  );
}
