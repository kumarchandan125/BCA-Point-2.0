import Skeleton from "./Skeleton";

export default function SavedNoteSkeleton() {
  return (
    <div className="min-w-[220px] rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-3">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
