// lib/prompts/data/prompt-3.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'yayoi-kusama-tokyo-fashion-dream',
  title: 'Yayoi Kusama Tokyo Fashion Dream',
  author: 'Yogee Kribo',
  date: '24 Juli 2025',
  category: 'Gambar, Seni Digital, AI Generatif, Prompt Engineering, Fashion, Surrealisme, Pop-Art, Tokyo, Wanita, Fotorealistik',
  toolsUsed: ['DALL-E 3, Gemini'],
  thumbnailUrl: '/v1/img/yayoi-kusama-tokyo-fashion-dream.jpg', // Placeholder, replace with actual thumbnail URL
  shortDescription: 'Prompt mendetail untuk menghasilkan adegan fashion surealis vertikal 9:16 di Tokyo yang diilhami Yayoi Kusama, menampilkan seorang wanita Korea dalam gaun haute couture.',
  fullPrompt: `
    9:16 vertical photo-realistic surreal fashion scene — a beautiful young Korean woman with long, wavy chestnut hair and luminous skin stands calmly in the middle of a bustling Tokyo street — she wears a luxurious couture dress blending aristocratic elegance with kawaii flair: pastel layers of silk chiffon in soft pink, lemon yellow, and lavender, covered in intricate polka dot embroidery, with shimmering pearl details — her oversized aristocratic hat is adorned with ribbon bows, lace, and translucent mesh veils, echoing 18th-century European fashion reimagined through a modern kawaii lens — her posture is poised and regal as she stands still amidst surreal chaos — the entire Tokyo city around her is overtaken by Yayoi Kusama’s explosive polkadot universe: the Tokyo Tower looms in the background, wrapped in glowing red-and-white dots that ripple across its metal frame — skyscrapers are covered in massive, animated dot patterns that shift colors like oil slicks: toxic green, neon pink, deep crimson, and pure white — the sky is chaotic and dreamlike, filled with floating orb-like balloons, dot-covered clouds, and infinite nets stretching between rooftops, shimmering like spider webs — sidewalks are transformed into reflective glass filled with pulsating dots, and crosswalks now resemble rainbow moiré dot gradients — floating jellyfish-like lanterns drift above, their bodies painted with tiny dots and glowing softly — even passing buses and vending machines are infected with organic dot patterns that morph with every movement — mirror shards suspended midair reflect multiple versions of her figure and the chaotic environment, kaleidoscopically — intense cinematic lighting adds glossy highlights on every fabric fold, building surface, and dot texture — the air glimmers with a fine mist of polkadot-shaped particles — a hyper-realistic fever dream where fashion, Tokyo urban life, and Yayoi Kusama’s maximalist dot chaos collide in one visually rich, surreal yet believable moment.
  `,
  negativePrompt: `
    low quality, blurry, airbrush, bad art, deformed art, ugly art, malformed image, deformed, distortion, disfigured, extra limbs, mutated, bad anatomy, missing limbs, too many fingers, too many limbs, wrong limbs, wrong fingers, cropped image, poor image, bad image, unappealing image, bad image, useless image, non-functional image, non-working image
  `,
  notes: 'Prompt ini cocok untuk menghasilkan gambar fashion surreal yang kaya visual dengan elemen Yayoi Kusama. Eksperimen dengan variasi warna dan intensitas pola titik.',
};