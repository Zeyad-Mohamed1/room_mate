"use client";

import { useEffect, useState } from "react";
import { Users, Building, MessageSquare, Activity } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalMessages: 0,
    activeUsers: 0,
  });

  // Placeholder for fetching dashboard stats
  useEffect(() => {
    // In a real app, fetch this data from an API
    setStats({
      totalUsers: 125,
      totalProperties: 78,
      totalMessages: 320,
      activeUsers: 42,
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Welcome to the admin dashboard" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Properties"
          value={stats.totalProperties}
          icon={<Building className="h-6 w-6 text-green-500" />}
          color="bg-green-50"
        />
        <StatCard
          title="Messages"
          value={stats.totalMessages}
          icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Activity className="h-6 w-6 text-orange-500" />}
          color="bg-orange-50"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            action="New user registered"
            user="John Doe"
            time="10 minutes ago"
          />
          <ActivityItem
            action="New property listed"
            user="Sarah Johnson"
            time="45 minutes ago"
          />
          <ActivityItem
            action="Property updated"
            user="Mike Smith"
            time="1 hour ago"
          />
          <ActivityItem
            action="Message sent"
            user="Emily Wilson"
            time="2 hours ago"
          />
          <ActivityItem
            action="Account settings updated"
            user="David Brown"
            time="3 hours ago"
          />
        </div>
      </div>
    </div>
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

// Activity Item Component
interface ActivityItemProps {
  action: string;
  user: string;
  time: string;
}

const ActivityItem = ({ action, user, time }: ActivityItemProps) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div>
      <p className="font-medium">{action}</p>
      <p className="text-sm text-gray-500">by {user}</p>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

export default DashboardPage;
