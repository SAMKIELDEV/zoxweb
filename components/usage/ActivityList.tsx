import { ActivityRows, ActivityRowsSkeleton } from "@/components/account/ActivityRows";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import type { Activity } from "@/lib/api/types";

/** The backend returns at most this many events and has no further pages. */
const BACKEND_LIMIT = 20;

/** How many rows the loading placeholder shows. */
const SKELETON_ROWS = 8;

/** The one line shown under the Activity heading when there is nothing to list. */
function NoActivityYet() {
  return (
    <EmptyState
      message="Nothing here yet. Send Zox a message on WhatsApp and it shows up."
      className="border-y border-line"
    />
  );
}

/**
 * Every event the backend returns, newest first, under its own heading.
 * - some events: the rows, plus a line saying only the newest 20 are
 *   shown once the list is that long
 * - no events: one line saying nothing has happened yet
 */
export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <section aria-labelledby="usage-activity-heading">
      <h2 id="usage-activity-heading" className="mb-4 text-lg font-semibold text-ink">
        Activity
      </h2>
      {items.length === 0 ? (
        <NoActivityYet />
      ) : (
        <>
          <ActivityRows items={items} />
          {items.length >= BACKEND_LIMIT ? (
            <p className="mt-3 text-sm text-ink-2">Showing your {BACKEND_LIMIT} most recent.</p>
          ) : null}
        </>
      )}
    </section>
  );
}

/** Loading placeholder: the heading and eight rows. */
export function ActivityListSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mb-4 h-7 w-24" />
      <ActivityRowsSkeleton rows={SKELETON_ROWS} />
    </div>
  );
}
