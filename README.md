# 🌌 RuangRiung V2: The Next Generation AI Creative Hub

![RuangRiung Banner](https://ruangriung.my.id/og-image.png)

**RuangRiung V2** adalah evolusi drastis dari platform generator konten berbasis AI. Dibangun dengan Next.js 14, aplikasi ini dirancang untuk memberikan pengalaman kreasi yang mulus, cepat, dan profesional bagi UMKM, Konten Kreator, dan Penulis.

---

## ⚡ Apa yang Baru di V2?

Kami telah merombak total pengalaman pengguna dengan fitur-fitur mutakhir:

- **🤖 RR AGENT (AI Assistant)**: Asisten cerdas yang selalu siap membantu Anda menavigasi platform dan memberikan tips kreasi secara real-time.
- **🔑 BYOP (Bring Your Own Provider)**: Kendali penuh di tangan Anda. Masukkan API Key pribadi (OpenAI, Pollinations, dll) untuk performa tanpa batas dan akses model PRO.
- **🎨 New Tabbed UI**: Antarmuka berbasis panel yang sangat rapi. Berpindah dari *Storyteller* ke *ID Card Generator* semudah berpindah tab browser.
- **📱 Responsive Pro**: Dioptimalkan secara mendalam untuk perangkat mobile. Tidak ada lagi elemen yang tumpang tindih—hanya kenyamanan kreasi.
- **✨ Premium Aesthetics**: Desain Glassmorphism modern dengan transisi halus dan indikator loading yang memanjakan mata.

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| **📇 ID Card Gen** | Generator kartu identitas kustom dengan antarmuka seret-lepas (*drag-and-drop*). |
| **📚 Prompt Library** | Galeri prompt AI yang dikurasi, lengkap dengan fitur pencarian cerdas dan kategori. |
| **📖 Storyteller** | Ubah ide menjadi narasi visual (gambar + cerita) dalam hitungan detik. |
| **🎬 Video Prompt** | Rancang skrip visual dan adegan detail untuk generator video AI (Sora, Runway, dll). |

---

## 🛠️ Teknologi & Arsitektur

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Glassmorphism Design System
- **Icons**: Lucide React & Custom Animated Icons
- **Auth**: NextAuth.js (Google & Facebook Integration)
- **Email**: Nodemailer for automated submissions
- **PWA**: Siap diinstal di perangkat mobile Anda untuk akses instan.

---

## 🏗️ Cara Memulai (Local Development)

1. **Clone & Install**:
   ```bash
   git clone https://github.com/ruangriung/ruangriung-generator-app.git
   cd ruangriung-generator-app
   pnpm install
   ```

2. **Environment Setup**:
   Salin `.env.example` (atau gunakan daftar di bawah) ke `.env.local` dan lengkapi kredensialnya:
   - `NEXTAUTH_SECRET`: Kode rahasia autentikasi.
   - `GOOGLE_CLIENT_ID` / `SECRET`: Untuk login Google.
   - `NODEMAILER_EMAIL` / `APP_PASSWORD`: Untuk sistem pengiriman formulir.
   - `NEXT_PUBLIC_POLLINATIONS_TOKEN`: Token default untuk generator gambar.

3. **Run**:
   ```bash
   pnpm dev
   ```

Akses aplikasi di [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment & Vercel

Proyek ini siap dideploy ke Vercel dengan satu klik. Pastikan Anda telah mengatur:
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Environment Variables**: Masukkan semua key dari `.env.local` ke Vercel Dashboard.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **ISC License**. Bebas digunakan dan dikembangkan kembali untuk kemajuan komunitas kreatif Indonesia.

---

**Crafted with ❤️ by [Arif Tirtana](https://github.com/ayick)**
