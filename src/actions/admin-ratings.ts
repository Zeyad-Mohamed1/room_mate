"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

interface AdminRatingProps {
  propertyId: string;
  score: number;
  comment?: string;
}

/**
 * Add or update a property rating as an admin
 * @param data Rating data including propertyId, score and optional comment
 * @returns Object with success status and possible error
 */
export const addAdminRating = async (data: AdminRatingProps) => {
  const { propertyId, score, comment } = data;

  try {
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

    // Validate score
    if (score < 1 || score > 5) {
      return { success: false, error: "Score must be between 1 and 5" };
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return { success: false, error: "Property not found" };
    }

    // Check if admin has already rated this property
    const existingAdminRating = await prisma.adminRating.findFirst({
      where: {
        propertyId,
        adminId: admin.id,
      },
    });

    // Create or update admin rating
    if (existingAdminRating) {
      // Update existing admin rating
      await prisma.adminRating.update({
        where: { id: existingAdminRating.id },
        data: {
          score,
          comment,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new admin rating
      await prisma.adminRating.create({
        data: {
          score,
          comment,
          adminId: admin.id,
          propertyId,
        },
      });

      // Update property to indicate it has an admin rating
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          hasAdminRating: true,
        },
      });
    }

    // Calculate and update the property's admin rating
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        adminRating: score,
      },
    });

    // Notify the property owner about the admin rating
    await prisma.notification.create({
      data: {
        title: "New Admin Rating",
        message: `An administrator has ${
          existingAdminRating ? "updated" : "added"
        } a ${score}-star rating to your property "${
          property.title || "your property"
        }".`,
        userId: property.ownerId,
        adminId: admin.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating admin rating:", error);
    return { success: false, error: "Failed to add rating" };
  }
};
