"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Trash, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function NotificationsContent() {
  const queryClient = useQueryClient();
  const [expandedNotifications, setExpandedNotifications] = useState<string[]>(
    []
  );

  // Query to fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getUserNotifications,
  });

  // Mutation to mark a notification as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read");
    },
  });

  // Mutation to mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      toast.error("Failed to mark all notifications as read");
    },
  });

  // Handle marking a notification as read
  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Toggle expanded state for a notification
  const toggleExpanded = (notificationId: string) => {
    setExpandedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Check if notification is expanded
  const isExpanded = (notificationId: string) => {
    return expandedNotifications.includes(notificationId);
  };

  const getNotificationColor = (notification: Notification) => {
    // Define color schemes based on notification title
    if (notification.title.includes("Accepted"))
      return "bg-green-50 border-green-200";
    if (notification.title.includes("Rejected"))
      return "bg-red-50 border-red-200";
    if (
      notification.title.includes("cancelled") ||
      notification.title.includes("Cancelled")
    )
      return "bg-orange-50 border-orange-200";
    if (
      notification.title.includes("confirmed") ||
      notification.title.includes("Confirmed")
    )
      return "bg-blue-50 border-blue-200";
    if (
      notification.title.includes("completed") ||
      notification.title.includes("Completed")
    )
      return "bg-purple-50 border-purple-200";

    // Default color
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div>
      {/* Header with notification count and mark all read button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          You have{" "}
          <span className="font-medium">
            {notifications?.filter((n) => !n.read).length || 0}
          </span>{" "}
          unread notifications
        </p>

        {notifications && notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            {markAllAsReadMutation.isPending ? (
              "Marking..."
            ) : (
              <>
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </>
            )}
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-all ${getNotificationColor(
                notification
              )} ${notification.read ? "opacity-75" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Bell className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </h3>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <p
                    className={`text-gray-700 mt-1 ${
                      isExpanded(notification.id)
                        ? "line-clamp-none"
                        : "line-clamp-2"
                    }`}
                  >
                    {notification.message}
                  </p>

                  {notification.message.length > 120 && (
                    <button
                      onClick={() => toggleExpanded(notification.id)}
                      className="text-xs text-primary mt-1 hover:underline"
                    >
                      {isExpanded(notification.id) ? "Show less" : "Show more"}
                    </button>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2 py-1 text-primary hover:text-primary/80"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark as read
                      </Button>
                    )}
                    <span className="text-xs text-gray-500">
                      From: {notification.admin?.name || "System"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-500">
            No notifications
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            You don't have any notifications yet
          </p>
        </div>
      )}
    </div>
  );
}
