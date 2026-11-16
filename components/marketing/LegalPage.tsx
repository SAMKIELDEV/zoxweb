import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { ICON_STROKE } from "@/components/shell/nav";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { Prose } from "./Prose";
import { container, headingTracking } from "./Section";

export interface LegalSection {
  /** The heading's anchor: lowercase words joined by hyphens, stable once published. */
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** When the text last changed, as an ISO date (YYYY-MM-DD). */
  updated: string;
  /** A short opening paragraph above the sections. */
  intro?: ReactNode;
  sections: readonly LegalSection[];
  /** Number the sections ("1. What Zox is"), as legal text is, so they can be referred to. On by default. */
  numbered?: boolean;
}

const heading = (section: LegalSection, index: number, numbered: boolean) =>
  numbered ? `${index + 1}. ${section.title}` : section.title;

function ContentsList({ sections, numbered }: { sections: readonly LegalSection[]; numbered: boolean }) {
  return (
    <ol role="list" className="flex flex-col gap-1">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex min-h-11 items-center rounded-sm text-sm text-ink-2 transition-colors duration-(--dur-fast) ease-zox hover:text-ink lg:min-h-8"
          >
            {heading(section, index, numbered)}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * The frame every legal page shares: the title, when it last changed, a
 * table of contents, and numbered sections with linkable headings.
 *
 * Desktop (1024px and up): the contents sit in a column beside the text and
 * stay in view while reading. Smaller screens: they fold away above the text
 * until opened. Printing drops the contents (and the navigation and footer)
 * and keeps the text.
 */
export function LegalPage({ title, updated, intro, sections, numbered = true }: LegalPageProps) {
  return (
    <article
      className={cn(container, "py-12 md:py-16 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 print:block print:py-0")}
    >
      <nav aria-label="On this page" className="hidden lg:block print:hidden">
        <div className="sticky top-24">
          <p className="mb-2 text-sm font-medium text-ink">On this page</p>
          <ContentsList sections={sections} numbered={numbered} />
        </div>
      </nav>

      <div className="min-w-0">
        <header className="mb-10 max-w-[68ch]">
          <h1 className={cn("font-display text-title font-semibold text-ink", headingTracking)}>{title}</h1>
          <p className="mt-3 text-sm text-ink-2">
            Last updated <time dateTime={updated}>{formatDate(`${updated}T12:00:00Z`)}</time>
          </p>
          {intro ? <div className="mt-6 text-base text-ink">{intro}</div> : null}
        </header>

        <details className="group mb-10 max-w-[68ch] rounded-md border border-line bg-surface lg:hidden print:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md px-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
            On this page
            <ChevronDown
              aria-hidden="true"
              size={18}
              strokeWidth={ICON_STROKE}
              className="text-ink-2 transition-transform duration-(--dur-fast) ease-zox group-open:rotate-180"
            />
          </summary>
          <nav aria-label="On this page" className="border-t border-line px-4 py-2">
            <ContentsList sections={sections} numbered={numbered} />
          </nav>
        </details>

        <Prose>
          {sections.map((section, index) => (
            <section key={section.id}>
              <h2 id={section.id}>{heading(section, index, numbered)}</h2>
              {section.content}
            </section>
          ))}
        </Prose>
      </div>
    </article>
  );
}
