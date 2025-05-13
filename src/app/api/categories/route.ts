import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const iconFile = formData.get("icon") as File | null;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category with the same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Handle icon upload if provided
    let iconUrl = null;
    if (iconFile) {
      // Create uploads/icons directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const iconsDir = path.join(uploadsDir, "icons");

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      if (!existsSync(iconsDir)) {
        await mkdir(iconsDir, { recursive: true });
      }

      // Generate unique filename for the icon
      const fileExtension = path.extname(iconFile.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(iconsDir, fileName);

      // Convert the file to buffer and save it
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      await writeFile(filePath, buffer);

      // Set the icon URL to be stored in the database
      iconUrl = `/uploads/icons/${fileName}`;
    }

    // Create category with icon if provided
    const category = await prisma.category.create({
      data: {
        name,
        icon: iconUrl,
      },
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
