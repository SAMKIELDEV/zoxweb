"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

const EASE = `cubic-bezier(${ease.join(",")})`;
/** Gives up waiting for a navigation that never arrives (a click a page cancelled, say). */
const GIVE_UP_MS = 10_000;

function reduced(): boolean {
  return document.documentElement.dataset.motion === "reduce";
}

/** True for a click that will make the App Router load another page. */
function isNavigation(event: MouseEvent): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  // Same page (a hash jump, or only the query changing): nothing loads.
  return url.pathname !== window.location.pathname;
}

/**
 * The page-load bar (DESIGN.md, "Page-load bar"): a 2px terracotta line
 * along the top of the window while a page loads, on every page.
 *
 * - First load: the bar is in the server markup and grows by CSS from the
 *   first paint (`.route-progress` in globals.css). When the page has
 *   loaded and hydrated, it fills and fades.
 * - Moving between pages: a click on an in-app link (or back and forward)
 *   starts it, and it fills and fades when the new path renders.
 *
 * Transform and opacity only. Without script it never shows; with reduced
 * motion it does not grow, it appears part-way and fades.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const running = useRef<Animation | null>(null);
  const giveUp = useRef<number | undefined>(undefined);
  const loading = useRef(true);
  const shown = useRef(pathname);

  const finish = () => {
    const element = bar.current;
    window.clearTimeout(giveUp.current);
    if (!element || !loading.current) return;
    loading.current = false;
    const from = getComputedStyle(element).transform;
    running.current?.cancel();
    element.style.animation = "none";
    running.current = element.animate(
      reduced()
        ? [{ transform: from, opacity: 1 }, { transform: from, opacity: 0 }]
        : [
            { transform: from === "none" ? "scaleX(0)" : from, opacity: 1 },
            { transform: "scaleX(1)", opacity: 1, offset: 0.55 },
            { transform: "scaleX(1)", opacity: 0 },
          ],
      { duration: reduced() ? 80 : duration.slow * 1000, easing: EASE, fill: "forwards" },
    );
  };

  const start = () => {
    const element = bar.current;
    if (!element) return;
    loading.current = true;
    running.current?.cancel();
    element.style.animation = "none";
    running.current = element.animate(
      reduced()
        ? [{ transform: "scaleX(0.6)", opacity: 1 }]
        : [
            { transform: "scaleX(0)", opacity: 1 },
            { transform: "scaleX(0.35)", opacity: 1, offset: 0.08 },
            { transform: "scaleX(0.9)", opacity: 1 },
          ],
      { duration: 8000, easing: EASE, fill: "forwards" },
    );
    window.clearTimeout(giveUp.current);
    giveUp.current = window.setTimeout(finish, GIVE_UP_MS);
  };

  // First load: finish once the page has loaded (it is hydrated by now).
  useEffect(() => {
    if (document.readyState === "complete") {
      finish();
      return;
    }
    window.addEventListener("load", finish, { once: true });
    return () => window.removeEventListener("load", finish);
  }, []);

  // In-app navigation starts the bar.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isNavigation(event)) start();
    };
    // Back and forward: only when the path changes (not a hash or query step).
    const onPop = () => {
      if (window.location.pathname !== shown.current) start();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // The new page rendered: fill and fade.
  const first = useRef(true);
  useEffect(() => {
    shown.current = pathname;
    if (first.current) {
      first.current = false;
      return;
    }
    finish();
  }, [pathname]);

  return <div ref={bar} aria-hidden="true" className="route-progress" />;
}
