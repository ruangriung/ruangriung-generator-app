// lib/prompts/data/prompt-dery-lau-2.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'puisi-tentang-bintang-jatuh',
  title: 'Puisi Singkat: Bintang Jatuh di Malam Hari',
  author: 'Dery Lau',
  date: '05 September 2025',
  category: 'Teks',
  toolsUsed: ['ChatGPT'],
  thumbnailUrl: '/v1/img/dery-2.jpg', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan puisi pendek yang indah tentang keajaiban dan refleksi saat melihat bintang jatuh di malam hari.',
  fullPrompt: `
    Write a short, evocative poem about a shooting star seen on a clear night. Focus on themes of fleeting beauty, wonder, and perhaps a silent wish. Use vivid imagery and a contemplative tone to capture the moment. The poem should be concise, ideally no more than 8-10 lines, and evoke a sense of tranquility and introspection as the star streaks across the sky.
  `,
  negativePrompt: `
    prose, lengthy, scientific terms, negative emotions, complex language, rhyming only, rigid structure
  `,
  notes: 'Anda bisa menyesuaikan panjang puisi atau menambahkan unsur-unsur spesifik tentang lokasi atau perasaan. Cocok untuk inspirasi sastra.',
};