"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Plus, Bell, Heart, FileText } from "lucide-react";
import AddPropertyModal from "./AddPropertyModal";
import { useUserStore } from "@/store/useUserStore";
import { create } from "zustand";

// Create a shared store for tab state between Header and MobileBottomBar
interface TabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: "chat",
  setActiveTab: (tab: string) => set({ activeTab: tab }),
}));

const MobileBottomBar = () => {
  const { isAuthenticated } = useUserStore();
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const activeTab = useTabStore((state) => state.activeTab);
  const setActiveTab = useTabStore((state) => state.setActiveTab);

  // If not authenticated, don't render the bottom bar
  if (!isAuthenticated) {
    return null;
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    // Open Add Property modal when the add property tab is clicked
    if (tab === "add-property") {
      setIsAddPropertyModalOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-16 px-1">
          <button
            onClick={() => handleTabClick("chat")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
              activeTab === "chat"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare
              className={`h-5 w-5 ${
                activeTab === "chat" ? "stroke-[2.5px]" : ""
              }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${
                activeTab === "chat" ? "text-primary" : "text-gray-500"
              }`}
            >
              Chat
            </span>
            {activeTab === "chat" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleTabClick("my-ads")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
              activeTab === "my-ads"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText
              className={`h-5 w-5 ${
                activeTab === "my-ads" ? "stroke-[2.5px]" : ""
              }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${
                activeTab === "my-ads" ? "text-primary" : "text-gray-500"
              }`}
            >
              My Ads
            </span>
            {activeTab === "my-ads" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleTabClick("add-property")}
            className="flex flex-col items-center justify-center w-full h-full relative -mt-2"
          >
            <div className="bg-gradient rounded-full p-3 shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 font-medium text-primary">Add</span>
          </button>

          <button
            onClick={() => handleTabClick("notifications")}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
              activeTab === "notifications"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="relative">
              <Bell
                className={`h-5 w-5 ${
                  activeTab === "notifications" ? "stroke-[2.5px]" : ""
                }`}
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                activeTab === "notifications" ? "text-primary" : "text-gray-500"
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
            className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
              activeTab === "favorites"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                activeTab === "favorites" ? "stroke-[2.5px]" : ""
              }`}
            />
            <span
              className={`text-xs mt-1 font-medium ${
                activeTab === "favorites" ? "text-primary" : "text-gray-500"
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
