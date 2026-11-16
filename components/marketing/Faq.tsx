import { Plus } from "lucide-react";
import Link from "next/link";
import { ICON_STROKE } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { FAQS, FAQ_HEADING } from "./content";
import { SectionTitle, container } from "./Section";

/**
 * Brief 07: plain dividers, no card per question, the first answer open.
 * Native <details>, so it opens with a keyboard and works without script.
 */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-line">
      <div className={cn(container, "grid gap-8 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-28")}>
        <SectionTitle id="faq-heading" lines={[FAQ_HEADING]} />
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((faq, index) => (
            <details key={faq.question} open={index === 0} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lead font-medium text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  aria-hidden="true"
                  size={20}
                  strokeWidth={ICON_STROKE}
                  className="shrink-0 text-ink-2 transition-transform duration-(--dur-base) ease-zox group-open:rotate-45"
                />
              </summary>
              <p className="max-w-140 pb-6 text-copy text-ink-2">
                {faq.answer}
                {faq.link ? (
                  <>
                    {" "}
                    <Link href={faq.link.href} className="text-accent-ink underline underline-offset-4">
                      {faq.link.label}
                    </Link>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
