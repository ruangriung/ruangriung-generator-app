import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Hus',
  role: 'Admin',
  description:
    'Mengulas fitur baru dan memberikan umpan balik cepat agar pengembangan alat RuangRiung tetap relevan untuk kreator.',
  bio: 'Hus menjadi mitra sparring produk yang kritis namun suportif. Ia mengetes fitur baru dari perspektif kreator agar pengembangan RuangRiung selalu tepat sasaran.',
  availability:
    'Terbuka untuk sesi uji fitur, diskusi product-market fit, dan review pengalaman pengguna.',
  location: 'Indonesia',
  imageUrl: '/author/img/hus.jpg',
  specialties: ['Umpan Balik Produk', 'Eksperimen Fitur', 'Review Cepat'],
  socials: {
    facebook: 'https://web.facebook.com/janseengan',
  },
  highlights: [
    'Mengkoordinasikan uji coba fitur baru bersama kreator aktif.',
    'Mendokumentasikan temuan usability untuk dasar iterasi produk.',
    'Memberi insight cepat mengenai prioritas pengembangan berikutnya.',
  ],
  portfolio: [
    {
      title: 'Beta Testing Generator',
      description:
        'Mengelola proses beta testing modul generator sebelum dirilis ke publik.',
    },
    {
      title: 'Review Pengalaman Pengguna',
      description:
        'Menyusun laporan pengalaman pengguna lengkap dengan rekomendasi perbaikan.',
    },
    {
      title: 'Forum Feedback Kilat',
      description:
        'Memimpin diskusi singkat untuk mengumpulkan feedback yang dapat langsung dieksekusi.',
    },
  ],
});
