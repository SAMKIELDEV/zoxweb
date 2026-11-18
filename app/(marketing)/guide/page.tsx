import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/marketing/LegalPage";
import { CREDIT_COSTS } from "@/lib/costs";
import { FREE_DAILY_CREDITS } from "@/lib/pricing";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE, WHATSAPP_URL } from "@/lib/site";

const title = "Guide";
const description = "How to use Zox on WhatsApp: what you can send, voice notes, credits and your account.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/guide" },
  openGraph: { type: "website", url: "/guide", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** Change this whenever the text below changes. */
const UPDATED = "2026-11-15";

/**
 * Limits Zox applies, mirrored from the backend (PDF_PAGE_LIMIT in
 * src/tools/pdfExtract.ts, the 20 MB media cap in src/whatsapp/media.ts,
 * the 1-hour link in src/social/links.ts, LINK_TTL_SECONDS in
 * src/account/linking.ts, ACK_MIN_SECONDS in src/voice/forwarded.ts).
 * Change both together.
 */
const PDF_PAGES = 50;
const MEDIA_MB = 20;
const LINK_HOURS = 1;
const CODE_MINUTES = 10;
const FORWARD_ACK_SECONDS = 30;

/** Platforms Zox downloads from (src/social/urls.ts in the backend). */
const PLATFORMS =
  "Instagram, TikTok, YouTube Shorts, Facebook, X, Reddit, Pinterest, Snapchat, SoundCloud, CapCut, Douyin, Kuaishou and SnackVideo";

const sections: LegalSection[] = [
  {
    id: "start",
    title: "Start chatting",
    content: (
      <>
        <p>
          Zox lives on WhatsApp.{" "}
          {WHATSAPP_URL ? (
            <>
              <a href={WHATSAPP_URL}>Send it a message</a> and it answers.
            </>
          ) : (
            "Send it a message and it answers."
          )}{" "}
          There is nothing to install and no sign-up to start.
        </p>
        <p>
          You get {FREE_DAILY_CREDITS} free credits every day, enough for a good number of short chats. They refill
          every 24 hours.
        </p>
      </>
    ),
  },
  {
    id: "what-you-can-send",
    title: "What you can send",
    content: (
      <ul>
        <li>
          <strong>A question or a message.</strong> Ask anything, in plain words or the way you normally talk. Zox keeps
          the recent conversation in mind, so follow-ups work.
        </li>
        <li>
          <strong>Something current.</strong> Ask about news, prices or anything recent and Zox searches the web, then
          answers with its sources.
        </li>
        <li>
          <strong>A quick fact to look up.</strong> A word&rsquo;s meaning or synonyms, a sum or unit conversion, an
          exchange rate, research papers or a citation, a book, a country&rsquo;s statistics, the next public holiday, or
          what people are saying on X. Zox checks a source instead of guessing.
        </li>
        <li>
          <strong>A PDF</strong> of up to {PDF_PAGES} pages and {MEDIA_MB} MB. Zox reads it and sends back the key points.
          Add a caption to ask something specific. Scanned PDFs (pictures of pages) cannot be read yet.
        </li>
        <li>
          <strong>A photo, screenshot or diagram.</strong> Zox tells you what it sees, reads the text in it, or works
          through the problem in it. A caption tells it what you want.
        </li>
        <li>
          <strong>A YouTube link.</strong> Zox summarizes the video. Send the link alone and it asks whether you want a
          summary or the video itself.
        </li>
        <li>
          <strong>A social media link</strong> from {PLATFORMS}. Zox sends the photo, video or audio back. Say
          &ldquo;send me the audio&rdquo; to get just the sound. Only public posts work. A file too large for WhatsApp
          comes as a private link that stops working after {LINK_HOURS} hour.
        </li>
        <li>
          <strong>A request for a picture.</strong> &ldquo;Draw a sunset over Lagos lagoon&rdquo; and Zox makes the
          image and sends it.
        </li>
      </ul>
    ),
  },
  {
    id: "voice-notes",
    title: "Voice notes",
    content: (
      <>
        <p>
          Send a voice note and Zox listens, then answers it like a typed message. When the answer is short and easy to
          hear, Zox replies with a voice note in a Nigerian English voice. Answers with links, steps or a lot of detail
          come as text.
        </p>
        <p>
          Prefer one or the other? Say so: &ldquo;reply with a voice note&rdquo; or &ldquo;just type it&rdquo;. You can
          ask for a voice reply in a typed message too.
        </p>
        <h3>Forwarded voice notes</h3>
        <p>
          Forward someone else&rsquo;s long voice note and Zox summarizes it instead of replying to it. For notes of{" "}
          {FORWARD_ACK_SECONDS} seconds or more, Zox first tells you it has the note, how long it is and when it arrived,
          then sends the summary. Ask for the full transcript if you want every word.
        </p>
      </>
    ),
  },
  {
    id: "credits",
    title: "Credits",
    content: (
      <>
        <p>
          Every request uses credits. Your {FREE_DAILY_CREDITS} free daily credits are used first. When you need more,
          buy a pack from your dashboard. Bought credits do not expire.
        </p>
        <ul>
          {CREDIT_COSTS.map((row) => (
            <li key={row.label}>
              <strong>{row.label}</strong>: {row.cost}
            </li>
          ))}
        </ul>
        <p>
          A chat reply costs more when Zox reads or writes a lot. A request that fails is not charged. Packs and prices
          are on the <Link href="/pricing">Pricing</Link> page.
        </p>
      </>
    ),
  },
  {
    id: "your-account",
    title: "Your account",
    content: (
      <>
        <p>
          To see your balance and usage or buy credits, <Link href="/login">sign in</Link> with SAMKIEL ID and link your
          WhatsApp number:
        </p>
        <ol>
          <li>Open Settings in the dashboard and ask for a linking code.</li>
          <li>Send the four-letter code to Zox on WhatsApp within {CODE_MINUTES} minutes.</li>
          <li>Zox confirms, and your dashboard shows your credits and usage.</li>
        </ol>
        <p>
          To unlink, reply UNLINK to Zox (it asks you to confirm), or use Settings. Your credits and chats stay with the
          WhatsApp number.
        </p>
      </>
    ),
  },
  {
    id: "good-to-know",
    title: "Good to know",
    content: (
      <ul>
        <li>Zox can be wrong. Check anything important, and do not treat it as medical, legal or financial advice.</li>
        <li>Zox answers your messages one at a time, in the order you send them.</li>
        <li>Sending lots of messages quickly can make Zox ask you to slow down for a minute.</li>
        <li>
          Private posts, and posts that need a login, cannot be downloaded. Follow our{" "}
          <Link href="/acceptable-use">Acceptable Use Policy</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "help",
    title: "Need help?",
    content: (
      <p>
        Ask Zox first: it knows your credits and plan. For anything else, see the <Link href="/contact">Contact</Link>{" "}
        page.
      </p>
    ),
  },
];

/** How to use Zox. Static: built once, when the site is built. */
export default function GuidePage() {
  return <LegalPage title={title} updated={UPDATED} sections={sections} numbered={false} />;
}
