---
id: "11"
slug: "generator-gambar-ai"
title: "Web Generator"
author: "Arif Tirtana"
date: "2025-10-17"
tool: "Google AI Studio"
tags:
  - react
  - typescript
  - ai-image
---
Buat aplikasi web generator gambar AI yang canggih bernama "Generator Gambar" menggunakan React, TypeScript, dan Tailwind CSS (dimuat melalui CDN). Aplikasi ini harus berinteraksi dengan Google Gemini API menggunakan pustaka @google/genai.

## Tata Letak & Desain

- **Header**: Header yang sticky dengan judul aplikasi dan tombol untuk beralih mode gelap/terang.
- **Layout Utama**: Tata letak dua kolom yang responsif.
  - **Kolom Kiri (Sticky)**: Berisi `ControlPanel` dan `HistoryPanel` yang dapat diciutkan.
  - **Kolom Kanan**: `ImageGrid` untuk menampilkan gambar yang dihasilkan.
- **Gaya**: Desain bersih dan modern, dengan dukungan penuh untuk mode gelap, serta ikon dari `lucide-react`.

## Fungsionalitas Utama

### Panel Kontrol (`ControlPanel`)
- **Input Prompt**: Area teks untuk prompt pengguna, dengan placeholder dinamis dan tombol hapus.
- **Asisten Prompt AI**: Fitur opsional. Jika aktif, pengguna memasukkan "Subjek" dan "Detail" agar AI membuat prompt yang kaya dan deskriptif. Sertakan tombol "Sarankan Prompt" untuk mendapatkan tiga ide acak dari AI.
- **Input Gambar Awal**: Kolom input untuk URL gambar. Saat URL valid dimasukkan, tampilkan pratinjau dan otomatis alihkan model ke "Nano Banana".
- **Pengaturan Model**:
  - Pilihan model: Dropdown antara "Imagen 4" dan "Nano Banana" (`gemini-2.5-flash-image`).
  - Rasio aspek: Tombol untuk 1:1, 16:9, dan 9:16.
  - Jumlah gambar: Slider untuk memilih 1 hingga 4 gambar.
- **Pengaturan Lanjutan (khusus Imagen)**: Slider untuk `Temperature` dan `Top-K`.
- **Tombol Generate**: Tombol utama untuk memulai pembuatan gambar dengan indikator status memuat.

### Galeri Gambar (`ImageGrid` & `ImageCard`)
- Tampilkan gambar yang dihasilkan dalam grid responsif.
- Saat kosong, tampilkan pesan selamat datang.
- Setiap kartu gambar menampilkan prompt saat di-hover.
- Klik gambar membuka modal layar penuh.

### Modal Tampilan Gambar (`Modal`)
- Menampilkan gambar yang dipilih secara jelas.
- Sediakan alat edit sisi klien:
  - Tombol rotasi 90 derajat.
  - Tombol filter (Grayscale, Sepia, Invert).
- **Aksi**:
  - **Unduh**: Mengunduh gambar beserta rotasi dan filter yang diterapkan.
  - **Bagikan**: Gunakan Web Share API untuk berbagi gambar.
  - **Edit dengan AI**: Membuka input teks agar pengguna bisa menulis prompt (mis. "tambahkan topi") untuk mengedit gambar via AI.
- Modal dapat ditutup dengan tombol `Escape` atau klik pada latar belakang.

### Panel Riwayat (`HistoryPanel`)
- Menampilkan daftar sesi pembuatan gambar sebelumnya yang bisa diciutkan.
- Setiap entri berisi gambar mini, prompt, dan stempel waktu.
- Setiap entri memiliki tombol "Muat" (untuk menampilkan kembali di galeri utama) dan "Buat Ulang" (untuk menjalankan kembali dengan pengaturan yang sama).
- Tombol "Hapus Riwayat" untuk membersihkan semua entri.
- Simpan riwayat di `localStorage` agar persisten antar sesi.

## Logika & Struktur Kode

- Gunakan TypeScript sepenuhnya dengan tipe yang terdefinisi di `types.ts`.
- Buat modul layanan (`geminiService.ts`) untuk mengenkapsulasi semua panggilan API ke `@google/genai`, baik untuk pembuatan/edit gambar maupun fitur bantuan prompt.
- Gunakan `react-toastify` untuk menampilkan notifikasi umpan balik dan kesalahan kepada pengguna.
- Strukturkan aplikasi secara modular dengan komponen React terpisah untuk setiap bagian fungsionalitas.
