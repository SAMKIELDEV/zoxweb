import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Long-form text on the public pages: legal pages and blog posts. One
 * measure (about 68 characters), serif headings, and styles for the plain
 * elements inside it, so page content can be written as ordinary HTML or
 * MDX without classes. Tokens only.
 *
 * Headings sit 48px below the text before them and keep clear of the
 * sticky 64px navigation when reached by a link (html's scroll padding).
 */
const rules = [
  // Headings: Fraunces on the dashboard scale, normal tracking as on the landing page.
  // 20px and 16px, so they stay clearly below the page title (text-title) on phones.
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-normal [&_h2]:text-ink",
  "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:tracking-normal [&_h3]:text-ink",
  "[&>section:first-child>h2]:mt-0 [&>h2:first-child]:mt-0",
  // Body text and lists.
  "[&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6",
  "[&_li]:mb-2 [&_li]:pl-1 [&_li::marker]:text-ink-2",
  "[&_strong]:font-semibold [&_strong]:text-ink",
  // Links: the same look as textLinkClass in components/ui/TextLink.tsx, written as
  // descendant rules because the text inside is plain HTML or MDX. Change both together.
  "[&_a]:text-accent-ink [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-(--dur-fast) [&_a]:ease-zox [&_a:hover]:text-ink",
  // Inline code and code blocks (blog posts).
  "[&_code]:rounded-xs [&_code]:bg-wash [&_code]:px-1 [&_code]:text-sm",
  "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-line [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:text-sm",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
].join(" ");

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("max-w-[68ch] text-base text-ink", rules, className)}>{children}</div>;
}
