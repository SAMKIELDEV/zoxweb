import type { Metadata } from "next";
import Link from "next/link";
import { ContactLines } from "@/components/marketing/ContactLines";
import { LegalPage, type LegalSection } from "@/components/marketing/LegalPage";
import { DISPUTES_EMAIL, OPERATOR, REGISTERED_ADDRESS, SUPPORT_EMAIL } from "@/lib/contact";
import { CREDIT_PACKAGES, FREE_DAILY_CREDITS } from "@/lib/pricing";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Terms of Service";
const description = `The agreement between you and ${OPERATOR.name} when you use Zox.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { type: "website", url: "/terms", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** Change this whenever the text below changes. */
const UPDATED = "2026-11-15";

/** "Basic, Pro and Max", from the shared package list. */
const packNames = CREDIT_PACKAGES.map((pack) => pack.name).reduce(
  (sentence, name, index, all) => (index === 0 ? name : `${sentence}${index === all.length - 1 ? " and " : ", "}${name}`),
  "",
);

/** "email support@…" when the address is configured; otherwise the contact page alone. */
function EmailOr({ address, children }: { address: string | null; children: React.ReactNode }) {
  return address ? <a href={`mailto:${address}`}>{address}</a> : <>{children}</>;
}

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          Zox is operated by {OPERATOR.name} ({OPERATOR.registration}), a company registered in {OPERATOR.country}.
          Zox is built by SAMKIEL Studio, part of {OPERATOR.name}. In these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo;
          and &ldquo;our&rdquo; mean {OPERATOR.name}, and &ldquo;you&rdquo; means the person using Zox.
        </p>
        <p>
          These terms are the agreement between you and us when you use Zox: on WhatsApp, on this website, or in the
          Zox dashboard. By using Zox you agree to them. If you do not agree, do not use Zox.
        </p>
        {REGISTERED_ADDRESS ? <p>Our registered address is {REGISTERED_ADDRESS}.</p> : null}
      </>
    ),
  },
  {
    id: "what-zox-is",
    title: "What Zox is",
    content: (
      <>
        <p>
          Zox is a general-purpose AI assistant that you use by sending messages to a WhatsApp number. It can chat,
          search the web, read PDFs and images, summarize YouTube videos, listen to and answer voice notes, make
          images, and fetch media from public social media posts. We add, change and remove features over time.
        </p>
        <p>
          Zox works through services run by other companies, including WhatsApp, which is provided by Meta. Zox is not
          made, endorsed or supported by Meta.
        </p>
      </>
    ),
  },
  {
    id: "who-can-use-zox",
    title: "Who can use Zox",
    content: (
      <ul>
        <li>You must be at least 13 years old.</li>
        <li>If you are under 18, you need permission from a parent or guardian to use Zox.</li>
        <li>You must use a WhatsApp number that you are allowed to use, and follow WhatsApp&rsquo;s own terms.</li>
        <li>You cannot use Zox if we have closed your access before, unless we agree in writing.</li>
      </ul>
    ),
  },
  {
    id: "accounts-and-whatsapp",
    title: "Your account and WhatsApp",
    content: (
      <>
        <p>
          You can start chatting with Zox without signing up. We keep your WhatsApp number, your credits and your
          usage together, so they are there when you come back.
        </p>
        <p>
          To see your balance, buy credits or change settings, sign in to the dashboard with a SAMKIEL ID account
          (the sign-in shared by SAMKIEL products) and link your WhatsApp number. You link it by sending Zox a
          four-letter code from the dashboard. A code works once and expires after 10 minutes.
        </p>
        <ul>
          <li>Keep your SAMKIEL ID sign-in details to yourself. You are responsible for what happens under your account.</li>
          <li>You are responsible for messages sent to Zox from your WhatsApp number.</li>
          <li>
            You can unlink your number at any time by replying UNLINK to Zox or from Settings in the dashboard. Your
            credits and chats stay with the WhatsApp number.
          </li>
          <li>
            If you think someone else is using your account or your number, tell us straight away (see{" "}
            <a href="#contact">Contact</a>).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "credits",
    title: "Credits",
    content: (
      <>
        <p>Zox runs on credits. Each request you make uses some.</p>
        <h3>Free daily credits</h3>
        <p>
          Every account gets {FREE_DAILY_CREDITS} free credits. They are replaced every 24 hours, they are used before
          any credits you bought, and unused free credits do not roll over or add up.
        </p>
        <h3>Credits you buy</h3>
        <ul>
          <li>
            You can buy credits in packs ({packNames}). Buying a pack moves your plan up to that pack&rsquo;s plan. It
            never moves it down.
          </li>
          <li>Credits you buy do not expire while Zox is offered.</li>
          <li>
            Credits work only in Zox. They cannot be used in other SAMKIEL products, moved to another account or number,
            sold, or exchanged for money. They have no cash value.
          </li>
        </ul>
        <h3>What requests cost</h3>
        <p>
          A chat reply costs credits according to how much Zox reads and writes. Tools such as web search, reading a
          PDF or making an image have fixed costs. The current costs are on the <Link href="/pricing">Pricing</Link> page
          and in your dashboard. We may change them; a change applies only to requests made after it is published.
        </p>
        <ul>
          <li>If a request fails, it is not charged.</li>
          <li>
            If a reply costs more than you have left, we still send it and take only the credits you have. Your
            balance never goes below zero.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    content: (
      <>
        <p>
          You pay for credits in the dashboard. Payments in naira are handled by Paystack and payments in US dollars by
          Bachs. The naira price is worked out from the exchange rate when you check out. Before you pay, checkout
          shows the total, including any fee the payment provider charges.
        </p>
        <ul>
          <li>Your card details go to the payment provider. We never see or store them.</li>
          <li>Credits are added once the payment provider confirms your payment.</li>
          <li>
            Refunds follow our <Link href="/refunds">Refund Policy</Link>.
          </li>
          <li>If a payment is reversed or charged back, we may remove the credits it bought.</li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>
          Use Zox lawfully and fairly. Our <Link href="/acceptable-use">Acceptable Use Policy</Link> is part of these
          terms and lists what is not allowed. In short, do not use Zox to:
        </p>
        <ul>
          <li>break the law, or harm, harass or impersonate anyone;</li>
          <li>create or share sexual content involving minors;</li>
          <li>spread malware, or attack, overload or reverse engineer Zox;</li>
          <li>get around rate limits, or automate abuse;</li>
          <li>break the academic integrity rules of your school or institution.</li>
        </ul>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    content: (
      <>
        <p>
          &ldquo;Your content&rdquo; means what you send Zox (messages, voice notes, PDFs, images and links) and what Zox
          makes for you in reply. You keep any rights you have in it. We do not claim ownership of it.
        </p>
        <p>
          So that we can run Zox, you give us a worldwide, non-exclusive, royalty-free licence to store, copy, process,
          send and display your content, only as needed to provide Zox to you, keep it secure, and meet our legal
          duties. This includes passing it to the service providers that help us run Zox, as our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains. The licence ends when your content is deleted, except for
          copies the law requires us to keep.
        </p>
        <ul>
          <li>Only send content you have the right to send.</li>
          <li>
            Zox fetches media only from public posts, and only for you to use where you have the right to. It does not
            sign in to accounts or get around paywalls or other protections.
          </li>
        </ul>
        <p>
          Zox itself, including its name, logo and software, belongs to us. These terms let you use Zox. They do not
          give you any other rights in it.
        </p>
      </>
    ),
  },
  {
    id: "ai-output",
    title: "AI output",
    content: (
      <>
        <p>Zox uses AI models to write replies, read files, transcribe voice notes and make images. That means:</p>
        <ul>
          <li>Replies can be wrong, incomplete or out of date, even when they sound sure.</li>
          <li>Web search results come from other websites, which we do not control.</li>
          <li>A voice note can be misheard, and an image can come out differently from what you asked for.</li>
          <li>
            Nothing Zox says is professional advice, whether medical, legal, financial or any other kind. Check anything
            important with a qualified person or a reliable source.
          </li>
        </ul>
        <p>You are responsible for how you use what Zox gives you, including at school or at work.</p>
      </>
    ),
  },
  {
    id: "suspension-and-termination",
    title: "Suspension and termination",
    content: (
      <>
        <p>
          You can stop using Zox at any time. You can unlink your WhatsApp number, and you can ask us to delete your Zox
          data as our <Link href="/privacy">Privacy Policy</Link> describes.
        </p>
        <p>
          We may warn you, limit what you can do, suspend you or close your access if you break these terms or the
          Acceptable Use Policy, if the law requires it, or to protect Zox, its users or other people. Where we are
          allowed to and it is practical, we will tell you why.
        </p>
        <ul>
          <li>If we close your access because you broke these terms, unused credits you bought are not refunded.</li>
          <li>
            If we stop offering Zox altogether, we will tell you at least 30 days before, and refund the credits you
            bought and have not used.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "No warranty",
    content: (
      <>
        <p>
          We work to keep Zox useful and running, but we provide it &ldquo;as is&rdquo; and &ldquo;as available&rdquo;.
          As far as the law allows, we make no promises that Zox will always be available, free of errors, or right for
          a particular purpose, and we give no warranties beyond those in these terms.
        </p>
        <p>Nothing in these terms takes away rights you have under Nigerian consumer protection law that cannot be excluded.</p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limits on our liability",
    content: (
      <>
        <p>As far as the law allows:</p>
        <ul>
          <li>
            we are not liable for indirect or consequential loss, or for lost profits, revenue, data or opportunities,
            arising from your use of Zox;
          </li>
          <li>
            our total liability to you for anything to do with Zox is limited to the amount you paid us for Zox in the 12
            months before the claim arose.
          </li>
        </ul>
        <p>
          These limits do not apply to death or personal injury caused by our negligence, to fraud, or to anything else
          the law does not allow us to limit.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms. When we do, we change the date at the top of this page. If a change matters to how
        you use Zox, we will tell you in the dashboard or on WhatsApp at least 14 days before it applies. If you keep
        using Zox after that, the new terms apply. If you do not agree with them, stop using Zox.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
        <p>
          If you have a dispute with us, please contact us first at{" "}
          <EmailOr address={DISPUTES_EMAIL ?? SUPPORT_EMAIL}>
            the address on our <Link href="/contact">Contact</Link> page
          </EmailOr>{" "}
          and give us 30 days to try to resolve it. If we cannot, the courts of Nigeria have jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          Questions about these terms? Contact us through the <Link href="/contact">Contact</Link> page.
        </p>
        <ContactLines lines={["support", "disputes", "address"]} />
      </>
    ),
  },
];

/** The Terms of Service. Static: built once, when the site is built. */
export default function TermsPage() {
  return <LegalPage title={title} updated={UPDATED} sections={sections} />;
}
