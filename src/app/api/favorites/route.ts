import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
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

    // Check if property is already in favorites
    const userFavorites = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          where: { id: propertyId },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFavorite = (userFavorites?.favorites ?? []).length > 0;

    // Toggle favorite status
    if (isFavorite) {
      // Remove from favorites
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: {
              id: propertyId,
            },
          },
        },
      });
      return NextResponse.json({ isFavorite: false });
    } else {
      // Add to favorites
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: {
              id: propertyId,
            },
          },
        },
      });
      return NextResponse.json({ isFavorite: true });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
      include: {
        favorites: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}
