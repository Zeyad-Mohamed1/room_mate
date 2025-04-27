"use server";

import prisma from "@/lib/prisma";

export async function getAllProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        latitude: {
          not: null,
        },
        longitude: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        images: true,
        address: true,
        price: true,
        size: true,
        bathrooms: true,
        totalRooms: true,
        latitude: true,
        longitude: true,
        type: true,
      },
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
