"use server";

import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getProperties = async () => {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      city: true,
      type: true,
      roomType: true,
      images: true,
      bathrooms: true,
      residentsCount: true,
      availablePersons: true,
      goodForForeigners: true,
      country: true,
      genderRequired: true,
      slug: true,
      paymentTime: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties as Property[];
};

export const getMyProperties = async () => {
  const session = await getServerSession();

  // Redirect to login if user is not authenticated
  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Get the current user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  // Fetch user's properties with related offers
  const userProperties = await prisma.property.findMany({
    where: {
      ownerId: user?.id,
    },
    include: {
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
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userProperties;
};

export const deleteProperty = async (propertyId: string) => {
  const property = await axios.delete(`/api/properties/${propertyId}`);

  return property;
};

export const getFavorites = async () => {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email || "" },
    include: {
      favorites: {
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  console.log(user.favorites);

  return user.favorites;
};

export async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        slug,
      },
      include: {
        owner: true,
        offers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return property;
  } catch (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
}

export async function getSuggestedProperties(
  propertyId: string,
  limit: number = 4
) {
  try {
    // Get the current property to use its attributes for suggesting similar ones
    const currentProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { city: true, type: true, roomType: true },
    });

    if (!currentProperty) return [];

    // Find properties in the same city or with same type/roomType, excluding the current one
    const suggestedProperties = await prisma.property.findMany({
      where: {
        id: { not: propertyId },
        OR: [
          { city: currentProperty.city },
          {
            AND: [
              { type: currentProperty.type },
              { roomType: currentProperty.roomType },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return suggestedProperties;
  } catch (error) {
    console.error("Error fetching suggested properties:", error);
    return [];
  }
}
