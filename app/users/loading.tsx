import Skeleton from "@/app/components/Skeleton";
import UsersLoader from "./users-loader";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Users</h1>
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-full max-w-sm" />
      </div>

      <UsersLoader />
    </div>
  );
}
