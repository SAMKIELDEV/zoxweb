import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { INSTAGRAM_URL, WHATSAPP_URL, X_URL } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon, XIcon } from "./BrandIcons";
import { FOOTER_LINKS } from "./content";
import { container } from "./Section";

interface SocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

/** The profile links that have an address. One without is left out, not shown dead. */
function socialLinks(): SocialLink[] {
  const all: { label: string; href: string | null; icon: ReactNode }[] = [
    { label: "Zox on X", href: X_URL, icon: <XIcon /> },
    { label: "Zox on Instagram", href: INSTAGRAM_URL, icon: <InstagramIcon /> },
    { label: "Chat with Zox on WhatsApp", href: WHATSAPP_URL, icon: <WhatsAppIcon size={14} /> },
  ];
  return all.flatMap((link) => (link.href ? [{ ...link, href: link.href }] : []));
}

/**
 * The foot of the public pages: who makes Zox, the legal and help links,
 * and the profile links. On phones every link is at least 44px tall.
 */
export function MarketingFooter() {
  const socials = socialLinks();

  return (
    <footer className="border-t border-line bg-sidebar">
      <div className={cn(container, "py-10")}>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Logo className="mb-2 h-6" />
            <p className="text-note text-ink-2">
              A product of <span className="font-medium text-ink">SAMKIEL Studio</span>
            </p>
          </div>

          <nav aria-label="Footer">
            <ul role="list" className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  {/* prefetch is off: these pages do not exist yet. */}
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-(--dur-fast) ease-zox hover:text-ink md:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 ? (
            <ul role="list" className="flex items-center gap-3">
              {socials.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex size-11 items-center justify-center rounded-sm bg-surface text-ink-2 transition-colors duration-(--dur-fast) ease-zox hover:bg-wash hover:text-ink md:size-8"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <p className="mt-8 border-t border-line pt-6 text-xs text-ink-2">
          © {new Date().getFullYear()} SAMKIEL Studio. Zox is a WhatsApp-native product. Not affiliated with Meta
          Platforms, Inc.
        </p>
      </div>
    </footer>
  );
}
