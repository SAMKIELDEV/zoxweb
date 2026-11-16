import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { WhatsAppIcon } from "./BrandIcons";
import { HERO, HOW_IT_WORKS_ID } from "./content";
import { PhoneDemo } from "./PhoneDemo";
import { container, headingTracking } from "./Section";

/**
 * Soft color behind the phone. The hero and the closing section share it,
 * so both read as the same background (brief 08).
 */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
    >
      <div className="absolute top-0 right-0 h-72 w-80 rounded-[63%_37%_54%_46%/55%_48%_52%_45%] bg-accent opacity-[0.12] blur-[56px]" />
      <div className="absolute bottom-0 left-0 h-48 w-52 rounded-[44%_56%_36%_64%/60%_44%_56%_40%] bg-forest opacity-10 blur-2xl" />
    </div>
  );
}

/**
 * The hero's phone, with the glow behind it. The handset, the chat screen
 * and the demo are PhoneDemo; they render with the page, and only the demo
 * waits for script.
 */
function Phone() {
  return (
    <div className="relative mx-auto w-full max-w-80">
      <Glow className="-inset-x-10 -inset-y-8" />
      <div className="relative">
        <PhoneDemo />
      </div>
      {/* Without script the demo cannot play: show the conversation as it ends. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>[data-chat-reveal]{opacity:1!important;transform:none!important}</style>",
        }}
      />
    </div>
  );
}

/**
 * The first screen (brief 02): the headline, what Zox does in one line,
 * two ways forward, and the phone with its composer. Everything here
 * loads with the page; nothing is deferred.
 */
export function Hero() {
  const [first, second] = HERO.headline;
  // The last word of the second line takes the italic terracotta (DESIGN.md section 14).
  const lastSpace = second.lastIndexOf(" ");

  return (
    // overflow-x-clip: the glow behind the phone reaches past a phone's screen edge.
    <section aria-labelledby="hero-heading" className="overflow-x-clip">
      <div
        className={cn(
          container,
          "grid items-center gap-12 pt-6 pb-16 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:pt-4 lg:pb-20",
        )}
      >
        <div className="lg:pt-20">
          <h1
            id="hero-heading"
            className={cn(
              "mb-6 font-display text-hero font-semibold text-ink",
              headingTracking,
            )}
          >
            <span className="block">{first} </span>
            {/* Two lines at every width, as the brief asks: text-hero shrinks on phones so this fits. */}
            <span className="block whitespace-nowrap">
              {second.slice(0, lastSpace + 1)}
              <em className="text-accent italic">
                {second.slice(lastSpace + 1)}
              </em>
            </span>
          </h1>

          <p className="mb-9 max-w-120 text-lead text-ink-2">{HERO.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href={START_CHAT.href}
              external={START_CHAT.external}
              variant="primary"
              size="lg"
              shape="pill"
              className="shadow-cta"
            >
              <WhatsAppIcon />
              {HERO.primary}
            </ButtonLink>
            <ButtonLink
              href={`#${HOW_IT_WORKS_ID}`}
              variant="secondary"
              size="lg"
              shape="pill"
            >
              {HERO.secondary}
            </ButtonLink>
          </div>
        </div>

        <Phone />
      </div>
    </section>
  );
}
