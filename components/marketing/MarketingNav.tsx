"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ICON_STROKE } from "@/components/shell/nav";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { NAV_BUTTON, NAV_LINKS } from "./content";
import { NAV_Z_WIDTH, NavLogo } from "./NavLogo";
import { container } from "./Section";

/**
 * Scroll distances for the morph, with a gap between them so the header
 * never flickers near the boundary: compact past 24px, flat again under 8px.
 */
const COMPACT_AT = 24;
const FLAT_AT = 8;

/** Pill geometry, in px. The flat bar is 80px tall; the pill sits 12px down and is 56px tall, so the row's centre line never moves. */
const PILL_TOP = 12;
const PILL_HEIGHT = 56;
const PILL_RADIUS = PILL_HEIGHT / 2;
const PILL_PAD_LEFT = 20;
const LOGO_GAP = { phone: 16, wide: 32 } as const;

interface Geometry {
  /** Space left and right of the pill, inside the content column. */
  inset: number;
  /** How far the logo and the right-hand cluster move to sit inside the pill. */
  logoDx: number;
  clusterDx: number;
}

const FLAT: Geometry = { inset: 0, logoDx: 0, clusterDx: 0 };

const linkClass =
  "inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-ink-2 " +
  "transition-colors duration-(--dur-fast) ease-zox hover:text-ink";

/** Everything in `root` that can take focus, in tab order. */
function focusables(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")];
}

/**
 * The public pages' header (DESIGN.md, "Marketing motion", effect 1).
 *
 * At the top of the page it is flat: full width on the paper, wordmark
 * left, links and one button right. Once the page scrolls it folds into a
 * compact pill centred at the top, the wordmark folding into its Z, and
 * stays that way until the page is back at the top. It never hides.
 *
 * The header is fixed; a spacer of constant height holds its place, so
 * nothing shifts. The fold animates transform, opacity and one clip-path,
 * in CSS. Positions are measured, not animated: the logo and the cluster
 * slide by a transform to where the pill will be, and the pill's surface
 * is a full-width layer clipped down to its size.
 *
 * Phones: the logo and a menu button (with the theme switch). The menu
 * traps focus while open and closes on Escape.
 */
export function MarketingNav() {
  const [compact, setCompact] = useState(false);
  const [geometry, setGeometry] = useState<Geometry>(FLAT);
  // Transitions switch on only after the first measurement, so a page
  // loaded halfway down starts compact without animating into it.
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const rowRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Where the pill goes, from the row's width and the cluster's.
  const measure = useCallback(() => {
    const row = rowRef.current;
    const cluster = clusterRef.current;
    if (!row || !cluster) return;
    const width = row.clientWidth;
    const clusterWidth = cluster.offsetWidth;
    // The last control that is showing: the button from 768px, the menu button below.
    const last = [...cluster.children].reverse().find((child) => (child as HTMLElement).offsetWidth > 0) as
      | HTMLElement
      | undefined;
    // The right padding centres the last control (button or menu) in the pill's height.
    const padRight = last ? Math.max(4, (PILL_HEIGHT - last.offsetHeight) / 2) : 8;
    const gap = window.matchMedia("(min-width: 48rem)").matches ? LOGO_GAP.wide : LOGO_GAP.phone;
    const pill = PILL_PAD_LEFT + NAV_Z_WIDTH + gap + clusterWidth + padRight;
    const inset = Math.max(0, (width - pill) / 2);
    setGeometry({ inset, logoDx: inset + PILL_PAD_LEFT, clusterDx: -(inset + padRight) });
  }, []);

  useLayoutEffect(() => {
    measure();
    setCompact(window.scrollY > COMPACT_AT);
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [measure]);

  // Re-measure when the row or the cluster changes size (resize, fonts, zoom).
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (rowRef.current) observer.observe(rowRef.current);
    if (clusterRef.current) observer.observe(clusterRef.current);
    return () => observer.disconnect();
  }, [measure]);

  // A passive scroll listener, read once per frame, with hysteresis.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setCompact((current) => (current ? y > FLAT_AT : y > COMPACT_AT));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The menu: Escape closes it, Tab stays inside it, a press outside or a
  // switch to the wide layout closes it.
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !header) return;
      const sheet = document.getElementById(menuId);
      const items = [toggleRef.current, ...(sheet ? focusables(sheet) : [])].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (header && !header.contains(event.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 48rem)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [open, menuId]);

  const g = compact ? geometry : FLAT;
  const move = ready ? "transition-[transform,opacity,clip-path] duration-(--dur-nav) ease-nav" : "";
  const clip = (extra: number): CSSProperties => ({
    clipPath: `inset(${extra}px ${g.inset + extra}px ${extra}px ${g.inset + extra}px round ${PILL_RADIUS - extra}px)`,
  });
  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        data-compact={compact || undefined}
        className="fixed inset-x-0 top-0 z-30 pt-[env(safe-area-inset-top)] print:hidden"
      >
        <div className={container}>
          <div className="relative h-20">
            {/* The pill's surface: a hairline layer and a fill layer, clipped to the pill. Invisible while flat. */}
            <div
              aria-hidden="true"
              className={cn("pointer-events-none absolute inset-x-0", move)}
              style={{
                top: PILL_TOP,
                height: PILL_HEIGHT,
                opacity: compact ? 1 : 0,
                filter: "drop-shadow(var(--drop-soft))",
              }}
            >
              <div className={cn("absolute inset-0 bg-line", move)} style={clip(0)} />
              <div className={cn("absolute inset-0 bg-card", move)} style={clip(1)} />
            </div>

            <nav aria-label="Main" ref={rowRef} className="relative flex h-full items-center justify-between">
              <Link
                href="/"
                aria-label="Zox, home"
                className={cn("-mx-2.5 inline-flex min-h-11 items-center rounded-sm px-2.5", move)}
                style={{ transform: g.logoDx ? `translateX(${g.logoDx}px)` : undefined }}
              >
                <NavLogo compact={compact} animate={ready} />
              </Link>

              <div
                ref={clusterRef}
                className={cn("flex items-center gap-1", move)}
                style={{ transform: g.clusterDx ? `translateX(${g.clusterDx}px)` : undefined }}
              >
                <ul role="list" className="hidden items-center md:flex">
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
                  className="max-md:hidden"
                >
                  {NAV_BUTTON}
                </ButtonLink>
                <button
                  ref={toggleRef}
                  type="button"
                  aria-expanded={open}
                  aria-controls={menuId}
                  aria-label={open ? "Close menu" : "Open menu"}
                  onClick={() => setOpen((value) => !value)}
                  className="flex size-11 items-center justify-center rounded-full text-ink transition-colors duration-(--dur-fast) ease-zox hover:bg-wash md:hidden"
                >
                  {open ? (
                    <X aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
                  ) : (
                    <Menu aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
                  )}
                </button>
              </div>
            </nav>

            <div
              id={menuId}
              hidden={!open}
              className="absolute inset-x-0 top-full rounded-lg border border-line bg-card p-3 shadow-card md:hidden"
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
          </div>
        </div>
      </header>
      {/* Holds the fixed header's place, at one height in both states, so nothing below moves. */}
      <div aria-hidden="true" className="h-[calc(5rem+env(safe-area-inset-top))] print:hidden" />
    </>
  );
}
