// app/api/upload-image/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file gambar yang diunggah.' }, { status: 400 });
    }

    // Ubah file menjadi buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Unggah gambar ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'ruangriung-thumbnails' }, // Folder di Cloudinary untuk thumbnail
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          }
          resolve(result);
        }
      ).end(buffer);
    });

    if (!result || typeof result !== 'object' || !('secure_url' in result)) {
      return NextResponse.json({ error: 'Gagal mengunggah gambar ke Cloudinary.' }, { status: 500 });
    }

    // Cast result to CloudinaryUploadResult to access secure_url
    const cloudinaryResult = result as { secure_url: string; };

    return NextResponse.json({ url: cloudinaryResult.secure_url }, { status: 200 });

  } catch (error) {
    console.error('Error handling image upload:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server saat mengunggah gambar.' }, { status: 500 });
  }
}