import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/components/marketing/Section";
import { SolutionBento, SolutionEditorial } from "@/components/marketing/SolutionVariants";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Design lab: five jobs", robots: { index: false, follow: false } };

/**
 * Dev-only comparison of the two "five jobs" designs (?v=a bento, ?v=b
 * editorial). It 404s in any production build, is never in the sitemap,
 * and is removed once one is chosen.
 */
export default async function SolutionLab({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { v } = await searchParams;
  const variant = v === "b" ? "b" : "a";
  return (
    <>
      <nav aria-label="Variants" className={cn(container, "flex gap-2 py-4 text-sm")}>
        <span className="mr-2 self-center text-ink-2">Design lab, five jobs:</span>
        {(["a", "b"] as const).map((key) => (
          <Link
            key={key}
            href={`/design-lab/solution?v=${key}`}
            aria-current={variant === key ? "page" : undefined}
            className={cn("inline-flex min-h-11 items-center rounded-full border px-4", variant === key ? "border-accent text-ink" : "border-line text-ink-2")}
          >
            {key === "a" ? "A: bento" : "B: editorial"}
          </Link>
        ))}
      </nav>
      {variant === "a" ? <SolutionBento /> : <SolutionEditorial />}
    </>
  );
}
