import type { Metadata } from "next";
import { HERO } from "@/components/marketing/content";
import { Cta } from "@/components/marketing/Cta";
import { Faq } from "@/components/marketing/Faq";
import { Hero } from "@/components/marketing/Hero";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { Problem, Solution, Trust } from "@/components/marketing/Story";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = `Zox: ${HERO.headline.join(" ")}`;
const description = HERO.subtitle;

// The preview images are the brand pack's, named here because setting
// openGraph and twitter on a page replaces the inherited ones.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE_NAME, title, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title, description, images: [TWITTER_IMAGE] },
};

/**
 * The public landing page, in the order of the landing copy brief
 * (docs/design/landing-copy.zip, 02 to 08; the header and footer come
 * from the layout). It is static: no session is read and nothing is
 * fetched. Only the composer runs script.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Trust />
      <Problem />
      <Solution />
      <PricingTeaser />
      <Faq />
      <Cta />
    </>
  );
}
