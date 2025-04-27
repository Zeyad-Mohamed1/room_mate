"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

/**
 * Gets all notifications sent by the admin
 * @returns Array of notifications with user data
 */
export const getAllNotifications = async () => {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { error: "Unauthorized" };
  }

  // Get the admin user
  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!admin || !admin.isAdmin) {
    return { error: "Unauthorized - Admin access required" };
  }

  // Fetch all notifications sent by this admin
  const notifications = await prisma.notification.findMany({
    where: {
      adminId: admin.id,
    },
    include: {
      user: {
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
 * Sends a notification to one or more users
 * @param data Object containing title, message, and userIds
 * @returns Success status and notifications sent
 */
export const sendNotification = async (data: {
  title: string;
  message: string;
  userIds: string[];
}) => {
  const { title, message, userIds } = data;
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  // Get the admin user
  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!admin || !admin.isAdmin) {
    return { success: false, error: "Unauthorized - Admin access required" };
  }

  try {
    // Create notifications for each user
    const notifications = await Promise.all(
      userIds.map(async (userId) => {
        return prisma.notification.create({
          data: {
            title,
            message,
            userId,
            adminId: admin.id,
          },
        });
      })
    );

    return { success: true, notifications };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, error: "Failed to send notifications" };
  }
};

/**
 * Deletes a notification
 * @param notificationId ID of the notification to delete
 * @returns Success status
 */
export const deleteNotification = async (notificationId: string) => {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  // Get the admin user
  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!admin || !admin.isAdmin) {
    return { success: false, error: "Unauthorized - Admin access required" };
  }

  try {
    // Find the notification first
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    // Check if the notification was sent by this admin
    if (notification.adminId !== admin.id) {
      return {
        success: false,
        error: "Unauthorized - You can only delete your own notifications",
      };
    }

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
};
