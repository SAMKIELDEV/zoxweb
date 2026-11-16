import type { Metadata } from "next";
import Link from "next/link";
import { ContactLines, hasContactLines } from "@/components/marketing/ContactLines";
import { LegalPage, type LegalSection } from "@/components/marketing/LegalPage";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Acceptable Use Policy";
const description = "What you may not use Zox for, what happens if you do, and how to report abuse.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/acceptable-use" },
  openGraph: { type: "website", url: "/acceptable-use", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** Change this whenever the text below changes. */
const UPDATED = "2026-11-15";

const sections: LegalSection[] = [
  {
    id: "not-allowed",
    title: "What is not allowed",
    content: (
      <>
        <p>
          This policy is part of our <Link href="/terms">Terms of Service</Link>. Do not use Zox, or anything it makes,
          to:
        </p>
        <ul>
          <li>break the law, or help someone else break it;</li>
          <li>harass, threaten, bully or abuse anyone;</li>
          <li>
            create, request or share sexual content involving minors. We report this to the authorities;
          </li>
          <li>
            impersonate a person or organisation, or make images or text meant to pass as real when they are not;
          </li>
          <li>write, spread or test malware, phishing or scams;</li>
          <li>collect or share other people&rsquo;s personal data without the right to;</li>
          <li>download or share content you do not have the right to use;</li>
          <li>
            get around rate limits or credit charges, run automated or bulk messaging through Zox, or attack, overload or
            reverse engineer it;
          </li>
          <li>
            break the academic integrity rules of your school or institution, for example by handing in Zox&rsquo;s work
            as your own where that is not allowed.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-happens",
    title: "What happens if you break it",
    content: (
      <>
        <p>Depending on how serious it is, and whether it has happened before, we may:</p>
        <ul>
          <li>
            <strong>warn you</strong>;
          </li>
          <li>
            <strong>suspend you</strong>, for a time or until we have looked into it;
          </li>
          <li>
            <strong>ban you</strong>, closing your access for good.
          </li>
        </ul>
        <p>
          We can skip straight to a ban for serious harm, and we report illegal content to the authorities when the law
          requires it. If we close your access for breaking this policy, unused credits you bought are not refunded (see
          our <Link href="/refunds">Refund Policy</Link>).
        </p>
      </>
    ),
  },
  {
    id: "report-abuse",
    title: "How to report abuse",
    content: (
      <>
        <p>
          If someone is using Zox to harm you or others, tell us
          {hasContactLines(["support"]) ? ":" : <> through the <Link href="/contact">Contact</Link> page.</>}
        </p>
        <ContactLines lines={["support"]} />
        <p>
          Include what happened, when, and any screenshots. If someone is in immediate danger, contact the police or
          emergency services first.
        </p>
      </>
    ),
  },
];

/** The Acceptable Use Policy. Static: built once, when the site is built. */
export default function AcceptableUsePage() {
  return <LegalPage title={title} updated={UPDATED} sections={sections} />;
}
