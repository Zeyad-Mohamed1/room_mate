import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET: Get a single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        offers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PUT: Update a property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to update a property" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the property to check ownership
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user owns the property or is admin
    if (property.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to update this property" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const slug =
      body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString().slice(-6);

    // Update the property with the new data
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        slug: slug,
        roomType: body.roomType,
        city: body.city,
        country: body.country,
        address: body.address,
        description: body.description,
        price: body.price,
        rentTime: body.rentTime,
        paymentTime: body.paymentTime,
        totalRooms: body.totalRooms,
        availableRooms: body.availableRooms,
        roomsToComplete: body.roomsToComplete,
        size: body.size,
        floor: body.floor,
        bathrooms: body.bathrooms,
        separatedBathroom: body.separatedBathroom,
        residentsCount: body.residentsCount,
        availablePersons: body.availablePersons,
        genderRequired: body.gender,
        priceIncludeWaterAndElectricity: body.priceIncludeWaterAndElectricity,
        includeFurniture: body.includeFurniture,
        airConditioning: body.airConditioning,
        includeWaterHeater: body.includeWaterHeater,
        parking: body.parking,
        internet: body.internet,
        nearToMetro: body.nearToMetro,
        nearToMarket: body.nearToMarket,
        elevator: body.elevator,
        trialPeriod: body.trialPeriod,
        goodForForeigners: body.goodForForeigners,
        allowSmoking: body.allowSmoking,
        termsAndConditions: body.termsAndConditions,
        images: body.images,
        latitude: body.latitude,
        longitude: body.longitude,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to delete a property" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the property to check ownership
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        offers: true,
        bookings: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user owns the property or is admin
    if (property.ownerId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to delete this property" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      if (property.bookings.length > 0) {
        await prisma.booking.deleteMany({
          where: { propertyId: id },
        });
      }

      // Delete related offers
      if (property.offers.length > 0) {
        await prisma.offer.deleteMany({
          where: { propertyId: id },
        });
      }

      // Delete property
      await prisma.property.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
