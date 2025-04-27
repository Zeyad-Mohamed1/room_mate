"use client";

import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import {
  User,
  LogOut,
  UserCircle,
  DollarSign,
  FileText,
  Calendar,
  Heart,
  Bell,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserMenuProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  userNavItems?: {
    href: string;
    label: string;
    icon: React.ReactNode;
    tab: string;
  }[];
}

const UserMenu = ({
  onLoginClick,
  onRegisterClick,
  userNavItems = [],
}: UserMenuProps) => {
  const { data: session } = useSession();
  const { user, isAuthenticated } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-3">
        <Button
          onClick={onLoginClick}
          variant="outline"
          className="px-4 py-2 border-primary text-primary rounded-full hover:bg-gradient-subtle transition-colors font-medium text-sm"
        >
          Login
        </Button>
        <Button
          onClick={onRegisterClick}
          className="px-4 py-2 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm"
        >
          Register
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={toggleMenu}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <UserCircle className="w-8 h-8 text-gray-600" />
        )}
        <span className="font-medium text-sm hidden md:block">{user.name}</span>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Navigation Items */}
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block w-full text-left px-4 py-2 text-sm ${
                pathname === item.href
                  ? "text-primary bg-gray-50"
                  : "text-gray-700"
              } hover:bg-gray-100 transition-colors flex items-center`}
              onClick={() => setIsOpen(false)}
            >
              <span className="w-4 h-4 mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
