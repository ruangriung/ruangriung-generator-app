title: Cara Menonaktifkan Crawler Bot di Vercel, Cloudflare, dan GitHub
date: 2025-08-21
author: Tim RuangRiung
category: Web Security
tags: ['crawler', 'bot', 'vercel', 'cloudflare', 'github', 'robots.txt']
image: /v1/assets/ruangriung.png
summary: Pelajari cara memblokir atau menonaktifkan bot crawler di Vercel, Cloudflare, dan GitHub. Gunakan robots.txt, header X-Robots-Tag, middleware, hingga firewall rules untuk melindungi situs Anda dari indexing maupun scraping.
---

Bukan merasa jadi pahlawan kesiangan. Sebab, sejauh ini para konten kreator, penulis, blogger, desainer, dan "ers-ers" lainnya — cukup dirugikan oleh AI yang melakukan **crawling** tanpa sepengetahuan mereka. Konten berharga yang seharusnya dilindungi justru bisa diakses, dipelajari, bahkan diduplikasi tanpa izin.

Maka, untuk menghindari sekaligus mengurangi "kepintaran" AI yang merayapi karya kita, langkah pertama yang bisa dilakukan adalah membuat dan menempatkan file **robots.txt** di root project. Dengan begitu, setidaknya kita memberikan sinyal tegas agar bot resmi tidak lagi "merayapi" konten berharga Anda.

---

Mengelola visibilitas website sangat penting, terutama jika Anda ingin mencegah konten diindeks mesin pencari atau di-scrape oleh bot. Artikel ini membahas berbagai cara untuk **menonaktifkan bot crawler** di platform populer seperti Vercel, Cloudflare, hingga GitHub Pages.

### 1. Menggunakan robots.txt

Cara paling standar adalah melalui file `robots.txt`.

```txt
User-agent: *
Disallow: /
```

Letakkan file ini di root project (misalnya `/public/robots.txt` untuk Next.js di Vercel). Metode ini bekerja untuk crawler resmi seperti Googlebot dan Bingbot, tetapi tidak efektif melawan bot jahat.

---

### 2. Konfigurasi di Vercel

Vercel mendukung beberapa cara untuk mencegah indexing maupun scraping.

#### a. Robots.txt

Cara termudah adalah menaruh `robots.txt` di folder `/public`.

#### b. Header X-Robots-Tag

Tambahkan aturan pada `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow, noarchive, nosnippet" }
      ]
    }
  ]
}
```

Dengan cara ini, semua halaman akan memberi tahu crawler agar tidak diindeks.

#### c. Middleware Next.js

Untuk kontrol lebih detail, gunakan `middleware.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

const BLOCKLIST = /(bot|crawl|spider|AhrefsBot|MJ12bot|Semrush|DotBot)/i;

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";

  // Jika user-agent terdeteksi bot
  if (BLOCKLIST.test(ua)) {
    return new NextResponse("Forbidden — bot is blocked", { status: 403 });
  }

  // Default: lanjut, tapi tambahkan noindex
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

Middleware ini mendeteksi `User-Agent` dan langsung memblokir bot tertentu.  
Keuntungannya: lebih ketat dibanding sekadar `robots.txt`.

---

### 3. Mengatur Firewall di Cloudflare

Cloudflare menyediakan opsi lebih fleksibel:

* Aktifkan **Bot Fight Mode**.
* Buat **Firewall Rule** seperti berikut:

```
(http.user_agent contains "bot" or http.user_agent contains "crawl" or http.user_agent contains "spider")
and not (http.user_agent contains "Slackbot" or http.user_agent contains "Twitterbot")
```

* Aksi bisa diatur ke **Block** atau **Managed Challenge**.

Selain itu, gunakan **Transform Rules** untuk menambahkan header `X-Robots-Tag`.

---

### 4. GitHub Pages

Karena GitHub Pages bersifat statis, opsinya terbatas:

* Tambahkan `robots.txt` dengan aturan `Disallow: /`.
* Sertakan meta tag:

```html
<meta name="robots" content="noindex, nofollow">
```

Dengan cara ini, mesin pencari akan diberi sinyal untuk tidak mengindeks halaman GitHub Pages Anda.

---

### 5. Hard Blocking di Server Sendiri

Jika Anda mengelola server Apache atau Nginx, bisa gunakan aturan berikut:

```apache
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (bot|crawl|spider) [NC]
RewriteRule .* - [F,L]
```

Metode ini menolak request bot secara langsung, sehingga crawler tidak bisa mengakses konten Anda sama sekali.

---

### 6. Ilustrasi AI Crawling

Sebagai gambaran, crawling AI dapat divisualisasikan layaknya **laba-laba mekanis futuristik** yang berjalan di atas jaringan kabel bercahaya neon. Dengan kaki baja panjang, bot ini merayapi tiap halaman web, membaca konten, lalu menyimpannya dalam indeks raksasa.

![Ilustrasi Crawling AI](/mnt/data/A_digital_illustration_in_a_flat_and_modern_style_.png)

---

Dengan kombinasi metode ini, Anda bisa menjaga situs agar lebih aman dari indexing maupun scraping yang tidak diinginkan.
