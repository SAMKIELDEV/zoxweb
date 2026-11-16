import type { Metadata } from "next";
import Link from "next/link";
import { ContactLines, hasContactLines } from "@/components/marketing/ContactLines";
import { LegalPage, type LegalSection } from "@/components/marketing/LegalPage";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Refund Policy";
const description = "When Zox refunds a payment, how to ask, and how long it takes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/refunds" },
  openGraph: { type: "website", url: "/refunds", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** Change this whenever the text below changes. */
const UPDATED = "2026-11-15";

/** The windows this policy promises. Kept together so the text cannot disagree with itself. */
const ASK_WITHIN_DAYS = 30;
const MISTAKE_WITHIN_DAYS = 14;
const REPLY_WITHIN_BUSINESS_DAYS = 5;
const REFUND_WITHIN_BUSINESS_DAYS = 10;

const sections: LegalSection[] = [
  {
    id: "what-we-refund",
    title: "What we refund",
    content: (
      <>
        <p>We refund in full, including any payment provider fee:</p>
        <ul>
          <li>
            <strong>Failed charges</strong>: you were charged but the credits never arrived.
          </li>
          <li>
            <strong>Duplicate charges</strong>: you were charged more than once for the same pack.
          </li>
          <li>
            <strong>Wrong amounts</strong>: you were charged more than the price checkout showed.
          </li>
        </ul>
        <p>
          <strong>Packs bought by mistake.</strong> If you bought a pack you did not mean to and have not used any
          credits since, ask within {MISTAKE_WITHIN_DAYS} days of buying it. We refund the price of the pack, less any
          fee the payment provider keeps, and remove its credits.
        </p>
      </>
    ),
  },
  {
    id: "what-we-do-not-refund",
    title: "What we do not refund",
    content: (
      <ul>
        <li>Credits you have used. Each request is charged when it is answered, and that cost cannot be undone.</li>
        <li>Free daily credits. They cost nothing and are not money.</li>
        <li>
          Credits left when we close your access for breaking our <Link href="/terms">Terms of Service</Link> or{" "}
          <Link href="/acceptable-use">Acceptable Use Policy</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "how-to-ask",
    title: "How to ask for a refund",
    content: (
      <>
        <p>
          Contact us within {ASK_WITHIN_DAYS} days of the charge
          {hasContactLines(["support"]) ? ":" : <> through the <Link href="/contact">Contact</Link> page.</>}
        </p>
        <ContactLines lines={["support"]} />
        <p>Please include:</p>
        <ul>
          <li>the transaction reference from your dashboard&rsquo;s Billing page or the payment provider&rsquo;s receipt;</li>
          <li>the WhatsApp number linked to your account;</li>
          <li>what went wrong.</li>
        </ul>
      </>
    ),
  },
  {
    id: "what-happens-next",
    title: "What happens next",
    content: (
      <ul>
        <li>We reply within {REPLY_WITHIN_BUSINESS_DAYS} business days.</li>
        <li>
          If a refund is due, we send it within {REFUND_WITHIN_BUSINESS_DAYS} business days of approving it, to the card or
          account you paid with. We cannot send it anywhere else.
        </li>
        <li>Your bank may take a few more days to show it.</li>
        <li>Credits from a refunded payment are removed from your balance.</li>
      </ul>
    ),
  },
  {
    id: "chargebacks",
    title: "Chargebacks",
    content: (
      <p>
        Please contact us before disputing a charge with your bank: it is usually faster. If a payment is reversed
        through a chargeback, we remove the credits it bought.
      </p>
    ),
  },
  {
    id: "consumer-rights",
    title: "Your other rights",
    content: <p>This policy does not take away any right you have under Nigerian consumer protection law.</p>,
  },
];

/** The Refund Policy. Static: built once, when the site is built. */
export default function RefundsPage() {
  return <LegalPage title={title} updated={UPDATED} sections={sections} />;
}
