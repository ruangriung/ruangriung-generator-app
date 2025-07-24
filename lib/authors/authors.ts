// lib/authors.ts
export interface Author {
  slug: string; // Slug unik untuk penulis
  name: string;
  aka?: string; // Nama panggilan, seperti 'Yogee Kribo'
  imageUrl: string; // Path ke gambar profil penulis
  category?: string; // Kategori penulis, jika ada
  description: string; // Deskripsi singkat tentang penulis
  facebookUrl?: string; // URL profil Facebook opsional
  instagramUrl?: string; // URL profil Instagram opsional
  twitterUrl?: string; // URL profil Twitter opsional
  youtubeUrl?: string; // URL profil YouTube opsional
  websiteUrl?: string; // URL situs web penulis opsional
  linkedinUrl?: string; // URL profil LinkedIn opsional
  threadsUrl?: string; // URL profil Threads opsional
  tiktokUrl?: string; // URL profil TikTok opsional
  pinterestUrl?: string; // URL profil Pinterest opsional
  githubUrl?: string; // URL profil GitHub opsional
  shortDescription?: string; // Deskripsi singkat untuk tampilan ringkas
  whatsAppUrl?: string; // URL WhatsApp opsional
  email?: string; // Email penulis, jika diperlukan
  quotes?: string[]; // Kutipan atau testimoni dari penulis, jika ada
  telegramUrl?: string; // URL profil Telegram opsional
  location?: string; // Lokasi penulis, jika ingin ditampilkan
  
  
}

// Impor penulis individual di sini
import { author as yogeeKribo } from './data/yogee-kribo';
import { author as kokoAjeeb } from './data/koko-ajeeb';
import { author as xenopath } from './data/xenopath';
import { author as deryLau } from './data/dery-lau';

export const authors: Author[] = [
  yogeeKribo,
  kokoAjeeb,
  xenopath,
  deryLau,
  // Tambahkan penulis lain ke sini seiring bertambahnya
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}