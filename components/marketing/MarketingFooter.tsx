import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { WORDMARK } from "@/lib/brandWordmark";
import { cn } from "@/lib/cn";
import { INSTAGRAM_URL, WHATSAPP_URL, X_URL } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon, XIcon } from "./BrandIcons";
import { FOOTER_COLUMNS, FOOTER_DISCLAIMER, FOOTER_LEGAL_LINE, FOOTER_TAGLINE } from "./content";
import { HideWhenSignedIn } from "./HideWhenSignedIn";
import { Reveal } from "./Reveal";
import { container } from "./Section";

interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

/** Only the accounts that exist (brief 09): one with no address is left out. */
function socialLinks(): SocialLink[] {
  const all: { label: string; href: string | null; icon: ReactNode }[] = [
    { label: "Zox on X", href: X_URL, icon: <XIcon /> },
    { label: "Zox on Instagram", href: INSTAGRAM_URL, icon: <InstagramIcon /> },
    { label: "Chat with Zox on WhatsApp", href: WHATSAPP_URL, icon: <WhatsAppIcon size={14} /> },
  ];
  return all.flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));
}

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-on-night-2 transition-colors duration-(--dur-fast) ease-zox " +
  "hover:text-on-night md:min-h-8";

/**
 * Brief 09: the logo and tagline on a dark card, four plain link columns,
 * the company line, and a large wordmark along the bottom. The card is a
 * dark surface in both themes (the night tokens), with a hairline border in
 * the dark theme so it separates from the page. Text on it passes AA. The
 * wordmark is an outline with a soft fill, quiet but plain to see, fading
 * out toward the card's lower edge (DESIGN.md, "Footer").
 */
export function MarketingFooter() {
  const socials = socialLinks();

  return (
    <footer className={cn(container, "pb-6 print:hidden")}>
      <div className="relative overflow-hidden rounded-lg border border-transparent bg-night px-6 pt-12 pb-6 md:px-10 dark:border-night-line">
        <div className="relative grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Logo className="mb-3 h-7" />
            <p className="mb-5 text-copy text-on-night-2">{FOOTER_TAGLINE}</p>
            {socials.length > 0 ? (
              <ul role="list" className="flex items-center gap-2">
                {socials.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="flex size-11 items-center justify-center rounded-full border border-night-line text-on-night-2 transition-colors duration-(--dur-fast) ease-zox hover:text-on-night md:size-9"
                    >
                      {link.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="mb-3 font-sans text-note font-semibold tracking-normal text-on-night">{column.title}</h2>
                <ul role="list">
                  {column.links.map((link) => {
                    const item = (
                      <li key={link.href}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={linkClass}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                    // A signed-in visitor has Dashboard right below; "Sign in" would be a dead end.
                    return link.href === "/login" ? <HideWhenSignedIn key={link.href}>{item}</HideWhenSignedIn> : item;
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="relative mt-12 flex flex-col gap-1 border-t border-night-line pt-6 text-note text-on-night-2 sm:flex-row sm:flex-wrap sm:gap-x-3">
          <span>{FOOTER_LEGAL_LINE}</span>
          <small className="text-xs">{FOOTER_DISCLAIMER}</small>
        </p>

        {/* The large wordmark: decoration, cut off by the card's lower edge and fading out
            toward it. The footer's one animation: the outline traces the letters, then a soft
            fill follows it, once. */}
        <Reveal
          aria-hidden="true"
          atPageEnd
          amount={{ desktop: 0.3, phone: 0.3 }}
          className="pointer-events-none mt-10 -mb-[14%] select-none [mask-image:linear-gradient(to_bottom,black_30%,transparent_92%)]"
        >
          <svg viewBox={WORDMARK.viewBox} className="h-auto w-full overflow-visible">
            <g transform={WORDMARK.transform}>
              <path
                d={WORDMARK.d}
                fillRule="evenodd"
                className="fill-accent opacity-(--footer-mark-fill) transition-opacity duration-(--dur-slow) ease-zox [transition-delay:700ms] pre-reveal:opacity-0"
              />
              <path
                d={WORDMARK.d}
                fill="none"
                pathLength={1}
                strokeDasharray="1"
                strokeWidth={2}
                strokeLinejoin="round"
                className="stroke-accent opacity-(--footer-mark-line) transition-[stroke-dashoffset] duration-1000 ease-zox pre-reveal:[stroke-dashoffset:1]"
              />
            </g>
          </svg>
        </Reveal>
      </div>
    </footer>
  );
}
