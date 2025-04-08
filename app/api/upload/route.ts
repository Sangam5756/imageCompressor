import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const percentage = parseInt(formData.get("percentage") as string) || 50;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileType = file.type;
  if (!fileType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Invalid file type. Only images are allowed." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { width, height } = await sharp(buffer).metadata();
    const newWidth = Math.floor(width! * (percentage / 100));
    const newHeight = Math.floor(height! * (percentage / 100));

    const resizedBuffer = await sharp(buffer)
      .resize(newWidth, newHeight, { fit: "inside" })
      .jpeg({ quality: 60 })
      .toBuffer(); 

    return new NextResponse(resizedBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": "attachment; filename=processed-image.jpg",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error during image processing:", err);
      return NextResponse.json(
        { error: `Server error: ${err.message}` },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during image processing:", err);
      return NextResponse.json(
        { error: "Unknown error occurred during image processing." },
        { status: 500 }
      );
    }
  }
}
