import { ButtonLink } from "@/components/ui/Button";

interface NotLinkedProps {
  /** One or two sentences on why this page needs a linked number. */
  body: string;
  heading?: string;
}

/**
 * Stands in for a page's content while no WhatsApp number is linked.
 * Linking happens on Home, so the one action here goes there.
 */
export function NotLinked({ body, heading = "Connect WhatsApp first" }: NotLinkedProps) {
  return (
    <section aria-labelledby="not-linked-heading" className="max-w-160">
      <h2 id="not-linked-heading" className="text-xl font-semibold text-ink md:text-2xl">
        {heading}
      </h2>
      <p className="mt-4 max-w-[52ch] text-base text-ink-2">{body}</p>
      <ButtonLink href="/dashboard" variant="primary" className="mt-8 w-full sm:w-auto">
        Connect WhatsApp
      </ButtonLink>
    </section>
  );
}
