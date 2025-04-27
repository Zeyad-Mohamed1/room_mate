"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalOffers: number;
  totalBookings: number;
}

/**
 * Get dashboard statistics
 * Only accessible by admins
 */
export const getDashboardStats = async (): Promise<
  DashboardStats | { error: string }
> => {
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

  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total properties
    const totalProperties = await prisma.property.count();

    // Get total offers
    const totalOffers = await prisma.offer.count();

    // Get total bookings
    const totalBookings = await prisma.booking.count();

    return {
      totalUsers,
      totalProperties,
      totalOffers,
      totalBookings,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { error: "Failed to fetch dashboard statistics" };
  }
};
