import type { ReactNode } from "react";
import { AccountNotice } from "./AccountNotice";
import { BottomNav } from "./BottomNav";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

/**
 * Frame for every signed-in page: sidebar (tablet and up), top bar,
 * content column, and bottom nav (mobile). Content is capped at 1120px.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <SidebarNav />
      <div className="flex min-h-dvh flex-col md:pl-16 lg:pl-55">
        <TopBar />
        <AccountNotice />
        {/* tabIndex -1: the skip link and ErrorState move focus here. It is
            a landing spot, not a control, so it shows no focus ring. */}
        <main id="content" tabIndex={-1} className="flex-1 pb-24 outline-none md:pb-12">
          <div className="mx-auto w-full max-w-280 px-5 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
