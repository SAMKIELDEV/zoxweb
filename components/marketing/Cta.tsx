import { cn } from "@/lib/cn";
import { Composer } from "./Composer";
import { CTA } from "./content";
import { Glow } from "./Hero";
import { Reveal } from "./Reveal";
import { SectionTitle, container } from "./Section";

/**
 * Brief 08: the hero's background again (the same Glow), plus a soft
 * terracotta wash rising from the section's lower edge so the glow reads in
 * the light theme too (DESIGN.md, "Gradients"). Two centred lines and the
 * composer repeated; its Send is the section's one action. Its one
 * animation: the composer rises 8px as it fades in, once.
 */
export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate border-t border-line [overflow:clip]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent_70%)]"
      />
      <div className={cn(container, "relative flex flex-col items-center py-20 text-center lg:py-28")}>
        <Glow className="inset-x-6 inset-y-10 mx-auto max-w-180" />
        <SectionTitle id="cta-heading" lines={CTA.heading} className="relative mb-10" />
        <Reveal className="relative w-full max-w-120 text-left">
          <div className="transition-[opacity,transform] duration-(--dur-slow) ease-zox pre-reveal:translate-y-2 pre-reveal:opacity-0">
            <Composer />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
