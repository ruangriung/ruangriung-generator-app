import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Nadifa Family',
  role: 'Admin',
  description:
    'Mengkurasi highlight karya komunitas dan menghadirkannya kembali sebagai inspirasi segar di kanal sosial RuangRiung.',
  bio: 'Nadifa memastikan karya terbaik komunitas tidak tenggelam. Ia mengemas ulang kontribusi anggota menjadi konten yang mudah dikonsumsi di berbagai kanal sosial.',
  availability:
    'Siap berkolaborasi untuk kurasi konten, editorial media sosial, dan campaign komunitas.',
  location: 'Indonesia',
  imageUrl: '/author/img/nadifa.jpg',
  specialties: ['Kurasi Konten', 'Media Sosial', 'Highlight Komunitas'],
  socials: {
    facebook: 'https://web.facebook.com/nadifa.familly',
  },
  highlights: [
    'Mengkurasi karya unggulan komunitas menjadi konten carousel dan video pendek.',
    'Menjaga kalender editorial agar tiap kanal sosial menghadirkan insight yang relevan.',
    'Membangun narasi apresiatif terhadap karya anggota agar engagement terus meningkat.',
  ],
  portfolio: [
    {
      title: 'Highlight Komunitas Mingguan',
      description:
        'Mengemas karya komunitas menjadi highlight mingguan di kanal sosial RuangRiung.',
    },
    {
      title: 'Editorial Konten Edukatif',
      description:
        'Mengatur jadwal konten edukatif sehingga audiens mendapatkan insight secara konsisten.',
    },
    {
      title: 'Kolaborasi Campaign Komunitas',
      description:
        'Berkoordinasi dengan admin lain untuk menjalankan campaign apresiasi lintas kanal.',
    },
  ],
});
