import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Account } from "@/lib/api/types";
import { formatPhone } from "@/lib/format";
import { WHATSAPP_URL } from "@/lib/site";

/** The first thing on linked Home: status, linked number and the way back to Zox. */
export function WhatsAppCard({ account }: { account: Account }) {
  return (
    <section aria-labelledby="whatsapp-heading" className="flex h-full flex-col rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-positive">
        <CheckCircle aria-hidden="true" size={20} />
        <span>Connected</span>
      </div>
      <h2 id="whatsapp-heading" className="mt-5 font-display text-xl font-semibold text-ink">
        Continue with Zox on WhatsApp
      </h2>
      <p className="mt-3 text-base text-ink-2">
        Your account is linked to <span className="tabular-nums text-ink">{formatPhone(account.whatsapp_number)}</span>.
      </p>
      <div className="mt-auto pt-8">
        {WHATSAPP_URL ? (
          <ButtonLink href={WHATSAPP_URL} variant="primary" external className="w-full sm:w-auto">
            Open WhatsApp
          </ButtonLink>
        ) : (
          <p className="text-sm text-ink-2">The WhatsApp chat link is unavailable. Open your existing Zox conversation in WhatsApp.</p>
        )}
      </div>
    </section>
  );
}

export function WhatsAppCardSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-lg border border-line bg-surface p-6">
      <Skeleton className="h-lh w-24 text-sm" />
      <Skeleton className="mt-5 h-8 w-72 max-w-full" />
      <Skeleton className="mt-3 h-lh w-64 max-w-full text-base" />
      <Skeleton className="mt-8 h-11 w-40 rounded-md" />
    </div>
  );
}
