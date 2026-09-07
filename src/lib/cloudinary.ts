import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder: string) {
  try {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Format gambar harus PNG, JPG, atau JPEG");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 10MB");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const processedImage = await sharp(buffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .webp({ 
        quality: 60,
        effort: 6
      })
      .toBuffer();

    return await performUpload(processedImage, folder);
  } catch (error: unknown) {
    console.error(
      "CLOUDINARY_UPLOAD_PROCESS_FAILED:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("IMAGE_PROCESSING_FAILED");
  }
}

async function performUpload(buffer: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `ult_track/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("CLOUDINARY_UPLOAD_FAILED"));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            version: result.version,
          });
        },
      )
      .end(buffer);
  }) as Promise<{ url: string; publicId: string; version: number }>;
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("CLOUDINARY_DELETE_ERROR", error);
  }
}