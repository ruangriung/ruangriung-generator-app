---
id: "12"
slug: "facebook-konten-kreator-ai"
title: "Facebook Konten Kreator AI"
author: "Arif Tirtana"
date: "2025-10-22"
tool: "Google AI Studio, Codex by ChatGPT"
tags:
  - facebook
  - konten kreator
  - aplikasi web
  - react
  - gemini ai
---
## Spesifikasi Aplikasi Web "Facebook Content Kreator AI"

Aplikasi ini dibangun dengan React, TypeScript, dan Tailwind CSS. Tujuannya adalah membantu pengguna membuat postingan Facebook secara komprehensif, dengan antarmuka penuh dalam Bahasa Indonesia.

---

## Struktur Utama

Aplikasi memiliki tata letak dua kolom:

- **Kolom Kiri**: Formulir input dan riwayat generasi konten.
- **Kolom Kanan**: Pratinjau hasil konten yang dihasilkan.

Disertai toggle mode terang/gelap untuk kenyamanan pengguna.

---

## Kolom Kiri – Formulir Input

### 1. Input Ide
- Area teks untuk menulis ide utama.
- Tombol "Saran AI" menggunakan Gemini 2.5 Flash untuk memberikan ide konten singkat secara otomatis.

### 2. Mode Generator
Tiga mode kerja tersedia:

- **Standard**: Generasi konten reguler.
- **Riset Tren (Google Search)**: Menggunakan Gemini 2.5 Flash dengan Google Search grounding untuk menampilkan tren terbaru dan sumber tautan hasil pencarian.
- **Berpikir Mendalam**: Menggunakan Gemini 2.5 Pro dengan `thinkingBudget` untuk menghasilkan ide yang lebih kompleks.

### 3. Kustomisasi Model & Gaya
- **Dropdown Model**:
  - Teks: Gemini 2.5 Flash / Pro / Flash Lite
  - Gambar: Imagen 4 / Gemini Flash Image
- **Pilihan Gaya Konten**: Informasional, Inspiratif, Lucu, dll.
- **Gaya Visual Caption**: Minimalist, Bold Quote, dan lainnya.
- **Pratinjau Visual**: Menampilkan contoh gaya caption yang dipilih.
- **Tombol Generate**: Menjalankan proses pembuatan konten, menampilkan indikator loading selama pemrosesan.

---

## Kolom Kanan – Pratinjau Konten

### Area Gambar
- Menampilkan prompt gambar AI serta tombol untuk membuat gambar.
- Setelah dibuat, gambar bisa diperbesar melalui modal popup dan diunduh langsung.

### Area Teks
- Menampilkan caption yang sudah diformat sesuai gaya visual, disertai tagar dalam bentuk pills dan sumber tautan (jika dari mode Riset Tren).

---

## Aksi & Umpan Balik

- Tombol Salin Caption.
- Sistem suka/tidak suka dengan kolom komentar opsional untuk setiap hasil konten.

---

## Riwayat & Penyimpanan

- Menampilkan daftar konten yang pernah dibuat.
- Pengguna bisa melihat ulang, menghapus per item, atau menghapus semua.
- Semua data riwayat dan umpan balik disimpan secara persisten di local storage browser.

---

## Integrasi API Gemini

Gunakan `@google/genai` SDK:

- Untuk generasi konten, gunakan `responseSchema` (mode Standard/Berpikir Mendalam) dan `tools` (mode Riset Tren).
- Untuk gambar, gunakan `generateImages` (Imagen) dan `generateContent` dengan `responseModalities` (Gemini Flash Image).
- Tangani error API dengan menampilkan pesan kesalahan yang jelas kepada pengguna.
