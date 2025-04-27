"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

/**
 * Gets all bookings for the current user
 * @returns Array of bookings with property and offer data
 */
export const getUserBookings = async () => {
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

  // Fetch bookings for the user
  const bookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
    },
    include: {
      property: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
      offer: true,
      rating: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

/**
 * Gets all bookings for properties owned by the current user
 * @returns Array of bookings with property and user data
 */
export const getPropertyOwnerBookings = async () => {
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

  // Fetch bookings for properties owned by the user
  const bookings = await prisma.booking.findMany({
    where: {
      property: {
        ownerId: user.id,
      },
    },
    include: {
      property: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      offer: true,
      rating: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

/**
 * Updates the status of a booking
 * @param bookingId The ID of the booking to update
 * @param status The new status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
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
    // Find the booking with property info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        user: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // Only the property owner or the booking user can update the booking status
    if (booking.property.ownerId !== user.id && booking.userId !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Create a notification for the other party
    const notificationUserId =
      user.id === booking.property.ownerId
        ? booking.userId // Notify the renter
        : booking.property.ownerId; // Notify the owner

    await prisma.notification.create({
      data: {
        title: `Booking ${status}`,
        message: `Your booking for "${
          booking.property.title || "the property"
        }" has been ${status.toLowerCase()}.`,
        userId: notificationUserId,
        adminId: user.id,
      },
    });

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Failed to update booking status" };
  }
};
