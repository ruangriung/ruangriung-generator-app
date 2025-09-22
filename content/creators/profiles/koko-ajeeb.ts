import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Koko Ajeeb',
  role: 'Admin - Founder & CEO',
  description:
    'Visioner di balik RuangRiung yang memastikan generator AI kami ramah digunakan oleh semua anggota komunitas.',
  bio: 'Koko merancang RuangRiung sebagai ekosistem yang menyeimbangkan kebutuhan kreator, tim produk, dan mitra komunitas. Ia mengawasi strategi produk sekaligus menjaga agar setiap fitur baru diuji langsung bersama para anggota.',
  availability:
    'Terbuka untuk kolaborasi komunitas, kemitraan brand, dan sesi mentoring strategi.',
  location: 'Indonesia',
  imageUrl: '/author/img/koko-ajeeb.jpg',
  specialties: ['Strategi Komunitas', 'Eksperimen AI', 'Konten Edukatif'],
  socials: {
    facebook: 'https://web.facebook.com/koko.ajeeb',
    website: 'https://www.ruangriung.my.id',
  },
  highlights: [
    'Menginisiasi kerangka kerja product-led community agar fitur RuangRiung lahir dari kebutuhan kreator.',
    'Mengarahkan roadmap generator AI sehingga eksperimen dan pembelajaran komunitas berjalan konsisten.',
    'Membimbing tim kurator agar personal branding kreator tampil profesional dan mudah dibagikan.',
  ],
  portfolio: [
    {
      title: 'RuangRiung Generator',
      description:
        'Mengorkestrasi pengembangan platform generator AI RuangRiung dari konsep hingga peluncuran publik.',
      link: 'https://ruangriung.my.id',
    },
    {
      title: 'Program Showcase Komunitas',
      description:
        'Mendesain format showcase bulanan yang memberi ruang bagi kreator untuk mempresentasikan karya unggulan.',
    },
    {
      title: 'Kemitraan Edukasi Kreator',
      description:
        'Menggagas kolaborasi lintas komunitas untuk menghadirkan kelas kilat strategi konten dan monetisasi.',
    },
  ],
});
