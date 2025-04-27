"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

/**
 * Gets all users (admin only)
 * @returns Array of users with basic info
 */
export const getUsers = async () => {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return [];
  }

  // Get the admin user
  const admin = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!admin || !admin.isAdmin) {
    return [];
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isAdmin: true,
      createdAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
};
