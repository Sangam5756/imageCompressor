// lib/sharpUtils.ts
import sharp from 'sharp';

export const getImageDimensions = async (imagePath: string) => {
  const metadata = await sharp(imagePath).metadata();
  return { width: metadata.width || 0, height: metadata.height || 0 };
};
