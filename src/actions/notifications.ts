"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

/**
 * Gets all notifications for the current user
 * @returns Array of notifications
 */
export const getUserNotifications = async () => {
  const session = await getServerSession();

  // Redirect to login if user is not authenticated
  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Get the current user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  // Fetch notifications for the user
  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
};

/**
 * Marks a notification as read
 * @param notificationId The ID of the notification to mark as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    // Find the notification
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    // Check if the notification belongs to the user
    if (notification.userId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Mark the notification as read
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
};

/**
 * Marks all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async () => {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  try {
    // Mark all notifications as read
    await prisma.notification.updateMany({
      where: { userId: user.id },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
};

/**
 * Get the count of unread notifications for the current user
 * @returns The count of unread notifications
 */
export const getUnreadNotificationsCount = async () => {
  const session = await getServerSession();

  // Return 0 if user is not authenticated
  if (!session || !session.user?.email) {
    return 0;
  }

  // Get the current user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return 0;
  }

  // Count unread notifications
  const count = await prisma.notification.count({
    where: {
      userId: user.id,
      read: false,
    },
  });

  return count;
};
