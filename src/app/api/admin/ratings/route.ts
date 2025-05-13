import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// POST: Admin endpoint to add/update property ratings without requiring a booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user and verify admin status
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse the request body
    const { propertyId, score, comment } = await request.json();

    if (!propertyId || !score) {
      return NextResponse.json(
        { error: "Property ID and score are required" },
        { status: 400 }
      );
    }

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: "Score must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Create a "dummy" booking for admin ratings if needed
    let adminBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        userId: user.id,
        status: "completed",
        // Identify admin-created bookings with a special pattern
        totalAmount: "ADMIN_RATING",
      },
      include: {
        rating: true,
      },
    });

    // If no admin booking exists for this property, create one
    if (!adminBooking) {
      // First create an offer (required by the booking schema)
      const adminOffer = await prisma.offer.create({
        data: {
          message: "Admin rating",
          price: "0",
          phone: user.phone || "",
          status: "accepted",
          propertyId,
          userId: user.id,
        },
      });

      // Then create a booking
      adminBooking = await prisma.booking.create({
        data: {
          startDate: new Date(),
          endDate: new Date(),
          totalAmount: "ADMIN_RATING", // Special marker for admin ratings
          status: "completed",
          propertyId,
          userId: user.id,
          offerId: adminOffer.id,
        },
        include: {
          rating: true,
        },
      });
    }

    // Create or update the rating
    let rating;

    if (adminBooking.rating) {
      // Update existing rating
      rating = await prisma.rating.update({
        where: { id: adminBooking.rating.id },
        data: {
          score,
          comment,
        },
      });
    } else {
      // Create new rating
      rating = await prisma.rating.create({
        data: {
          score,
          comment,
          userId: user.id,
          propertyId,
          bookingId: adminBooking.id,
        },
      });
    }

    // Update the property's average rating
    const propertyRatings = await prisma.rating.findMany({
      where: {
        propertyId,
      },
    });

    const totalRatings = propertyRatings.length;
    const ratingSum = propertyRatings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;

    // Update the property with the new average rating
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        rating: averageRating,
        totalRatings: totalRatings,
      },
    });

    // Notify the property owner about the admin rating
    await prisma.notification.create({
      data: {
        title: "New Admin Rating",
        message: `An administrator has added a ${score}-star rating to your property "${
          property.title || "your property"
        }".`,
        userId: property.ownerId,
        adminId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      rating,
      propertyRating: averageRating,
    });
  } catch (error) {
    console.error("Error creating admin rating:", error);
    return NextResponse.json(
      { error: "Failed to add rating" },
      { status: 500 }
    );
  }
}
