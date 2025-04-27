import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const offerId = params.id;

    // Get the offer with property info
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        property: true,
        user: true,
      },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Only the property owner can update offer status
    if (offer.property.ownerId !== user.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized - Only the property owner can update offer status",
        },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    // Validate status value
    const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update offer status
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status },
    });

    // If offer is accepted
    if (status === "accepted") {
      // 1. Reject all other offers for this property
      await prisma.offer.updateMany({
        where: {
          propertyId: offer.propertyId,
          id: { not: offerId },
          status: "pending",
        },
        data: { status: "rejected" },
      });

      // 2. Create notifications for all rejected offers
      const otherOffers = await prisma.offer.findMany({
        where: {
          propertyId: offer.propertyId,
          id: { not: offerId },
          status: "rejected",
        },
        include: {
          user: true,
          property: true,
        },
      });

      // Create notifications for rejected offers
      for (const rejectedOffer of otherOffers) {
        await prisma.notification.create({
          data: {
            title: "Offer Rejected",
            message: `Your offer on ${
              rejectedOffer.property.title || "a property"
            } has been rejected as another offer was accepted.`,
            userId: rejectedOffer.userId,
            adminId: user.id, // Property owner is the sender
          },
        });
      }

      // 3. Create notification for accepted offer user
      await prisma.notification.create({
        data: {
          title: "Offer Accepted!",
          message: `Your offer on ${
            offer.property.title || "a property"
          } has been accepted by the owner.`,
          userId: offer.userId,
          adminId: user.id, // Property owner is the sender
        },
      });

      // 4. Check if a booking already exists for this offer
      const existingBooking = await prisma.booking.findUnique({
        where: { offerId: offer.id },
      });

      // Only create a booking if one doesn't already exist
      if (!existingBooking) {
        // Create booking record
        await prisma.booking.create({
          data: {
            startDate: new Date(), // Set appropriate start date
            totalAmount: offer.price,
            status: "confirmed",
            userId: offer.userId,
            propertyId: offer.propertyId,
            offerId: offer.id,
          },
        });
      }
    }

    return NextResponse.json({
      message: `Offer ${status} successfully`,
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Error updating offer status:", error);
    return NextResponse.json(
      { error: "Failed to update offer status" },
      { status: 500 }
    );
  }
}
