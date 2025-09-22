import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Paijem Ardian Arip',
  role: 'Admin',
  description:
    'Selalu hadir memberi semangat serta menghidupkan sesi live sharing agar komunitas terasa dekat tanpa jarak.',
  bio: 'Paijem menjaga energi komunitas tetap hangat melalui sesi live dan obrolan ringan. Ia memastikan setiap anggota merasa diperhatikan dan mendapat dukungan saat menampilkan karya.',
  availability:
    'Terbuka untuk kolaborasi event live, sesi apresiasi, dan program komunitas.',
  location: 'Indonesia',
  imageUrl: '/author/img/paijem.jpg',
  specialties: ['Live Sharing', 'Engagement Komunitas', 'Curator Event'],
  socials: {
    facebook: 'https://web.facebook.com/ardian.arip.2025',
  },
  highlights: [
    'Mengemas sesi live komunitas agar partisipasi audiens selalu aktif.',
    'Membangun tradisi apresiasi karya setiap pekan untuk menjaga motivasi kreator.',
    'Menjadi penghubung antara admin dan anggota saat ada kebutuhan kolaborasi cepat.',
  ],
  portfolio: [
    {
      title: 'Live Sharing RuangRiung',
      description:
        'Memimpin sesi live bertema apresiasi dan pembelajaran ringan bersama kreator pilihan.',
    },
    {
      title: 'Program Spotlight Mingguan',
      description:
        'Mengkurasi karya anggota untuk ditampilkan sebagai spotlight inspiratif.',
    },
    {
      title: 'Gathering Online Komunitas',
      description:
        'Menyiapkan agenda gathering online agar anggota baru cepat mengenal kultur komunitas.',
    },
  ],
});
