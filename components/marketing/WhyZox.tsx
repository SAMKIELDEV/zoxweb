import { cn } from "@/lib/cn";
import { REASONS } from "./content";
import { Eyebrow, SectionTitle, container, headingTracking } from "./Section";

/**
 * Three reasons to pick Zox, on the tinted band. The large numerals are
 * decoration: the reasons are not steps, so they are not read out as a
 * numbered list.
 */
export function WhyZox() {
  return (
    <section aria-labelledby="why-heading" className="border-t border-line bg-band">
      <div className={cn(container, "py-20")}>
        <Eyebrow>Why Zox</Eyebrow>
        <SectionTitle id="why-heading" lines={["Not another chatbot.", "Actually different."]} className="mb-12" />

        <ul role="list" className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {REASONS.map((reason, index) => (
            <li key={reason.title}>
              <p aria-hidden="true" className="mb-3 font-display text-2xl leading-none font-light text-accent/35">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={cn("mb-2.5 font-display text-point font-semibold text-ink", headingTracking)}>{reason.title}</h3>
              <p className="text-copy text-ink-2">{reason.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
