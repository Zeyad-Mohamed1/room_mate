import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a property" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    // Extract property data from request body
    const {
      title,
      type,
      roomType,
      city,
      price,
      rentTime,
      paymentTime,
      totalRooms,
      availableRooms,
      size,
      floor,
      bathrooms,
      separatedBathroom,
      residentsCount,
      availablePersons,
      priceIncludeWaterAndElectricity,
      includeFurniture,
      airConditioning,
      includeWaterHeater,
      parking,
      internet,
      nearToMetro,
      nearToMarket,
      elevator,
      trialPeriod,
      goodForForeigners,
      termsAndConditions,
      images,
      categoryId,
    } = body;

    // Basic validation
    if (!title || !city || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a slug from the title
    const slug =
      title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString().slice(-6);

    // Create the property
    const property = await prisma.property.create({
      data: {
        title,
        slug,
        type: type || "house",
        roomType: roomType || "single",
        city,
        price,
        rentTime: rentTime || "monthly",
        paymentTime: paymentTime || "monthly",
        totalRooms,
        availableRooms,
        size,
        floor,
        bathrooms,
        separatedBathroom: separatedBathroom || false,
        residentsCount,
        availablePersons,
        priceIncludeWaterAndElectricity:
          priceIncludeWaterAndElectricity || false,
        includeFurniture: includeFurniture || false,
        airConditioning: airConditioning || false,
        includeWaterHeater: includeWaterHeater || false,
        parking: parking || false,
        internet: internet || false,
        nearToMetro: nearToMetro || false,
        nearToMarket: nearToMarket || false,
        elevator: elevator || false,
        trialPeriod: trialPeriod || false,
        goodForForeigners: goodForForeigners || false,
        termsAndConditions,
        images: images || [],
        owner: {
          connect: { id: userId },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    });

    return NextResponse.json(
      { message: "Property created successfully", property },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
