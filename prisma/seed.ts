import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Admin",
    email: "admin@room-mate.com",
    password: bcrypt.hashSync("admin123", 10),
    phone: "+1234567890",
    isAdmin: true,
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
