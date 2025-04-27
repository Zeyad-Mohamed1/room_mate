"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building,
  BadgeDollarSign,
  CalendarRange,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { getDashboardStats, DashboardStats } from "@/actions/admin-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const DashboardPage = () => {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  // Helper function to check if stats has real data or an error
  const hasError = isError || (stats && "error" in stats);
  const statsData = !hasError && stats ? (stats as DashboardStats) : null;

  // Show error if there was an error fetching stats
  if (hasError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome to the admin dashboard"
        />
        <Card className="border-red-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-red-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Dashboard Data
            </CardTitle>
            <CardDescription>
              There was an error loading the dashboard data. This might be due
              to a server issue or insufficient permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      }
    >
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome to the admin dashboard"
        />

        {/* Stats Overview */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse h-32 rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={statsData?.totalUsers || 0}
              icon={<Users className="h-6 w-6 text-blue-500" />}
              color="bg-blue-50"
            />
            <StatCard
              title="Properties"
              value={statsData?.totalProperties || 0}
              icon={<Building className="h-6 w-6 text-green-500" />}
              color="bg-green-50"
            />
            <StatCard
              title="Offers"
              value={statsData?.totalOffers || 0}
              icon={<BadgeDollarSign className="h-6 w-6 text-purple-500" />}
              color="bg-purple-50"
            />
            <StatCard
              title="Bookings"
              value={statsData?.totalBookings || 0}
              icon={<CalendarRange className="h-6 w-6 text-orange-500" />}
              color="bg-orange-50"
            />
          </div>
        )}
      </div>
    </Suspense>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className={`rounded-lg shadow p-6 ${color} border border-gray-100`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-white shadow-sm">{icon}</div>
    </div>
  </div>
);

export default DashboardPage;
