import { ICON_STROKE } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { FEATURES, type Feature } from "./content";
import { Eyebrow, SectionTitle, container, headingTracking } from "./Section";

const TONES: Record<Feature["tone"], string> = {
  accent: "bg-accent-tint text-accent",
  forest: "bg-forest-tint text-forest",
};

/** What Zox can do, one card per ability: one column on phones, two on tablets, three on desktop. */
export function Features() {
  return (
    <section aria-labelledby="features-heading" className="border-t border-line">
      <div className={cn(container, "py-20")}>
        <div className="mb-12 max-w-lg">
          <Eyebrow>What Zox does</Eyebrow>
          <SectionTitle id="features-heading" lines={["One chat.", "Everything you need done."]} />
        </div>

        {/* role="list": Safari drops list semantics from a list with no markers. */}
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, body, icon: Icon, tone }) => (
            <li key={title} className="rounded-lg border border-line bg-card p-6 shadow-card">
              <div aria-hidden="true" className={cn("mb-4 flex size-10 items-center justify-center rounded-md", TONES[tone])}>
                <Icon size={22} strokeWidth={ICON_STROKE} />
              </div>
              <h3 className={cn("mb-1.5 font-display text-lead leading-normal font-semibold text-ink", headingTracking)}>{title}</h3>
              <p className="text-sm leading-[1.6] text-ink-2">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
