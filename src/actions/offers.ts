"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

/**
 * Gets all offers submitted by the current user
 * @returns Array of offers with property data
 */
export const getMySubmittedOffers = async () => {
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

  // Fetch offers submitted by the user
  const userOffers = await prisma.offer.findMany({
    where: {
      userId: user.id,
    },
    include: {
      property: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userOffers;
};
