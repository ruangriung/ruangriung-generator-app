// lib/articles.ts

export interface Article {
  slug: string;
  title: string;
  description: string;
  authorSlug: string;
  publishedDate: string; // Format YYYY-MM-DD
  lastUpdatedDate?: string; // Format YYYY-MM-DD, opsional
  category: string;
  tags: string[];
  image: string; // Path ke gambar utama artikel
  content: string; // Konten artikel dalam format HTML atau Markdown
}

// Tidak ada lagi array 'articles' yang di-hardcode di sini.
// Array artikel akan dikumpulkan secara dinamis oleh fungsi sisi server.