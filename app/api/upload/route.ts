// // // app/api/upload/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { promises as fs } from 'fs';
// // import path from 'path';
// // import sharp from 'sharp';
// // import { getImageDimensions } from '@/lib/sharpUtils';

// // export const config = {
// //   api: {
// //     bodyParser: false,
// //   },
// // };

// // export async function POST(req: NextRequest) {
// //   const formData = await req.formData();
// //   const file = formData.get('image') as File;
// //   const percentage = parseInt(formData.get('percentage') as string) || 50;

// //   if (!file) {
// //     return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
// //   }

// //   const buffer = Buffer.from(await file.arrayBuffer());
// //   const fileName = `${Date.now()}.jpg`;
// //   const uploadPath = path.join(process.cwd(), 'uploads', fileName);
// //   const outputPath = path.join(process.cwd(), 'processed', `processed-${fileName}`);

// //   await fs.writeFile(uploadPath, buffer);

// //   const { width, height } = await getImageDimensions(uploadPath);
// //   const newWidth = Math.floor(width * (percentage / 100));
// //   const newHeight = Math.floor(height * (percentage / 100));

// //   await sharp(uploadPath)
// //     .resize(newWidth, newHeight, { fit: 'inside' })
// //     .jpeg({ quality: 60 })
// //     .toFile(outputPath);

// //   const processedBuffer = await fs.readFile(outputPath);

// //   // Cleanup
// //   await fs.unlink(uploadPath);
// //   await fs.unlink(outputPath);

// //   return new NextResponse(processedBuffer, {
// //     headers: {
// //       'Content-Type': 'image/jpeg',
// //       'Content-Disposition': 'attachment; filename=processed-image.jpg',
// //     },
// //   });
// // }
// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";
// import sharp from "sharp";
// import { getImageDimensions } from "@/lib/sharpUtils";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("image") as File;
//   const percentage = parseInt(formData.get("percentage") as string) || 50;

//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//   }

//   // Validate file type
//   const fileType = file.type;
//   if (!fileType.startsWith("image/")) {
//     return NextResponse.json(
//       { error: "Invalid file type. Only images are allowed." },
//       { status: 400 }
//     );
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());
//   const fileName = `${Date.now()}.jpg`;
//   const uploadPath = path.join(process.cwd(), "uploads", fileName);
//   const outputPath = path.join(
//     process.cwd(),
//     "processed",
//     `processed-${fileName}`
//   );

//   // Ensure directories exist
//   const uploadDir = path.join(process.cwd(), "uploads");
//   const processedDir = path.join(process.cwd(), "processed");
//   await fs.mkdir(uploadDir, { recursive: true });
//   await fs.mkdir(processedDir, { recursive: true });

//   try {
//     await fs.writeFile(uploadPath, buffer);

//     const { width, height } = await getImageDimensions(uploadPath);
//     const newWidth = Math.floor(width * (percentage / 100));
//     const newHeight = Math.floor(height * (percentage / 100));

//     // Process the image
//     await sharp(uploadPath)
//       .resize(newWidth, newHeight, { fit: "inside" })
//       .jpeg({ quality: 60 })
//       .toFile(outputPath);

//     // Read the processed image
//     const processedBuffer = await fs.readFile(outputPath);

//     // Cleanup temporary files
//     await fs.unlink(uploadPath);
//     await fs.unlink(outputPath);

//     // Return processed image
//     return new NextResponse(processedBuffer, {
//       headers: {
//         "Content-Type": "image/jpeg",
//         "Content-Disposition": "attachment; filename=processed-image.jpg",
//       },
//     });
//   } catch (err) {
//     console.error("Error during image processing:", err);
//     return NextResponse.json(
//       { error: `Server error: ${err.message}` },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser to handle form-data manually
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const percentage = parseInt(formData.get("percentage") as string) || 50;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Validate file type
  const fileType = file.type;
  if (!fileType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Invalid file type. Only images are allowed." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Use sharp to get the image metadata (dimensions)
    const { width, height } = await sharp(buffer).metadata();
    const newWidth = Math.floor(width! * (percentage / 100));
    const newHeight = Math.floor(height! * (percentage / 100));

    // Process the image in memory (resize and compress)
    const resizedBuffer = await sharp(buffer)
      .resize(newWidth, newHeight, { fit: "inside" })
      .jpeg({ quality: 60 })
      .toBuffer(); // Returns the processed image buffer

    // Return the processed image as a response
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
