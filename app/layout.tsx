import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  // Fraunces draws finer, narrower letters as it gets larger, when its
  // optical size axis is loaded. The landing page design relies on that
  // for its headline. Only the public pages use it: globals.css holds the
  // axis at one value everywhere else, so the dashboard's type is unchanged.
  axes: ["opsz"],
  // Italic is for the one emphasised word in the landing page headline.
  // The browser only downloads it on pages that use it.
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "serif"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["system-ui", "sans-serif"],
});

// The favicon, app icons, web manifest and the Open Graph and Twitter
// images are picked up from the files beside this one (favicon.ico,
// icon.svg, apple-icon.png, manifest.json, opengraph-image.png,
// twitter-image.png). They come from the brand pack in docs/brand.
export const metadata: Metadata = {
  // Makes the social image addresses absolute.
  metadataBase: new URL(SITE_URL),
  title: { default: "Zox", template: "%s | Zox" },
  description: "Your Zox credits, usage and WhatsApp link.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script sets data-theme before first paint, so the server
    // markup and the browser's differ on that one attribute by design.
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
