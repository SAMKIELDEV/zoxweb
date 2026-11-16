import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Colours and fonts for generated social images (next/og). Those images are
 * drawn outside the browser, where the CSS tokens in app/globals.css do not
 * exist, so the light theme's values are repeated here. Keep them equal to
 * the tokens of the same name.
 */
export const OG_COLORS = {
  paper: "#faf6f0",
  ink: "#2a2420",
  ink2: "#5e544b",
  line: "#e4d9ce",
  accentStrong: "#a85c30",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Static cuts of the brand fonts (next/og cannot read the variable fonts
 * next/font serves). The files and their SIL Open Font License texts live
 * in assets/fonts, from the Fontsource builds.
 */
export async function ogFonts() {
  const file = (name: string) => readFile(path.join(process.cwd(), "assets", "fonts", name));
  const [fraunces, dmSans, dmSansMedium] = await Promise.all([
    file("fraunces-latin-600-normal.woff"),
    file("dm-sans-latin-400-normal.woff"),
    file("dm-sans-latin-500-normal.woff"),
  ]);
  return [
    { name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const },
    { name: "DM Sans", data: dmSans, weight: 400 as const, style: "normal" as const },
    { name: "DM Sans", data: dmSansMedium, weight: 500 as const, style: "normal" as const },
  ];
}
