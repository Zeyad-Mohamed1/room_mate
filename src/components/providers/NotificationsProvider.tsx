"use client";

import { ReactNode, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationsCount } from "@/actions/notifications";
import { useUserStore } from "@/store/useUserStore";

interface NotificationsContextType {
  unreadCount: number;
  hasUnread: boolean;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | null>(
  null
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated } = useUserStore();

  // Always call the hook, but disable it when user is not authenticated
  const { data: unreadCount = 0, isLoading } = useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: getUnreadNotificationsCount,
    // Refresh every minute and when window gets focus
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    // Disable the query when user is not authenticated
    enabled: isAuthenticated,
  });

  const hasUnread = unreadCount > 0;

  return (
    <NotificationsContext.Provider
      value={{ unreadCount, hasUnread, isLoading }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
