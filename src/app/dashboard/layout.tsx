"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAdmin } from "@/utils/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building,
  Bell,
  LogOut,
  HomeIcon,
  Tags,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";

const SidebarComponents = () => {
  const { state, toggleSidebar } = useSidebar();
  const isExpanded = state === "expanded";
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const menuItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/users",
      icon: <Users className="h-4 w-4" />,
      label: "Users",
    },
    {
      href: "/dashboard/categories",
      icon: <Tags className="h-4 w-4" />,
      label: "Categories",
    },
    {
      href: "/dashboard/properties",
      icon: <Building className="h-4 w-4" />,
      label: "Properties",
    },
    {
      href: "/dashboard/notifications",
      icon: <Bell className="h-4 w-4" />,
      label: "Notifications",
    },
  ];

  const renderNavLink = (item: {
    href: string;
    icon: React.ReactNode;
    label: string;
  }) => {
    const isActive = pathname === item.href;

    return (
      <SidebarMenuItem key={item.href}>
        <Link
          href={item.href}
          className={`flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-gradient-subtle text-primary"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div
            className={`flex ${isExpanded ? "mr-3" : "w-full justify-center"}`}
          >
            {item.icon}
          </div>
          {isExpanded && <span>{item.label}</span>}
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <SidebarHeader className="flex h-16 items-center justify-center relative border-b px-4">
        {isExpanded && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">
              RF
            </div>
            <span className="text-lg font-bold text-gradient">Admin</span>
          </Link>
        )}

        {/* Mobile sidebar trigger - placed at the right side */}
        <div className="absolute right-4 md:hidden">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>

        {/* Custom sidebar toggle - positioned at the right */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center p-1.5 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors absolute right-1 top-4 lg:flex"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems.map(renderNavLink)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200"
          >
            <HomeIcon className="h-4 w-4 mr-3" />
            {isExpanded && <span>Back to Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-600 hover:text-red-500 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-3" />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </SidebarFooter>
    </>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarComponents />
        </Sidebar>
        <main className="flex-1 p-6 overflow-y-auto w-full">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
