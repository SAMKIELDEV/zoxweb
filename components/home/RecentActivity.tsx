import { ActivityRows, ActivityRowsSkeleton } from "@/components/account/ActivityRows";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import { TextLink } from "@/components/ui/TextLink";
import type { Activity } from "@/lib/api/types";

/** How many events Home shows. Usage lists more, up to the 20 the backend returns. */
export const HOME_ACTIVITY_ROWS = 5;

/** The latest few things Zox did, with a way through to Usage. */
export function RecentActivity({ items }: { items: Activity[] }) {
  const shown = items.slice(0, HOME_ACTIVITY_ROWS);

  return (
    <section aria-labelledby="recent-activity-heading">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="recent-activity-heading" className="text-lg font-semibold text-ink">
          Recent activity
        </h2>
        {shown.length > 0 ? (
          <TextLink href="/dashboard/usage" className="text-sm">
            Go to Usage
          </TextLink>
        ) : null}
      </div>
      {shown.length > 0 ? (
        <ActivityRows items={shown} />
      ) : (
        <EmptyState
          message="Nothing here yet. Send Zox a message on WhatsApp and it shows up."
          className="border-y border-line"
        />
      )}
    </section>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-7 w-40" />
      <ActivityRowsSkeleton rows={HOME_ACTIVITY_ROWS} />
    </div>
  );
}
