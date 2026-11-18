"use client";

import { List, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { NAV_ICON_SIZE, NAV_ITEMS, SETTINGS_ITEM, isActive } from "./nav";
import { NavRow } from "./NavRow";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";

const SHEET_ID = "dashboard-menu";

/**
 * Phones only: a slim bar with the Z mark and a menu button. The menu is a
 * modal sheet (a native dialog, so focus stays inside it, Escape closes it
 * and the page behind is inert) holding the same items as the sidebar.
 * It opens and closes at once: the dashboard's motion list has no room
 * for a sliding sheet (DESIGN.md section 9).
 */
export function MobileBar() {
  const pathname = usePathname();
  const sheet = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // A link in the sheet closes it; so does any other change of page.
  useEffect(() => {
    sheet.current?.close();
  }, [pathname]);

  const show = () => sheet.current?.showModal();
  const hide = () => sheet.current?.close();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper px-3 md:hidden">
      <Link href="/dashboard" aria-label="Zox, home" className="inline-flex size-11 items-center justify-center rounded-sm">
        <LogoMark alt="" className="size-6" />
      </Link>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={SHEET_ID}
        className="flex size-11 items-center justify-center rounded-md text-ink transition-colors duration-(--dur-fast) ease-zox hover:bg-wash"
      >
        <List aria-hidden="true" size={NAV_ICON_SIZE + 2} />
        <span className="sr-only">Menu</span>
      </button>

      <dialog
        id={SHEET_ID}
        ref={sheet}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onToggle={(event) => setOpen(event.currentTarget.open)}
        // A press on the backdrop lands on the dialog itself: close.
        onClick={(event) => {
          if (event.target === event.currentTarget) hide();
        }}
        className="m-0 mt-0 max-h-dvh w-full max-w-none border-b border-line bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/30"
      >
        <div className="flex flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex h-14 items-center justify-between">
            <span className="inline-flex size-11 items-center justify-center">
              <LogoMark alt="" className="size-6" />
            </span>
            <button
              type="button"
              onClick={hide}
              className="flex size-11 items-center justify-center rounded-md text-ink transition-colors duration-(--dur-fast) ease-zox hover:bg-wash"
            >
              <X aria-hidden="true" size={NAV_ICON_SIZE + 2} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="flex flex-col gap-1 pt-2">
            <ul role="list" className="flex flex-col gap-1">
              {[...NAV_ITEMS, SETTINGS_ITEM].map((item) => (
                <li key={item.href}>
                  <NavRow item={item} active={isActive(pathname, item.href)} place="sheet" onNavigate={hide} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
            <SignOutButton className="text-base" />
            <ThemeToggle />
          </div>
        </div>
      </dialog>
    </header>
  );
}
