// lib/prompts/data/contoh-prompt-1.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'naga-perak-di-gunung-berapi',
  title: 'Naga Perak Raksasa di Puncak Gunung Berapi',
  author: 'Yogee Kribo',
  date: '20 Juli 2025',
  category: 'Gambar, Seni Digital, AI Generatif, Prompt Engineering, Eksperimen Seni, Fantasi, Epik, Karikatur, Konsep, Karakter, Animasi',
  toolsUsed: ['DALL-E 3, Gemini'],
  thumbnailUrl: '/v1/img/showcase-1.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt mendetail untuk menghasilkan gambar naga perak raksasa dengan sisik bercahaya di puncak gunung berapi saat matahari terbenam, gaya seni digital fantasi.',
  fullPrompt: `
    Seekor naga perak raksasa dengan sisik bercahaya sedang bertengger di puncak gunung berapi yang berasap, memandangi lembah di bawahnya saat matahari terbenam. Gaya seni digital fantasi, sangat detail, cinematic lighting, dengan latar belakang pegunungan yang dramatis dan langit berwarna oranye-merah. Fokus pada tekstur sisik naga dan suasana epik.
  `,
  negativePrompt: `
    kualitas rendah, buram, airbrush, seni yang buruk, seni yang cacat, seni jelek, gambar yang cacat, cacat, distorsi, disfigured, ekstra ekstremitas, cacat, cacat, disfigured, ekstra ekstremitas, anggota badan yang hilang, terlalu banyak jari, terlalu banyak anggota badan, anggota badan yang salah, jari yang salah, gambar yang rusak, gambar yang buruk, gambar yang buruk, gambar yang tidak menarik, gambar yang buruk, gambar yang tidak berguna, gambar yang tidak berfungsi, gambar yang tidak berfungsi
  `,
  notes: 'Prompt ini cocok untuk menghasilkan gambar fantasi yang epik. Eksperimen dengan variasi warna naga dan jenis gunung berapi.',
};