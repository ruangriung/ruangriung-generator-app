import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Arif Tirtana',
  role: 'Kontributor & Tukang Hore',
  description:
    'Sumber energi positif yang tak segan memberi apresiasi dan membantu kreator lain menemukan keunikan karyanya.',
  bio: 'Arif aktif menyemangati anggota komunitas melalui komentar dan diskusi ringan. Ia membantu kreator menilai keunikan karya mereka dan menghubungkan potensi kolaborasi.',
  availability:
    'Siap mendukung aktivitas apresiasi komunitas, kolaborasi acara, dan sesi mentoring ringan.',
  location: 'Indonesia',
  imageUrl: '/author/img/arif.jpg',
  specialties: ['Apresiasi Karya', 'Eksplorasi Ide', 'Kolaborasi'],
  socials: {
    facebook: 'https://web.facebook.com/ayicktigabelas',
  },
  highlights: [
    'Membangun budaya apresiasi melalui komentar dan ulasan yang konstruktif.',
    'Menghubungkan kreator dengan peluang kolaborasi yang sesuai minatnya.',
    'Menjadi fasilitator ide spontan saat komunitas membutuhkan perspektif baru.',
  ],
  portfolio: [
    {
      title: 'Program Apresiasi Harian',
      description:
        'Menjaga tradisi apresiasi harian untuk memastikan setiap karya mendapatkan perhatian.',
    },
    {
      title: 'Sesi Ide Kilat',
      description:
        'Mengadakan sesi ide kilat untuk membantu kreator keluar dari kebuntuan kreatif.',
    },
    {
      title: 'Kolaborasi Komunitas Lintas Kota',
      description:
        'Mengajak anggota dari berbagai kota untuk berkolaborasi pada proyek eksperimental.',
    },
  ],
});
