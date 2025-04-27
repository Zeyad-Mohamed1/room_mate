import { Suspense } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import UserTableWrapper from "./components/UserTableWrapper";

export default function UsersPage() {
  return (
    <Suspense fallback={<UserTableSkeleton />}>
      <div className="space-y-6">
        <PageHeader title="Users Management" />

        <Suspense fallback={<UserTableSkeleton />}>
          <UserTableWrapper />
        </Suspense>
      </div>
    </Suspense>
  );
}

function UserTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex gap-4 border-b pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
