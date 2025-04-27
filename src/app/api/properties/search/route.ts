import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // Perform search on properties
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        price: true,
        city: true,
        slug: true,
        images: true,
      },
      take: 10, // Limit results to 10
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    return NextResponse.json(
      { error: "Failed to search properties" },
      { status: 500 }
    );
  }
}
