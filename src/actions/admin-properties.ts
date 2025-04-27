"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

/**
 * Get all properties with owner information
 * Only accessible by admins
 */
export const getAllProperties = async () => {
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

  // Fetch all properties
  const properties = await prisma.property.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
      favorites: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          offers: true,
          bookings: true,
          favorites: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

/**
 * Delete a property by ID
 * Only accessible by admins
 */
export const deleteProperty = async (propertyId: string) => {
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
    // Delete the property
    // First delete related records to maintain referential integrity
    // Delete all ratings associated with bookings for this property
    await prisma.rating.deleteMany({
      where: {
        propertyId: propertyId,
      },
    });

    // Delete all bookings for this property
    await prisma.booking.deleteMany({
      where: {
        propertyId: propertyId,
      },
    });

    // Delete all offers for this property
    await prisma.offer.deleteMany({
      where: {
        propertyId: propertyId,
      },
    });

    // Finally, delete the property
    await prisma.property.delete({
      where: {
        id: propertyId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: "Failed to delete property" };
  }
};
