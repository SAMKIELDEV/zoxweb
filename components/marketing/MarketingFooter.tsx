import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
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
 * the company line, and a large faded wordmark along the bottom. The card
 * is dark in both themes.
 */
export function MarketingFooter() {
  const socials = socialLinks();

  return (
    <footer className={cn(container, "pb-6 print:hidden")}>
      <div className="relative overflow-hidden rounded-lg bg-night px-6 pt-12 pb-6 md:px-10">
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

        {/* The large faded wordmark: decoration, cut off by the card's lower edge. The footer's
            one animation: it rises into place once. */}
        <Reveal aria-hidden="true" threshold={0.2} className="pointer-events-none mt-8 -mb-[17%] select-none">
          <Logo
            alt=""
            className="h-auto w-full opacity-[0.07] transition-[opacity,transform] duration-1000 ease-zox group-data-[reveal=ready]/reveal:translate-y-1/4 group-data-[reveal=ready]/reveal:opacity-0"
          />
        </Reveal>
      </div>
    </footer>
  );
}
