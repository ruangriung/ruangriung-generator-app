// lib/prompts/data/prompt-xenopath-2.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'makhluk-mitologi-di-hutan-berkabut',
  title: 'Makhluk Mitologi di Hutan Berkabut',
  author: 'Xenopath',
  date: '12 September 2025', // Tanggal baru
  category: 'Gambar',
  toolsUsed: ['DALL-E 3', 'Midjourney'],
  thumbnailUrl: '/v1/img/gbr-3.jpg', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan gambar makhluk mitologi yang misterius di hutan yang diselimuti kabut tebal, dengan pencahayaan suram.',
  fullPrompt: `
A whimsical scene featuring a young elf girl with pointed ears and platinum blonde hair in pigtails, sleeping peacefully against a large, friendly green dragon with textured scales and expressive eyes. The girl wears a black leather jacket with a 'Motorhead' patch and sturdy red boots with yellow stitching. The background is a textured brick wall, creating a cozy yet rugged atmosphere. The art style should be highly detailed, with a painterly, 3D-rendered look, using a color palette of greens, reds, and earthy tones. The lighting is soft and warm, casting gentle shadows that enhance the textures of the dragon's scales`,
  negativePrompt: `
    human, modern elements, city, bright sunlight, clear sky, simple, cartoon, blurry, ugly, disfigured, too many creatures
  `,
  notes: 'Ganti jenis makhluk mitologi untuk hasil yang berbeda. Eksplorasi dengan warna kabut atau tambahkan elemen kuno seperti reruntuhan.',
};