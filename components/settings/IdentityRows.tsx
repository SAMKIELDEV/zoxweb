import { Skeleton } from "@/components/ui/Skeleton";
import { TextLink } from "@/components/ui/TextLink";
import type { Identity } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { ACCOUNTS_URL } from "@/lib/paths";

/** The line under the rows: where these details are managed, and the way there. */
function ManageNote({ className }: { className?: string }) {
  return (
    <p className={cn("mt-3 text-sm text-ink-2", className)}>
      Your name, email and password live in your SAMKIEL ID account.{" "}
      <TextLink href={ACCOUNTS_URL} external>
        Manage your SAMKIEL ID
      </TextLink>
    </p>
  );
}

/**
 * Who is signed in: name, SAMKIEL ID and email. Read-only, because all
 * three are managed on the SAMKIEL ID account site, which the line under
 * the rows links to. A row with nothing to show is left out, which is how
 * an account with no name set appears.
 */
export function IdentityRows({ identity }: { identity: Identity }) {
  // A name or an ID breaks at its spaces and hyphens. An email is one
  // unbroken run, so it breaks wherever the line ends.
  const rows = [
    { label: "Name", value: identity.name, wrap: "wrap-break-word" },
    { label: "SAMKIEL ID", value: identity.samkielId, wrap: "wrap-break-word" },
    { label: "Email", value: identity.email, wrap: "break-all" },
  ].filter((row) => row.value?.trim());

  return (
    <section aria-labelledby="samkiel-id-heading">
      <h2 id="samkiel-id-heading" className="mb-4 text-lg font-semibold text-ink">
        SAMKIEL ID
      </h2>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-4">
            <dt className="shrink-0 text-sm text-ink-2">{row.label}</dt>
            <dd className={cn("min-w-0 text-right text-sm tabular-nums text-ink", row.wrap)}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <ManageNote />
    </section>
  );
}

/**
 * Loading placeholder, exactly as tall as the real block with three
 * one-line rows. Each bar is one line of the text it stands for, and the
 * line under the rows is the real one, hidden, so it holds the space that
 * line takes at any width.
 */
export function IdentityRowsSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-lh w-32 text-lg" />
      <ul className="divide-y divide-line border-y border-line">
        {[0, 1, 2].map((index) => (
          <li key={index} className="flex items-center justify-between gap-4 py-4">
            <Skeleton className="h-lh w-20 text-sm" />
            <Skeleton className="h-lh w-36 text-sm" />
          </li>
        ))}
      </ul>
      <ManageNote className="invisible" />
    </div>
  );
}
