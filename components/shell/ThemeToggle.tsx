"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { applyTheme, currentTheme } from "@/lib/theme";
import { ICON_STROKE } from "./nav";

interface ThemeToggleProps {
  /**
   * "tinted" draws the icon on a small filled square, as the public pages'
   * design does. The button is 44px across either way; only the drawing
   * inside it changes.
   */
  tone?: "plain" | "tinted";
  className?: string;
}

/**
 * Switches between light and dark. Which icon shows is decided in CSS
 * from the data-theme attribute, so the server and the browser always
 * render the same markup.
 */
export function ThemeToggle({ tone = "plain", className }: ThemeToggleProps) {
  const tinted = tone === "tinted";
  const size = tinted ? 16 : 18;
  const icons = (
    <>
      <Sun aria-hidden="true" size={size} strokeWidth={ICON_STROKE} className="dark:hidden" />
      <Moon aria-hidden="true" size={size} strokeWidth={ICON_STROKE} className="hidden dark:block" />
    </>
  );

  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      onClick={() => applyTheme(currentTheme() === "dark" ? "light" : "dark")}
      className={cn(
        "group flex size-11 items-center justify-center rounded-md text-ink-2 transition-colors duration-(--dur-fast) ease-zox hover:text-ink",
        !tinted && "hover:bg-wash",
        className,
      )}
    >
      {tinted ? (
        <span className="flex size-8 items-center justify-center rounded-sm bg-surface transition-colors duration-(--dur-fast) ease-zox group-hover:bg-wash">
          {icons}
        </span>
      ) : (
        icons
      )}
    </button>
  );
}
