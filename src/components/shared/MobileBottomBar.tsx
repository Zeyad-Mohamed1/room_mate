"use client";
import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Bell,
  Heart,
  FileText,
  DollarSign,
} from "lucide-react";
import AddPropertyModal from "./AddPropertyModal";
import { useUserStore } from "@/store/useUserStore";
import { create } from "zustand";
import { usePathname, useRouter } from "next/navigation";

// Create a shared store for tab state between Header and MobileBottomBar
interface TabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: "my-ads",
  setActiveTab: (tab: string) => set({ activeTab: tab }),
}));

const MobileBottomBar = () => {
  const { isAuthenticated } = useUserStore();
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const activeTab = useTabStore((state) => state.activeTab);
  const setActiveTab = useTabStore((state) => state.setActiveTab);
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolling down
      if (currentScrollY > lastScrollY.current + 10) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Show when scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set a timeout to show the bar after scrolling stops
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Check if current path is admin dashboard
  const isAdminDashboard = pathname?.includes("/dashboard");

  // If not authenticated or in admin dashboard, don't render the bottom bar
  if (!isAuthenticated || isAdminDashboard) {
    return null;
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === "my-ads") {
      router.push("/my-ads");
    } else if (tab === "my-offers") {
      router.push("/my-offers");
    } else if (tab === "notifications") {
      router.push("/notifications");
    } else if (tab === "favorites") {
      router.push("/favorites");
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex justify-around items-center h-16 px-1">
          <button
            onClick={() => handleTabClick("my-ads")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${activeTab === "my-ads"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <FileText
              className={`h-5 w-5 ${activeTab === "my-ads" ? "stroke-[2.5px]" : ""
                }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${activeTab === "my-ads" ? "text-primary" : "text-gray-500"
                }`}
            >
              My Ads
            </span>
            {activeTab === "my-ads" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleTabClick("my-offers")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${activeTab === "my-offers"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <DollarSign
              className={`h-5 w-5 ${activeTab === "my-offers" ? "stroke-[2.5px]" : ""
                }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${activeTab === "my-offers" ? "text-primary" : "text-gray-500"
                }`}
            >
              Offers
            </span>
            {activeTab === "my-offers" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>

          {/* Add Property Button */}
          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 text-primary"
          >
            <div className="bg-primary text-white rounded-full p-3">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1 font-medium text-primary">
              Add
            </span>
          </button>

          <button
            onClick={() => handleTabClick("notifications")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${activeTab === "notifications"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <div className="relative">
              <Bell
                className={`h-5 w-5 ${activeTab === "notifications" ? "stroke-[2.5px]" : ""
                  }`}
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span
              className={`text-xs mt-1 font-medium ${activeTab === "notifications" ? "text-primary" : "text-gray-500"
                }`}
            >
              Alerts
            </span>
            {activeTab === "notifications" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleTabClick("favorites")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${activeTab === "favorites"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Heart
              className={`h-5 w-5 ${activeTab === "favorites" ? "stroke-[2.5px]" : ""
                }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${activeTab === "favorites" ? "text-primary" : "text-gray-500"
                }`}
            >
              Favorites
            </span>
            {activeTab === "favorites" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Add Property Modal */}
      {isAddPropertyModalOpen && (
        <AddPropertyModal onClose={() => setIsAddPropertyModalOpen(false)} />
      )}
    </>
  );
};

export default MobileBottomBar;
