// lib/prompts/data/prompt-koko-ajeeb-1.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'kota-melayang-futuristik',
  title: 'Kota Melayang Futuristik di Langit Senja',
  author: 'Koko Ajeeb',
  date: '05 Agustus 2025',
  category: 'Gambar',
  toolsUsed: ['Midjourney', 'DALL-E 3'],
  thumbnailUrl: '/v1/img/showcase-5.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menciptakan pemandangan kota futuristik yang melayang di awan dengan sentuhan neon dan pencahayaan senja dramatis.',
  fullPrompt: `
    A futuristic floating city in a twilight sky, cyberpunk aesthetic, with glowing neon lights reflecting on chrome buildings and misty clouds below. High detail, cinematic lighting, volumetric fog, digital painting style. The city features sleek skyscrapers, flying vehicles, and lush greenery integrated into the architecture. The sky is a gradient of purple and orange hues, creating a dramatic backdrop that enhances the ethereal quality of the scene.
  `,
  negativePrompt: `
    blurry, low resolution, messy, cluttered, dull colors, no atmosphere, flat lighting, simple, childish, poorly drawn elements, distorted perspective, unrealistic proportions, lack of detail, generic cityscape,
    no flying vehicles, no neon lights, no futuristic elements, no clouds, no dramatic lighting, no depth, no shadows, no reflections, no intricate details, no unique architecture, no vibrant colors, no dynamic composition, no sense of scale, no atmosphere, no mood,
  `,
  notes: 'Eksplorasi dengan berbagai warna neon atau tambahkan elemen kendaraan terbang untuk dinamika lebih lanjut.',
};