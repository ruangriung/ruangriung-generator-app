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
PROMPT_EDIT_TOKEN=
```

Variabel tambahan mungkin diperlukan untuk fitur tertentu seperti formulir kontak atau iklan. Anda juga dapat menambahkan
akhiran khusus (misalnya `NODEMAILER_EMAIL_AYICKTIGABELAS` dan `NODEMAILER_APP_PASSWORD_AYICKTIGABELAS`) bila perlu
menyimpan beberapa kredensial; aplikasi akan otomatis menggunakan nilai pertama yang tersedia dengan awalan tersebut.

## Konten
Artikel dan contoh prompt berada pada direktori `content` dan dimuat dari berkas Markdown.

## Skrip
- `pnpm dev` – menjalankan server pengembangan
- `pnpm build` – membangun aplikasi untuk produksi
- `pnpm start` – menjalankan aplikasi hasil build
- `pnpm lint` – menjalankan ESLint

## Tanya Jawab Umum

### Bisakah aplikasi memiliki dashboard yang hanya dapat diakses admin?
Ya, Anda dapat menambahkan dashboard yang dibatasi untuk admin dengan mengombinasikan autentikasi dan pemeriksaan peran. Contoh alur kerjanya:

1. Gunakan penyedia autentikasi seperti NextAuth, Supabase Auth, atau Firebase Authentication untuk memverifikasi identitas pengguna.
2. Simpan informasi peran (misalnya `role: "admin"`) pada basis data atau token sesi pengguna.
3. Buat *middleware* atau komponen pelindung halaman (protected route) yang memeriksa status login dan peran pengguna sebelum merender dashboard.
4. Redirect pengguna non-admin ke halaman lain (misalnya beranda) bila tidak memenuhi syarat.

Setelah akses admin dibatasi, dashboard bisa difungsikan sebagai pusat kontrol aktivitas, misalnya:

- Mengelola antrian konten yang dikirim pengguna seperti prompt, profil, dan data UMKM sebelum diterbitkan.
- Memberikan aksi moderasi (setujui, revisi, tolak) serta menambahkan catatan internal untuk tiap pengajuan.
- Menampilkan metrik penting (jumlah pengajuan baru, status publikasi, aktivitas terakhir) agar admin dapat memantau keadaan sistem secara menyeluruh.

Dengan pola ini, hanya akun dengan peran admin yang akan mengakses dashboard, sementara pengguna lainnya tetap diarahkan ke halaman publik. Semua proses kurasi dan manajemen data pun terpusat di satu tempat yang aman.

### Apa saja yang perlu disiapkan saat deploy ke Vercel?
Saat melakukan deploy ke Vercel, pastikan hal-hal berikut:

- **Variabel lingkungan**: isi semua variabel pada menu *Project Settings > Environment Variables* di Vercel sesuai nilai yang tercantum di bagian [Variabel Lingkungan](#variabel-lingkungan).
- **Build Command**: gunakan perintah `pnpm build` dan set *Install Command* ke `pnpm install --frozen-lockfile` agar dependensi konsisten.
- **Output Directory**: biarkan default (`.next`) karena proyek ini menggunakan Next.js 14.
- **Versi Node.js & pnpm**: opsional tetapi disarankan menyesuaikan versi dengan yang digunakan secara lokal melalui file `package.json` atau `engines` bila diperlukan.
- **Pengaturan Domain**: apabila memerlukan domain khusus, konfigurasikan di tab *Domains* dan arahkan DNS ke Vercel.

Setelah konfigurasi tersebut, Anda cukup menyambungkan repository Git ke Vercel dan setiap push ke branch yang dipilih akan memicu deploy otomatis.

### Mengapa prompt yang baru dikirim langsung muncul di halaman kumpulan prompt?
Halaman daftar (`app/kumpulan-prompt/page.tsx`) dan detail prompt (`app/kumpulan-prompt/[slug]/page.tsx`) mengekspor `export const revalidate = 0;`. Di Next.js 14, nilai `revalidate` mengatur caching untuk halaman yang digenerasi secara statis. Angka `0` berarti halaman tidak pernah di-cache dan selalu dirender ulang di sisi server untuk setiap permintaan.

Alurnya sebagai berikut:

1. Pengguna mengirim prompt baru dan data tersimpan melalui API/basis data.
2. Saat halaman daftar atau detail diakses, Next.js menjalankan fungsi server (`getAllPrompts` atau `getPromptBySlug`) tanpa mengambil versi cache.
3. Karena halaman tidak di-cache, data terbaru langsung diproses dan diteruskan ke komponen klien (`PromptClient` atau `PromptDetailClient`).

Dengan demikian, kiriman prompt baru akan langsung terlihat tanpa perlu menunggu revalidasi periodik ataupun menghapus cache secara manual.

## Lisensi
Proyek ini menggunakan lisensi ISC seperti yang tercantum pada `package.json`.
