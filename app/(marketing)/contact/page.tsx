import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { container, headingTracking } from "@/components/marketing/Section";
import { ButtonLink } from "@/components/ui/Button";
import { textLinkClass } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";
import { CONTACT_PHONE, DISPUTES_EMAIL, OPERATOR, REGISTERED_ADDRESS, SUPPORT_EMAIL, WHATSAPP_URL } from "@/lib/contact";
import { OPEN_GRAPH_IMAGE, SITE_NAME, TWITTER_IMAGE } from "@/lib/site";

const title = "Contact";
const description = "How to reach the people behind Zox: support, disputes, phone and post.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OPEN_GRAPH_IMAGE] },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [TWITTER_IMAGE] },
};

/** The link in a row: the shared link look, 44px tall on phones. */
const rowLink = `${textLinkClass} inline-flex min-h-11 items-center sm:min-h-0`;

interface Row {
  label: string;
  /** What the line is for, in a few words. */
  hint: string;
  value: ReactNode;
}

/** Only the ways that are configured. An unset value is left out, never shown blank. */
function rows(): Row[] {
  const all: (Row | null)[] = [
    WHATSAPP_URL
      ? { label: "WhatsApp", hint: "Questions about using Zox", value: <a href={WHATSAPP_URL} className={rowLink}>Message Zox</a> }
      : null,
    SUPPORT_EMAIL
      ? { label: "Support", hint: "Your account, credits, payments and refunds", value: <a href={`mailto:${SUPPORT_EMAIL}`} className={rowLink}>{SUPPORT_EMAIL}</a> }
      : null,
    DISPUTES_EMAIL
      ? { label: "Disputes", hint: "Complaints you want formally reviewed", value: <a href={`mailto:${DISPUTES_EMAIL}`} className={rowLink}>{DISPUTES_EMAIL}</a> }
      : null,
    CONTACT_PHONE
      ? { label: "Phone", hint: "When writing will not do", value: <a href={CONTACT_PHONE.href} className={rowLink}>{CONTACT_PHONE.display}</a> }
      : null,
    REGISTERED_ADDRESS
      ? { label: "Post", hint: "Our registered address", value: <span>{OPERATOR.name}, {REGISTERED_ADDRESS}</span> }
      : null,
  ];
  return all.filter((row): row is Row => row !== null);
}

/**
 * How to reach us. No form: every way out is a mailto, tel or WhatsApp
 * link, built from environment values when the site is built.
 */
export default function ContactPage() {
  const lines = rows();

  return (
    <div className={cn(container, "py-12 md:py-16")}>
      <header className="mb-10 max-w-[68ch]">
        <h1 className={cn("font-display text-title font-semibold text-ink", headingTracking)}>{title}</h1>
        <p className="mt-3 text-base text-ink-2">
          Zox is run by {OPERATOR.name} ({OPERATOR.registration}), in {OPERATOR.country}.
        </p>
      </header>

      {lines.length > 0 ? (
        <dl className="max-w-[68ch] border-t border-line">
          {lines.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <dt className="sm:w-40 sm:shrink-0">
                <span className="block text-base font-medium text-ink">{row.label}</span>
                <span className="block text-sm text-ink-2">{row.hint}</span>
              </dt>
              <dd className="text-base break-words text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="flex max-w-[68ch] flex-col items-start gap-4">
          <p className="text-base text-ink-2">Our contact details are on their way. For your credits, plan or payments, sign in and your dashboard has them.</p>
          <ButtonLink href="/login" variant="secondary">
            Sign in
          </ButtonLink>
        </div>
      )}

      <p className="mt-10 max-w-[68ch] text-sm text-ink-2">
        Asking for a refund or about your data? The <Link href="/refunds" className={textLinkClass}>Refund Policy</Link> and{" "}
        <Link href="/privacy" className={textLinkClass}>Privacy Policy</Link> say what to include.
      </p>
    </div>
  );
}
