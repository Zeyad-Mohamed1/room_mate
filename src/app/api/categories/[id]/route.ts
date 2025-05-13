import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

// Get a specific category
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// Update a category
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const iconFile = formData.get("icon") as File | null;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle icon upload if provided
    let iconUrl = existingCategory.icon; // Keep existing icon by default
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

      // Delete old icon if exists
      if (existingCategory.icon) {
        try {
          const oldIconPath = path.join(
            process.cwd(),
            "public",
            existingCategory.icon
          );
          if (existsSync(oldIconPath)) {
            await unlink(oldIconPath);
          }
        } catch (error) {
          console.error("Error deleting old icon:", error);
          // Continue even if deleting old icon fails
        }
      }

      // Generate unique filename for the new icon
      const fileExtension = path.extname(iconFile.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(iconsDir, fileName);

      // Convert the file to buffer and save it
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      await writeFile(filePath, buffer);

      // Set the new icon URL to be stored in the database
      iconUrl = `/uploads/icons/${fileName}`;
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name,
        icon: iconUrl,
      },
    });

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        properties: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has properties
    if (existingCategory.properties.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with existing properties. Please reassign or delete the properties first.",
        },
        { status: 400 }
      );
    }

    // Delete the category icon if exists
    if (existingCategory.icon) {
      try {
        const iconPath = path.join(
          process.cwd(),
          "public",
          existingCategory.icon
        );
        if (existsSync(iconPath)) {
          await unlink(iconPath);
        }
      } catch (error) {
        console.error("Error deleting category icon:", error);
        // Continue deletion even if icon deletion fails
      }
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
