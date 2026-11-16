import { container } from "@/components/marketing/Section";
import { LoadingRegion, Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

/** While the prices load: the page's own layout, in wash. */
export default function PricingLoading() {
  return (
    <div className={cn(container, "py-12 md:py-16")}>
      <LoadingRegion label="Loading prices" className="max-w-[68ch]">
        <Skeleton className="h-lh w-40 text-title" />
        <Skeleton className="mt-3 h-lh w-full text-base" />
        <Skeleton className="mt-10 h-lh w-28 text-sm" />
        <div className="mt-2 flex gap-6">
          <Skeleton className="h-11 w-36" />
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="mt-6">
          <div className="flex justify-between border-b border-line py-3">
            <Skeleton className="h-lh w-12 text-sm" />
            <Skeleton className="h-lh w-14 text-sm" />
            <Skeleton className="h-lh w-10 text-sm" />
          </div>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center justify-between border-b border-line py-5">
              <Skeleton className="h-lh w-20 text-lg" />
              <Skeleton className="h-lh w-16 text-base" />
              <Skeleton className="h-lh w-24 text-base" />
            </div>
          ))}
        </div>
      </LoadingRegion>
    </div>
  );
}
