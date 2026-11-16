"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ICON_STROKE } from "@/components/shell/nav";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { NAV_BUTTON, NAV_LINKS } from "./content";
import { container } from "./Section";

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-medium text-ink-2 " +
  "transition-colors duration-(--dur-fast) ease-zox hover:text-ink";

/**
 * The floating pill header of the public pages (brief 01): the wordmark on
 * the left, the links and one button on the right. "Text Zox" opens the
 * chat with no message filled in. On phones only the logo and a menu
 * button show; the menu holds the same links and the button.
 */
export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-3 z-20 print:hidden">
      <div className={container}>
        <nav
          aria-label="Main"
          className="relative flex h-15 items-center justify-between gap-3 rounded-full border border-line bg-card pr-2 pl-5 shadow-card"
        >
          <Link href="/" aria-label="Zox, home" className="inline-flex min-h-11 shrink-0 items-center rounded-sm">
            <Logo alt="" />
          </Link>

          {/* From 768px: everything in the pill. */}
          <div className="hidden items-center gap-1 md:flex">
            <ul role="list" className="flex items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle tone="tinted" />
            <ButtonLink
              href={START_CHAT.href}
              external={START_CHAT.external}
              variant="primary"
              size="sm"
              shape="pill"
            >
              {NAV_BUTTON}
            </ButtonLink>
          </div>

          {/* Phones: a menu button only. */}
          <div className="flex items-center md:hidden">
            <ThemeToggle tone="tinted" />
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-(--dur-fast) ease-zox hover:bg-wash"
            >
              {open ? (
                <X aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
              ) : (
                <Menu aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
              )}
            </button>
          </div>

          <div
            id={menuId}
            hidden={!open}
            className="absolute inset-x-0 top-full mt-2 rounded-lg border border-line bg-card p-3 shadow-card md:hidden"
          >
            <ul role="list" className="mb-3 flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={close} className={cn(linkClass, "w-full text-base")}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink
              href={START_CHAT.href}
              external={START_CHAT.external}
              variant="primary"
              shape="pill"
              className="w-full"
            >
              {NAV_BUTTON}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
