import Image from "next/image";
import mark from "@/public/brand/zox-icon.svg";
import wordmark from "@/public/brand/zox-logo.svg";
import { cn } from "@/lib/cn";

interface LogoProps {
  /**
   * Sets the size. Give a height (`h-7`) for the wordmark or a size
   * (`size-8`) for the mark; the width follows. Without one, the default
   * below applies.
   */
  className?: string;
  /** Pass "" when a parent link or heading already says "Zox". */
  alt?: string;
}

/** True when the caller has set a height, so the default must stand down. */
const hasHeight = (className?: string) => !!className && /(^|\s)(h-|size-)/.test(className);

/**
 * The Zox wordmark, rendered from the file in the brand pack
 * (docs/brand, copied to public/brand). The file is the logo: it is never
 * redrawn, recolored or rebuilt in code. Terracotta is the primary mark
 * and is used on both the cream and the dark theme, as the brand pack does.
 * Default height is 24px.
 */
export function Logo({ className, alt = "Zox" }: LogoProps) {
  return (
    <Image src={wordmark} alt={alt} loading="eager" className={cn(!hasHeight(className) && "h-6", "w-auto", className)} />
  );
}

/**
 * The standalone "z", for places too narrow for the wordmark, such as the
 * 64px sidebar rail. Default size is 28px.
 */
export function LogoMark({ className, alt = "Zox" }: LogoProps) {
  return <Image src={mark} alt={alt} loading="eager" className={cn(!hasHeight(className) && "size-7", className)} />;
}
