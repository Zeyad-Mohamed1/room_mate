import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// POST: Create a new rating or update an existing one
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body
    const { bookingId, score, comment } = await request.json();

    if (!bookingId || !score) {
      return NextResponse.json(
        { error: "Booking ID and score are required" },
        { status: 400 }
      );
    }

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: "Score must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get the booking with property info
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        rating: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify that the booking belongs to the user
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only rate your own bookings" },
        { status: 403 }
      );
    }

    // Check if booking is confirmed (can only rate confirmed bookings)
    if (booking.status !== "confirmed" && booking.status !== "completed") {
      return NextResponse.json(
        { error: "You can only rate confirmed or completed bookings" },
        { status: 400 }
      );
    }

    // Create or update the rating
    let rating;
    let isNew = false;

    if (booking.rating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: { id: booking.rating.id },
        data: {
          score,
          comment,
        },
      });
    } else {
      // Create new rating
      isNew = true;
      rating = await prisma.rating.create({
        data: {
          score,
          comment,
          userId: user.id,
          propertyId: booking.propertyId,
          bookingId: booking.id,
        },
      });
    }

    // Update the property's average rating
    const propertyRatings = await prisma.rating.findMany({
      where: {
        propertyId: booking.propertyId,
      },
    });

    const totalRatings = propertyRatings.length;
    const ratingSum = propertyRatings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;

    // Update the property with the new average rating
    await prisma.property.update({
      where: { id: booking.propertyId },
      data: {
        rating: averageRating,
        totalRatings: totalRatings,
      },
    });

    // If this is a completed booking and it's the first rating, update the booking status
    if (booking.status === "confirmed" && isNew) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "completed" },
      });

      // Notify the property owner about the new rating
      await prisma.notification.create({
        data: {
          title: "New Property Rating",
          message: `Your property "${
            booking.property.title || "the property"
          }" has received a new ${score}-star rating.`,
          userId: booking.property.ownerId,
          adminId: user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      rating,
      propertyRating: averageRating,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}
