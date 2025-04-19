"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { useIsAdmin } from "@/utils/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  // Redirect non-admin users away from the dashboard
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
