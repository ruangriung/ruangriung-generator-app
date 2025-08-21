# RuangRiung Generator App

RuangRiung Generator adalah aplikasi Next.js 14 yang membantu membuat konten berbasis AI seperti prompt, kartu identitas, dan cerita bergambar. Proyek ini menggunakan Tailwind CSS, PWA, serta dukungan Mode Gelap untuk pengalaman yang nyaman.

## Fitur Utama
- **ID Card Generator** – buat kartu identitas kustom dengan elemen drag-and-drop.
- **Kumpulan Prompt** – kumpulan contoh prompt dalam berkas Markdown yang bisa dieksplorasi.
- **Storyteller** – menghasilkan cerita visual dengan gambar dan deskripsi menggunakan AI.
- **Video Prompt** – rancang skrip dan adegan untuk pembuatan video berbasis AI.

## Memulai
1. Instal dependensi:

```bash
pnpm install
```

2. Jalankan server pengembangan:

```bash
pnpm dev
```

Aplikasi dapat diakses di [http://localhost:3000](http://localhost:3000).

## Variabel Lingkungan
Buat berkas `.env.local` pada root proyek dan isi variabel berikut sesuai kebutuhan fitur:

```
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
NODEMAILER_EMAIL=
NODEMAILER_APP_PASSWORD=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_POLLINATIONS_TOKEN=
```

Variabel tambahan mungkin diperlukan untuk fitur tertentu seperti formulir kontak atau iklan.

## Konten
Artikel dan contoh prompt berada pada direktori `content` dan dimuat dari berkas Markdown.

## Skrip
- `pnpm dev` – menjalankan server pengembangan
- `pnpm build` – membangun aplikasi untuk produksi
- `pnpm start` – menjalankan aplikasi hasil build
- `pnpm lint` – menjalankan ESLint

## Lisensi
Proyek ini menggunakan lisensi ISC seperti yang tercantum pada `package.json`.
