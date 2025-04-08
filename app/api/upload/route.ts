// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getImageDimensions } from '@/lib/sharpUtils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;
  const percentage = parseInt(formData.get('percentage') as string) || 50;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}.jpg`;
  const uploadPath = path.join(process.cwd(), 'uploads', fileName);
  const outputPath = path.join(process.cwd(), 'processed', `processed-${fileName}`);

  await fs.writeFile(uploadPath, buffer);

  const { width, height } = await getImageDimensions(uploadPath);
  const newWidth = Math.floor(width * (percentage / 100));
  const newHeight = Math.floor(height * (percentage / 100));

  await sharp(uploadPath)
    .resize(newWidth, newHeight, { fit: 'inside' })
    .jpeg({ quality: 60 })
    .toFile(outputPath);

  const processedBuffer = await fs.readFile(outputPath);

  // Cleanup
  await fs.unlink(uploadPath);
  await fs.unlink(outputPath);

  return new NextResponse(processedBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename=processed-image.jpg',
    },
  });
}
