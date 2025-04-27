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

    // Get the offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Check if the user is the one who made the offer
    if (offer.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - Only the offer creator can cancel it" },
        { status: 403 }
      );
    }

    // Check if the offer is pending (can only cancel pending offers)
    if (offer.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending offers can be cancelled" },
        { status: 400 }
      );
    }

    // Update offer status to cancelled
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status: "cancelled" },
    });

    return NextResponse.json({
      message: "Offer cancelled successfully",
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Error cancelling offer:", error);
    return NextResponse.json(
      { error: "Failed to cancel offer" },
      { status: 500 }
    );
  }
}
