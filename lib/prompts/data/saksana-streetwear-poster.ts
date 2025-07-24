// lib/prompts/data/prompt-4.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'saksana-streetwear-poster',
  title: 'Poster Fashion Streetwear SAKSANA',
  author: 'Yogee Kribo',
  date: '24 Juli 2025',
  category: 'Gambar, Seni Digital, AI Generatif, Prompt Engineering, Fashion, Streetwear, Pria, Kolase, Monokrom, Grafis',
  toolsUsed: ['DALL-E 3, Gemini'],
  thumbnailUrl: '/v1/img/saksana-streetwear-poster.jpg', // Placeholder, replace with actual thumbnail URL
  shortDescription: 'Prompt mendetail untuk menghasilkan poster fashion streetwear vertikal 9:16 dengan pria muda Indonesia dan elemen kolase artistik.',
  fullPrompt: `
    A vertical 9:16 ultra-stylized fashion poster — front-facing Indonesian young man, standing confidently, looking into the camera.
    He wears a clean white oversized T-shirt with bold handwritten black text across the front:
    “YA NDAK TAU, KOK TANYA SAYA”, placed inside a graphic rectangle frame like a faux streetwear logo.
    Surrounding him are multiple layered silhouettes of himself in motion or varied poses — ghost-like echoes in glitch, halftone, and red/black overlays, forming a dynamic artistic collage.
    In the top or corner of the poster, include a stylized logo of the fashion brand “SAKSANA” — designed like a sleek, modern streetwear label. The text "SAKSANA" should look like a minimalist icon: sharp lines, geometric, perhaps all-caps custom typography, or emblem-style — monochrome or with a bold accent (e.g. red or chrome).
    Background: stylized urban texture — concrete wall, graffiti, torn posters. Add collage layers: paper tears, barcode, corner dates, and zine-style details.
    Color theme: high-contrast B/W with bold red or glitch accents, slight noise grain, editorial tone
  `,
  negativePrompt: `
    low quality, blurry, airbrush, bad art, deformed art, ugly art, malformed image, deformed, distortion, disfigured, extra limbs, mutated, bad anatomy, missing limbs, too many fingers, too many limbs, wrong limbs, wrong fingers, cropped image, poor image, bad image, unappealing image, bad image, useless image, non-functional image, non-working image
  `,
  notes: 'Prompt ini cocok untuk menghasilkan poster streetwear dengan estetika kolase dinamis. Eksperimen dengan variasi efek glitch dan detail urban.',
};