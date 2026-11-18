"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { FAQS, FAQ_HEADING } from "./content";
import { SectionTitle, container } from "./Section";

/**
 * Brief 07: plain dividers, no card per question, the first answer open.
 * A single-open accordion (DESIGN.md, "FAQ"): opening one answer closes the
 * others. Each question is a button with aria-expanded and aria-controls;
 * its answer is a region, inert while closed. The answer's height and
 * opacity are the section's one animation (`.faq-panel` in globals.css);
 * with reduced motion it opens at once. Without script every answer shows,
 * so nothing is inert until the page has hydrated.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [hydrated, setHydrated] = useState(false);
  const baseId = useId();

  useEffect(() => setHydrated(true), []);

  return (
    <section aria-labelledby="faq-heading" className="border-t border-line">
      <div className={cn(container, "grid gap-8 py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:py-28")}>
        <SectionTitle id="faq-heading" lines={[FAQ_HEADING]} />
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((faq, index) => {
            const expanded = open === index;
            const buttonId = `${baseId}-q-${index}`;
            const panelId = `${baseId}-a-${index}`;
            return (
              <div key={faq.question}>
                <h3 className="font-sans text-lead font-medium tracking-normal text-ink">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                    className="group flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    {faq.question}
                    <Plus
                      aria-hidden="true"
                      size={20}
                      className={cn(
                        "shrink-0 text-ink-2 transition-transform duration-(--dur-base) ease-zox",
                        expanded && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  data-open={expanded}
                  inert={hydrated && !expanded}
                  className="faq-panel"
                >
                  <div className="min-h-0 overflow-hidden">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
