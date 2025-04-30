import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ user: null });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        nationality: true,
        occupation: true,
        smoker: true,
        isAdmin: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    // Transform database user to match User interface
    const user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || undefined,
      age: dbUser.age || undefined,
      gender: dbUser.gender || undefined,
      nationality: dbUser.nationality || undefined,
      occupation: dbUser.occupation || undefined,
      smoker: dbUser.smoker,
      image: session.user.image || undefined,
      isAdmin: dbUser.isAdmin,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
