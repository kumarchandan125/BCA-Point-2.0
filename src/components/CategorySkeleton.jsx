import Skeleton from "./Skeleton";

export default function CategorySkeleton() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
