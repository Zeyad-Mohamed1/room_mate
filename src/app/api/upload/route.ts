import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// This is a simple file upload API that stores files locally
// In a production environment, you would use a file storage service like AWS S3
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get file extension
    const extension = path.extname(file.name);
    // Generate a unique filename
    const fileName = `${uuidv4()}${extension}`;
    // Create the upload path - in a real app, this would point to a cloud storage
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file
    await writeFile(filePath, buffer);

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
