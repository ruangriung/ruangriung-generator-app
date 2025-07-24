// lib/prompts/data/contoh-prompt-gambar-pemandangan.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'gambar-pemandangan-fantasi',
  title: 'Pemandangan Fantasi Epik',
  author: 'Yogee Kribo',
  category: 'Gambar',
  date: '24 Juli 2025', // Tanggal publikasi prompt
  toolsUsed: ['DALL-E 3', 'Midjourney v6, Stable Diffusion, DreamStudio, Artbreeder'], 
  thumbnailUrl: '/v1/img/showcase-2.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan gambar pemandangan fantasi yang luas dan menakjubkan dengan pegunungan mengambang dan air terjun kristal.', // Deskripsi singkat untuk tampilan daftar
  fullPrompt: `
    An epic fantasy landscape with floating mountains, crystal clear waterfalls, a hidden ancient temple nestled amongst lush bioluminescent flora, under a sky filled with a nebula and three moons. Highly detailed, volumetric lighting, wide angle, cinematic view, vibrant colors, fantasy art style 

  `, // Isi prompt lengkap
  negativePrompt: `
    Blurry, low resolution, distorted, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, grainy, signature, cut off, draft, bad art, noisy, text, error, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, artist name, imperfect, incomplete
  `, // Prompt negatif opsional
  notes: 'Gunakan prompt ini untuk eksplorasi kreatif Anda dan dapatkan hasil gambar yang menakjubkan!', // Catatan tambahan tentang prompt
};