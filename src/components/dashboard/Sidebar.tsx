"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HomeIcon,
  Tags,
} from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/users",
    },
    {
      name: "Properties",
      icon: <Building className="w-5 h-5" />,
      href: "/dashboard/properties",
    },
    {
      name: "Categories",
      icon: <Tags className="w-5 h-5" />,
      href: "/dashboard/categories",
    },
    {
      name: "Messages",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/dashboard/messages",
    },
    {
      name: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/dashboard/notifications",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen sticky top-0 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed ? (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">
              RF
            </div>
            <span className="text-lg font-bold text-gradient">Admin</span>
          </Link>
        ) : (
          <Link href="/" className="flex justify-center w-full">
            <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">
              RF
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-primary p-1 rounded focus:outline-none"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "bg-gradient-subtle text-primary"
                  : "text-gray-600 hover:bg-gray-100"
              } flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <div className={collapsed ? "" : "mr-3"}>{item.icon}</div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 mb-3"
        >
          <HomeIcon className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Back to Home</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`${
            collapsed ? "justify-center" : "justify-start"
          } flex items-center w-full text-gray-600 hover:text-red-500 transition-colors duration-200`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
