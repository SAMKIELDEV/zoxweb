import { LogoMark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { WhatsAppIcon } from "./BrandIcons";
import { Composer } from "./Composer";
import { HERO, HERO_EXCHANGE, HOW_IT_WORKS_ID } from "./content";
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
 * The hero's phone: a short exchange with Zox and a working composer under
 * it. The messages are real text, so they are read in order.
 */
function Phone() {
  return (
    <div className="relative mx-auto w-full max-w-95">
      <Glow className="-inset-x-10 -inset-y-8" />
      <div className="relative rounded-[2.5rem] border border-line bg-card p-2.5 shadow-card">
        <div className="rounded-[2rem] bg-surface">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-line-soft px-5 pt-5 pb-3.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-card">
              <LogoMark alt="" className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">Zox</p>
              <p className="flex items-center gap-1.5 text-micro text-ink-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-signal"
                />
                on WhatsApp
              </p>
            </div>
          </div>

          <ol
            role="list"
            aria-label="A chat with Zox"
            className="flex flex-col gap-3 px-4 py-5"
          >
            {HERO_EXCHANGE.map((message) =>
              message.from === "person" ? (
                <li
                  key={message.text}
                  className="ml-auto max-w-[85%] rounded-lg rounded-br-xs border border-line bg-card px-4 py-2.5 text-note text-ink shadow-bubble"
                >
                  <span className="sr-only">You: </span>
                  {message.text}
                </li>
              ) : (
                <li
                  key={message.text}
                  className="mr-auto max-w-[88%] rounded-lg rounded-tl-xs bg-linear-to-br from-bubble-accent to-bubble-accent-end px-4 py-2.5 text-note text-on-bubble shadow-bubble-accent"
                >
                  <span className="sr-only">Zox: </span>
                  {message.text}
                </li>
              ),
            )}
          </ol>

          <Composer suggestions className="px-4 pb-5" />
        </div>
      </div>
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
          "grid items-center gap-14 pt-14 pb-20 lg:grid-cols-[1.4fr_1fr] lg:pt-20 lg:pb-28",
        )}
      >
        <div>
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
