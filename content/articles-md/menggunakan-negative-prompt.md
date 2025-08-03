---
title: Menggunakan Negative Prompt untuk Kontrol Lebih Baik
date: 2023-10-26
author: Ayick
---

Ini adalah contoh artikel tentang penggunaan negative prompt.

## Apa itu Negative Prompt?

Negative prompt adalah instruksi yang Anda berikan kepada model AI untuk *menghindari* menghasilkan elemen tertentu dalam output. Ini sangat berguna untuk menyempurnakan hasil dan menghilangkan hal-hal yang tidak diinginkan.

### Contoh Penggunaan

Jika Anda ingin menghasilkan gambar pemandangan tanpa mobil, Anda bisa menambahkan "no cars" atau "without cars" di negative prompt Anda.

```javascript
// Contoh kode
const prompt = "pemandangan indah";
const negativePrompt = "mobil, kendaraan, jalan raya";
generateImage(prompt, negativePrompt);
```
