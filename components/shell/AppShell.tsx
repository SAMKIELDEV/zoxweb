import type { ReactNode } from "react";
import { AccountNotice } from "./AccountNotice";
import { MobileBar } from "./MobileBar";
import { SidebarNav } from "./SidebarNav";

/**
 * Frame for every signed-in page: the floating sidebar panel (768px and
 * up) or the phone bar with its menu sheet, then the content column. Each
 * page opens with its own PageHeader, which holds the page's one h1.
 * The content clears the panel: 16px inset + 64px rail + 16px gap from
 * 768px, 16px + 220px + 16px from 1024px. It is capped at 1120px.
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
      <MobileBar />
      <SidebarNav />
      <div className="flex min-h-dvh flex-col md:pl-24 lg:pl-63">
        {/* tabIndex -1: the skip link and ErrorState move focus here. It is
            a landing spot, not a control, so it shows no focus ring. */}
        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          <div className="w-full max-w-280 px-5 pt-8 pb-16 md:px-8 md:pt-12 lg:px-12 lg:pt-14">
            <AccountNotice />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
