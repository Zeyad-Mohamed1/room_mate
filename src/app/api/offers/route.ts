import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

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

    const { propertyId, message, price, phone, duration, deposit } =
      await request.json();

    // Validate request body
    if (!propertyId || !message || !price) {
      return NextResponse.json(
        { error: "Property ID, message, and price are required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Get the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user is not the owner of the property
    if (property.ownerId === user.id) {
      return NextResponse.json(
        { error: "You cannot make an offer on your own property" },
        { status: 403 }
      );
    }

    // Check if user already has a pending offer for this property
    const existingOffer = await prisma.offer.findFirst({
      where: {
        AND: [{ userId: user.id }, { propertyId }, { status: "pending" }],
      },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: "You already have a pending offer for this property" },
        { status: 400 }
      );
    }

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        message,
        price,
        phone,
        duration,
        deposit: deposit || false,
        userId: user.id,
        propertyId,
      },
    });

    return NextResponse.json(
      { message: "Offer submitted successfully", offer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting offer:", error);
    return NextResponse.json(
      { error: "Failed to submit offer" },
      { status: 500 }
    );
  }
}
