import type { Metadata } from "next";
import Link from "next/link";
import { ContactLines, hasContactLines } from "@/components/marketing/ContactLines";
import { LegalPage, type LegalSection } from "@/components/marketing/LegalPage";
import { OPERATOR, REGISTERED_ADDRESS } from "@/lib/contact";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Privacy Policy";
const description = "What Zox collects, why, who it goes to, how long we keep it, and your rights under Nigerian law.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", url: "/privacy", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** Change this whenever the text below changes. */
const UPDATED = "2026-11-15";

/**
 * The services that receive personal data, as found in the backend and
 * website code (their API calls, SDKs and settings) on the date above.
 * Add one here before the code starts sending it data.
 */
const PROCESSORS: { name: string; does: string; data: string }[] = [
  { name: "Meta (WhatsApp Business Platform)", does: "Carries every message between you and Zox.", data: "Your WhatsApp number, messages, voice notes, files and images, and Zox's replies." },
  { name: "Groq", does: "Runs the AI models that write replies, read images and transcribe voice notes.", data: "Your messages, recent conversation, text taken from PDFs and video transcripts, images and voice notes." },
  { name: "Tavily", does: "Web search.", data: "The search query Zox writes from your message." },
  { name: "FreeAPI.pro", does: "Fetches media from social media links, makes images, and speaks voice replies.", data: "The links you ask Zox to download, your image descriptions, and the text of replies Zox speaks." },
  { name: "FxTwitter", does: "Fetches media from X (Twitter) links.", data: "The X links you ask Zox to download." },
  { name: "YouTube", does: "Provides video transcripts for summaries.", data: "The video link you send." },
  { name: "Paystack", does: "Takes payments in naira.", data: "Your email address, the amount, and the card or bank details you enter on Paystack's page." },
  { name: "Bachs", does: "Takes payments in US dollars and gives the naira exchange rate.", data: "Your email address, the amount, and the card details you enter on Bachs's page." },
  { name: "Neon", does: "Hosts our database.", data: "Everything we keep, as listed in this policy." },
  { name: "Render", does: "Hosts the Zox service that answers your messages.", data: "Everything Zox processes, while it processes it." },
  { name: "Vercel", does: "Hosts this website and the dashboard.", data: "Your visits to the website and dashboard, and the requests the dashboard makes for you." },
  { name: "Telegram", does: "Delivers error alerts to our team.", data: "Internal account and request IDs and a description of the error. Never message content." },
];

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          {OPERATOR.name} ({OPERATOR.registration}), a company registered in {OPERATOR.country}, runs Zox and decides how
          and why your personal data is used. Under the Nigeria Data Protection Act 2023 that makes us the data
          controller.
          {REGISTERED_ADDRESS ? ` Our registered address is ${REGISTERED_ADDRESS}.` : null}
        </p>
        <p>
          This policy covers Zox on WhatsApp, this website and the Zox dashboard. Signing in uses SAMKIEL ID, the
          sign-in shared by SAMKIEL products, which keeps your name, email address and password. This policy covers
          what Zox receives from it.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    content: (
      <>
        <h3>When you message Zox</h3>
        <ul>
          <li>
            <strong>Your WhatsApp number</strong>, which identifies your account, and a preferred name if one is saved.
          </li>
          <li>
            <strong>Your messages and Zox&rsquo;s replies</strong>, including captions, links, the transcripts of your
            voice notes, and what you ask Zox to draw.
          </li>
          <li>
            <strong>Voice notes, PDFs and images.</strong> Zox reads them to answer you. They wait in a temporary queue
            for at most 6 hours and are not kept after that. We keep the transcript of a voice note, not the recording.
          </li>
          <li>
            <strong>Usage and request records</strong>: what kind of request you made, when, how much text the AI read
            and wrote, and the credits it used. We also record which social media links you asked Zox to download.
          </li>
        </ul>
        <h3>When you use the dashboard</h3>
        <ul>
          <li>
            <strong>Your SAMKIEL ID</strong>: an account identifier, your name and your email address, so we can link
            your WhatsApp number and show your account.
          </li>
          <li>
            <strong>Payment records</strong>: the pack, amount, currency, exchange rate, status and the payment
            provider&rsquo;s references. We also keep the provider&rsquo;s confirmation of each payment, which can
            include your name, email address and phone number, the IP address you paid from, your bank, and your
            card&rsquo;s type, expiry date, first six and last four digits.
          </li>
        </ul>
        <p>
          <strong>We never receive or store your full card number or security code.</strong> You enter those on the
          payment provider&rsquo;s own page.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it, and why we are allowed to",
    content: (
      <>
        <p>We use your data only for these purposes, each with its legal basis under the Act:</p>
        <ul>
          <li>
            <strong>To provide Zox</strong>: answer your messages, run the tools you ask for, keep your conversation in
            context, count credits and take payments. Basis: performing our contract with you (the{" "}
            <Link href="/terms">Terms of Service</Link>).
          </li>
          <li>
            <strong>To keep Zox safe and working</strong>: prevent abuse and fraud, enforce our{" "}
            <Link href="/acceptable-use">Acceptable Use Policy</Link>, find and fix errors. Basis: our legitimate
            interest in running a secure service, which we balance against your rights.
          </li>
          <li>
            <strong>To meet the law</strong>: keep accounting and tax records and answer lawful requests. Basis: legal
            obligation.
          </li>
        </ul>
        <p>We do not sell your data, use it for advertising, or use your content to train AI models.</p>
      </>
    ),
  },
  {
    id: "who-we-share-it-with",
    title: "Who we share it with",
    content: (
      <>
        <p>
          We share data only with the service providers that help us run Zox, and only what each one needs. They
          process it on our behalf.
        </p>
        <ul>
          {PROCESSORS.map((processor) => (
            <li key={processor.name}>
              <strong>{processor.name}.</strong> {processor.does} Receives: {processor.data}
            </li>
          ))}
        </ul>
        <p>
          We may also share data when the law requires it, or to protect the rights and safety of our users and others.
          If Zox is sold or merged, your data would move to the new owner under this policy.
        </p>
      </>
    ),
  },
  {
    id: "transfers-outside-nigeria",
    title: "Transfers outside Nigeria",
    content: (
      <p>
        Several of the providers above, including Meta, Groq and our hosting providers, process data outside Nigeria,
        mainly in the United States. We transfer data only on the grounds the Nigeria Data Protection Act 2023 allows,
        such as where the transfer is needed to perform our contract with you, and with providers that commit to
        protecting it.
      </p>
    ),
  },
  {
    id: "how-long-we-keep-it",
    title: "How long we keep it",
    content: (
      <ul>
        <li>
          <strong>Messages, transcripts, usage records and your account</strong>: for as long as you use Zox, until you
          ask us to delete them.
        </li>
        <li>
          <strong>Voice notes, PDFs and images</strong>: at most 6 hours, while Zox works on them.
        </li>
        <li>
          <strong>Download links</strong> for files too large for WhatsApp: they stop working after 1 hour.
        </li>
        <li>
          <strong>Linking codes</strong>: 10 minutes.
        </li>
        <li>
          <strong>Payment records</strong>: 6 years after the payment, because accounting and tax law requires it.
        </li>
      </ul>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Under the Nigeria Data Protection Act 2023 you can ask us to:</p>
        <ul>
          <li>tell you what data we hold about you and give you a copy;</li>
          <li>correct data that is wrong;</li>
          <li>delete your data, unless the law requires us to keep it;</li>
          <li>stop or limit some uses of it, or object to them;</li>
          <li>send your data to you or another service in a common format.</li>
        </ul>
        <p>
          To ask, contact us as described in <a href="#contact">Contact</a>. Tell us the WhatsApp number your request is
          about. We may ask you to prove the number is yours, for example with a message from it. We answer within 30
          days.
        </p>
        <p>
          You can also unlink your WhatsApp number at any time by replying UNLINK to Zox. If you are unhappy with how we
          handle your data, you can complain to the Nigeria Data Protection Commission.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        Zox is not for children under 13. Anyone under 18 needs permission from a parent or guardian to use it, as our{" "}
        <Link href="/terms">Terms of Service</Link> say. If we learn that a child under 13 is using Zox, we delete their
        data. If you think that has happened, contact us.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <ul>
        <li>Data travels encrypted (HTTPS) between you, Zox and our providers.</li>
        <li>Our database provider encrypts stored data.</li>
        <li>We check that every WhatsApp message and payment notice comes from Meta or the payment provider.</li>
        <li>Only the people who run Zox can reach its systems, and our logs are set up to leave out message content.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    content: (
      <>
        <p>This website uses no analytics, advertising or tracking cookies. It stores only what it needs to work:</p>
        <ul>
          <li>
            <strong>Sign-in cookies</strong> (<code>sk_access_token</code> and <code>sk_refresh_token</code>), set when
            you sign in with SAMKIEL ID and renewed by this site, so the dashboard knows it is you.
          </li>
          <li>
            <strong>In your browser&rsquo;s storage</strong>: your light or dark theme choice (<code>zox-theme</code>),
            when your sign-in was last renewed (<code>zox-session-renewed-at</code>), and, while you link WhatsApp, the
            linking step you are on (<code>zox-link-challenge</code>, cleared when the tab closes).
          </li>
          <li>
            <strong>Your currency choice</strong> on the Pricing page (<code>zox-currency</code>, a cookie kept for a
            year). We use your approximate country, from your connection, only to pick the currency shown first, and
            do not store it.
          </li>
        </ul>
        <p>
          When you pay, the payment provider&rsquo;s checkout runs its own page and may set its own cookies. Our hosting
          providers keep standard request logs, such as IP addresses, to run and protect their service.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        When we change this policy, we change the date at the top of this page. If a change affects how we use data we
        already have, we will tell you in the dashboard or on WhatsApp before it applies.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          For a data request or a question about this policy, contact us through the{" "}
          <Link href="/contact">Contact</Link> page{hasContactLines(["support", "address"]) ? " or here:" : "."}
        </p>
        <ContactLines lines={["support", "address"]} />
      </>
    ),
  },
];

/** The Privacy Policy. Static: built once, when the site is built. */
export default function PrivacyPage() {
  return <LegalPage title={title} updated={UPDATED} sections={sections} />;
}
