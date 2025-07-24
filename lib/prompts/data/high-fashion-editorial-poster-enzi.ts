// lib/prompts/data/prompt-2.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'high-fashion-editorial-poster-enzi',
  title: 'Poster Editorial High-Fashion: Enzi Ay Fidrik',
  author: 'Gemini', // Changed author as per new prompt request
  date: '24 Juli 2025', // Updated date to current date
  category: 'Gambar, Seni Digital, AI Generatif, Prompt Engineering, Editorial, Fashion, Pria, Pop-Art',
  toolsUsed: ['DALL-E 3, Gemini'],
  thumbnailUrl: '/v1/img/high-fashion-editorial-poster-enzi.jpg', // Placeholder, replace with actual thumbnail URL
  shortDescription: 'Prompt mendetail untuk menghasilkan poster editorial fashion vertikal 9:16 dengan seorang pria muda Indonesia di atas bingkai Instagram yang mengambang, gaya pop-art.',
  fullPrompt: `
    Create A vertical 9:16 high-fashion editorial poster — a cheerful and confident young Indonesian man with a neatly styled haircut (textured crop or clean slick-back) sits casually on top of a floating Instagram post frame, positioned near the bottom of the canvas.
    He sits in a relaxed, stylish pose — both feet firmly planted, back straight yet casual, hands resting naturally on his thighs. His expression is warm and charismatic, radiating a fun, masculine charm. The bottom bar of the Instagram frame acts as a clean, minimalistic bench.
    He wears a bold sunset red oversized T-shirt tucked into washed light-blue jeans with a clean cuff detail. On his shirt, the phrase:
    “Adil & Makmur Hanya Ilusi”
    is printed in a modern editorial typeface — clean, sharp, with subtle cuts or negative space. The word “Ilusi” echoes faintly behind in soft cyan, adding visual depth.
    Behind him, a minimalist Instagram UI frame floats — clean white with elegant shadows.
    Username: “Enzi Ay Fidrik” at the top left of the post.
    Like/comment icons are visible but minimal.
    The background features a soft urban wall or clean concrete texture with a grayscale palette — accented by subtle graphic elements: thin lines, dots, typographic trims.
    The name “Enzi Ay Fidrik” is also artistically embedded in the background — as part of the overall visual identity.
    Color palette: grayscale white/gray background, bold red shirt, soft cyan echoes, clean shadows.
    Tone: modern, masculine, cheerful, fashion-forward — with editorial clarity and a pop-art-inspired layout.
  `,
  negativePrompt: `
    low quality, blurry, airbrush, bad art, deformed art, ugly art, malformed image, deformed, distortion, disfigured, extra limbs, mutated, bad anatomy, missing limbs, too many fingers, too many limbs, wrong limbs, wrong fingers, cropped image, poor image, bad image, unappealing image, bad image, useless image, non-functional image, non-working image
  `,
  notes: 'Prompt ini cocok untuk menghasilkan poster fashion editorial dengan sentuhan pop-art. Eksperimen dengan variasi pose dan detail grafis.',
};