// lib/prompts/data/prompt-desain-minimalis.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'desain-interior-minimalis',
  title: 'Desain Interior Ruang Tamu Minimalis',
  author: 'Yogee Kribo',
  date: '22 Juni 2025',
  category: 'Desain',
  toolsUsed: ['Midjourney', 'Stable Diffusion'],
  thumbnailUrl: '/v1/img/showcase-2.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan gambar desain interior ruang tamu minimalis modern dengan pencahayaan alami dan palet warna netral.',
  fullPrompt: `
    Interior design of a modern minimalist living room, spacious, clean lines, natural light streaming through large windows, white walls, light wood flooring, a grey sofa, a simple coffee table, green plants, and subtle decorative elements. Neutral color palette with pops of greenery, emphasizing simplicity and functionality. The room should feel airy and inviting, with a focus on open space and minimal clutter. Include details like a soft rug, minimalist art on the walls, and a few carefully chosen accessories to enhance the serene atmosphere.
  `,
  negativePrompt: `
    cluttered, messy, dark, old-fashioned, excessive decoration, busy patterns, low quality, blurry, distorted, crowded
  `,
  notes: 'Fokus pada kesederhanaan dan fungsi. Anda bisa mencoba mengubah jenis furnitur atau menambahkan sentuhan warna pop kecil.',
};