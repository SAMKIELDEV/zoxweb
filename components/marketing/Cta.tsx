import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { START_CHAT } from "@/lib/site";
import { WhatsAppIcon } from "./BrandIcons";
import { Composer } from "./Composer";
import { CTA } from "./content";
import { Glow } from "./Hero";
import { Reveal } from "./Reveal";
import { SectionTitle, container } from "./Section";

/**
 * Brief 08: the hero's background again, centred: two lines, one button,
 * and the composer repeated. Its one animation: the composer rises 8px as
 * it fades in, once.
 */
export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-line">
      <div className={cn(container, "relative flex flex-col items-center py-20 text-center lg:py-28")}>
        <Glow className="inset-x-6 inset-y-10 mx-auto max-w-180" />
        <SectionTitle id="cta-heading" lines={CTA.heading} className="relative mb-8" />
        <ButtonLink
          href={START_CHAT.href}
          external={START_CHAT.external}
          variant="primary"
          size="lg"
          shape="pill"
          className="relative mb-10 shadow-cta"
        >
          <WhatsAppIcon />
          {CTA.button}
        </ButtonLink>
        <Reveal threshold={0.6} className="relative w-full max-w-120 text-left">
          <div className="transition-[opacity,transform] duration-(--dur-slow) ease-zox group-data-[reveal=ready]/reveal:translate-y-2 group-data-[reveal=ready]/reveal:opacity-0">
            <Composer />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
