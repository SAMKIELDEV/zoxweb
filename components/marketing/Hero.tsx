import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { WhatsAppIcon } from "./BrandIcons";
import { ConversationMock } from "./ConversationMock";
import { container, headingTracking } from "./Section";

/**
 * The first screen: what Zox is, in one headline, and the way to start.
 * Everything here loads with the page; nothing is deferred. On phones and
 * tablets the chat illustration is left out, as in the design, and the
 * headline is the largest thing on screen.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(container, "grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24")}
    >
      <div>
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          Now available on WhatsApp
        </p>

        <h1 id="hero-heading" className={cn("mb-6 font-display text-hero font-semibold text-ink", headingTracking)}>
          Your WhatsApp,
          <br />
          <em className="text-accent italic">actually</em> useful now.
        </h1>

        <p className="mb-9 max-w-110 text-lead text-ink-2">
          Search the web, summarize PDFs, chat through ideas — all from a message. No downloads. No new apps. Just
          send a message.
        </p>

        <ButtonLink
          href={START_CHAT.href}
          external={START_CHAT.external}
          variant="primary"
          size="lg"
          className="shadow-cta"
        >
          <WhatsAppIcon />
          Chat with Zox on WhatsApp
        </ButtonLink>

        <p className="mt-4 text-xs text-ink-2">Free to start · No credit card required</p>
      </div>

      <ConversationMock className="hidden lg:block" />
    </section>
  );
}
