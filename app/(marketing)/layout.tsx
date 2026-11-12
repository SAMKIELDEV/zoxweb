import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

/**
 * Frame for the public pages: the navigation above and the footer below.
 * The signed-in dashboard has its own frame in app/(app); nothing here
 * touches it. Fonts, theme and the paper grain come from the root layout.
 *
 * The public pages draw Fraunces at its optical sizes (finer and narrower
 * as it grows), as their design does. The rest of the app holds it at one
 * cut: see globals.css. Clearing that setting here hands the choice back
 * to the browser, which picks the cut from the text size.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col [font-variation-settings:normal]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <MarketingNav />
      <main id="content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
