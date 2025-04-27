import { useQuery } from "@tanstack/react-query";
import {
  getUserNotifications,
  getUnreadNotificationsCount,
} from "@/actions/notifications";

export const useUnreadNotifications = () => {
  // Query to get all notifications
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getUserNotifications,
  });

  // Query to get only the count of unread notifications (more efficient)
  const { data: unreadCount = 0, isLoading: isLoadingCount } = useQuery({
    queryKey: ["unreadNotificationsCount"],
    queryFn: getUnreadNotificationsCount,
  });

  const hasUnread = unreadCount > 0;
  const isLoading = isLoadingNotifications || isLoadingCount;

  return {
    unreadCount,
    hasUnread,
    isLoading,
    notifications,
  };
};
