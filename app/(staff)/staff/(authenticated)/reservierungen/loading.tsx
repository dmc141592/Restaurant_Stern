import { Skeleton } from "@/components/ui/skeleton";

export default function ReservierungenLoading() {
  return (
    <div className="p-4 lg:p-8">
      <Skeleton className="h-16 w-full" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
