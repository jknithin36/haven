import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 8;

// Same panes, rows, and heights as the loaded inbox.
function MessagesSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 border-y border-border lg:flex lg:h-[calc(100dvh-14rem)] lg:min-h-130 lg:overflow-hidden"
    >
      <div className="lg:w-95 lg:shrink-0 lg:border-r lg:border-border">
        <div className="flex gap-4 border-b border-border px-4 pt-3 pb-2.5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-18" />
        </div>
        <div className="flex gap-2 border-b border-border p-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
        {Array.from({ length: ROWS }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-b border-border px-4 py-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      <div className="hidden flex-1 lg:block">
        <div className="flex gap-2 border-b border-border px-6 py-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="flex max-w-[65ch] flex-col gap-3 px-10 py-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="mt-4 h-40 w-full" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default MessagesSkeleton;
