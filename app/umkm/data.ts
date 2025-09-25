export interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  location: string;
  whatsappNumber: string;
  tagline: string;
  heroImage: string;
  description: string;
  highlights: string[];
  products: Product[];
}

export const stores: Store[] = [
  {
    id: 'nusantara-coffee',
    name: 'Nusantara Coffee Roasters',
    category: 'Kopi Spesialti',
    location: 'Bandung, Jawa Barat',
    whatsappNumber: '6281234567001',
    tagline: 'Mempersembahkan biji kopi single origin terbaik dari seluruh Nusantara.',
    heroImage:
      'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=800&q=80',
    description:
      'Nusantara Coffee Roasters bekerja langsung dengan petani kopi Indonesia untuk menghadirkan racikan biji kopi spesialti dengan profil rasa khas wilayah. Sangat cocok untuk para penikmat kopi manual brew maupun espresso.',
    highlights: [
      'Kemitraan langsung dengan petani lokal',
      'Pengiriman biji kopi fresh roast setiap minggu',
      'Kelas edukasi brewing gratis setiap akhir pekan',
    ],
    products: [
      {
        name: 'Kopi Gayo Honey Process',
        price: 'Rp120.000 / 200gr',
        description:
          'Biji kopi Arabika dari Aceh dengan proses honey yang menghasilkan rasa manis madu dan karamel.',
        image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Blend Espresso Nusantara',
        price: 'Rp150.000 / 500gr',
        description:
          'Perpaduan biji kopi Toraja, Flores, dan Java untuk menciptakan espresso dengan body penuh dan aroma cokelat.',
        image:
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cold Brew Ready to Drink',
        price: 'Rp35.000 / botol',
        description:
          'Cold brew 100% Arabika dengan rasa lembut dan rendah asam, dikemas praktis siap minum.',
        image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'batik-pradana',
    name: 'Batik Pradana',
    category: 'Batik Tulis',
    location: 'Solo, Jawa Tengah',
    whatsappNumber: '6281234567002',
    tagline: 'Menghidupkan warisan budaya melalui batik tulis kontemporer.',
    heroImage:
      'https://images.unsplash.com/photo-1591769225440-811ad7d9e0d1?auto=format&fit=crop&w=800&q=80',
    description:
      'Batik Pradana memadukan motif klasik dengan sentuhan modern sehingga cocok dikenakan pada acara formal maupun kasual. Semua kain diproduksi secara etis oleh pengrajin lokal.',
    highlights: [
      'Menggunakan pewarna alami ramah lingkungan',
      'Motif eksklusif edisi terbatas',
      'Custom order untuk seragam kantor dan komunitas',
    ],
    products: [
      {
        name: 'Kain Batik Sekar Jagad',
        price: 'Rp750.000',
        description:
          'Kain batik tulis motif Sekar Jagad dengan kombinasi warna indigo dan sogan yang elegan.',
        image:
          'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Outer Batik Larasati',
        price: 'Rp450.000',
        description:
          'Outer wanita lengan panjang dengan potongan modern dan motif Larasati yang lembut.',
        image:
          'https://images.unsplash.com/photo-1556306535-0c0946175acc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kemeja Batik Pria Parang',
        price: 'Rp520.000',
        description:
          'Kemeja pria lengan pendek dengan motif Parang Rusak kontemporer.',
        image:
          'https://images.unsplash.com/photo-1617032212157-5563d9739dc6?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'rempah-ceria',
    name: 'Rempah Ceria',
    category: 'Bumbu Masak',
    location: 'Yogyakarta, DI Yogyakarta',
    whatsappNumber: '6281234567003',
    tagline: 'Bumbu instan rumahan dengan rasa autentik Indonesia.',
    heroImage:
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    description:
      'Rempah Ceria menghadirkan bumbu instan siap pakai tanpa bahan pengawet, dibuat dari rempah segar pilihan dan resep turun temurun.',
    highlights: [
      'Tanpa MSG dan pengawet buatan',
      'Kemasan praktis untuk sekali masak',
      'Varian rasa lengkap dari Sabang sampai Merauke',
    ],
    products: [
      {
        name: 'Bumbu Rendang Padang',
        price: 'Rp28.000',
        description:
          'Bumbu rendang siap pakai untuk 1 kg daging dengan cita rasa autentik Minang.',
        image:
          'https://images.unsplash.com/photo-1625246333195-78e88e4f226a?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bumbu Sop Buntut',
        price: 'Rp24.000',
        description:
          'Racikan rempah hangat dengan aroma pala dan cengkih untuk sop buntut nikmat.',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sambal Matah Bali',
        price: 'Rp18.000',
        description:
          'Sambal matah segar siap santap dengan paduan bawang, cabai, dan jeruk limau Bali.',
        image:
          'https://images.unsplash.com/photo-1576866209830-655ecb03902d?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kerajinan-rumah-bambu',
    name: 'Rumah Bambu Craft',
    category: 'Dekorasi Rumah',
    location: 'Garut, Jawa Barat',
    whatsappNumber: '6281234567004',
    tagline: 'Dekorasi rumah ramah lingkungan dari bambu terpilih.',
    heroImage:
      'https://images.unsplash.com/photo-1600585154340-0ef3c08cf8b3?auto=format&fit=crop&w=800&q=80',
    description:
      'Rumah Bambu Craft memproduksi berbagai kerajinan dekoratif dari bambu seperti lampu gantung, perabot kecil, dan hiasan dinding dengan desain modern minimalis.',
    highlights: [
      'Menggunakan bambu hasil panen berkelanjutan',
      'Finishing halus dengan standar ekspor',
      'Program pemberdayaan ibu rumah tangga',
    ],
    products: [
      {
        name: 'Lampu Gantung Bambu Sagara',
        price: 'Rp350.000',
        description:
          'Lampu gantung bambu dengan motif anyaman geometris, cocok untuk ruang tamu dan kafe.',
        image:
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Vas Meja Anyam',
        price: 'Rp180.000',
        description:
          'Vas dekoratif dengan pola anyaman rapat, tahan lama dan mudah dibersihkan.',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tray Sarapan Bambu',
        price: 'Rp120.000',
        description:
          'Nampan bambu dengan pegangan ergonomis dan finishing food grade.',
        image:
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kuliner-vegan-hijau',
    name: 'Vegan Hijau Bistro',
    category: 'Kuliner Sehat',
    location: 'Jakarta Selatan, DKI Jakarta',
    whatsappNumber: '6281234567005',
    tagline: 'Kuliner nabati lezat dengan bahan organik lokal.',
    heroImage:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    description:
      'Vegan Hijau Bistro menghadirkan menu plant-based yang menyehatkan tanpa mengorbankan rasa. Semua bahan berasal dari petani organik lokal.',
    highlights: [
      'Menu berubah setiap musim',
      'Tersedia paket katering sehat',
      'Konsultasi gizi bersama ahli nutrisi',
    ],
    products: [
      {
        name: 'Nasi Jeruk Tofu Steak',
        price: 'Rp55.000',
        description:
          'Nasi aromatik dengan jeruk purut disajikan bersama tofu steak dan saus jamur creamy.',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Salad Bali Bliss',
        price: 'Rp48.000',
        description:
          'Salad sayuran segar dengan dressing kacang mede dan taburan kelapa panggang.',
        image:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cold Pressed Detox',
        price: 'Rp35.000',
        description:
          'Jus cold pressed dari kale, apel hijau, dan jahe yang menyegarkan.',
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'perhiasan-perak-cahaya',
    name: 'Cahaya Silverworks',
    category: 'Perhiasan Perak',
    location: 'Kota Gede, DI Yogyakarta',
    whatsappNumber: '6281234567006',
    tagline: 'Perhiasan perak handmade dengan detail ukir tradisional.',
    heroImage:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
    description:
      'Cahaya Silverworks menghadirkan perhiasan perak sterling 925 dengan sentuhan klasik yang memadukan teknik ukir tradisional dan desain modern.',
    highlights: [
      'Garansi pembersihan perhiasan seumur hidup',
      'Paket gift set eksklusif',
      'Tersedia layanan custom engraving',
    ],
    products: [
      {
        name: 'Kalung Lotus Perak',
        price: 'Rp680.000',
        description:
          'Kalung liontin bentuk bunga lotus dengan batu moonstone.',
        image:
          'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cincin Ukir Awan',
        price: 'Rp420.000',
        description:
          'Cincin perak dengan ukiran motif awan khas Yogyakarta.',
        image:
          'https://images.unsplash.com/photo-1570418124249-cad7b3572c5b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Anting Dangle Bintang',
        price: 'Rp360.000',
        description:
          'Anting gantung ringan dengan detail bintang bertabur cubic zirconia.',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e159e81c81c?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kuliner-dodol-garut',
    name: 'Dodol Garut Kenanga',
    category: 'Oleh-oleh Tradisional',
    location: 'Garut, Jawa Barat',
    whatsappNumber: '6281234567007',
    tagline: 'Dodol legit dengan resep turun-temurun keluarga Kenanga.',
    heroImage:
      'https://images.unsplash.com/photo-1517677129300-07b130802f46?auto=format&fit=crop&w=800&q=80',
    description:
      'Dodol Garut Kenanga mempertahankan proses memasak tradisional dengan bahan alami pilihan tanpa pengawet untuk menghasilkan dodol yang legit dan tahan lama.',
    highlights: [
      'Varian rasa kekinian seperti matcha dan durian',
      'Kemasan eksklusif untuk oleh-oleh',
      'Gratis tester untuk pembelian grosir',
    ],
    products: [
      {
        name: 'Dodol Original',
        price: 'Rp30.000 / 500gr',
        description:
          'Dodol klasik dengan rasa gurih santan dan manis gula aren.',
        image:
          'https://images.unsplash.com/photo-1613472917550-68d3493f5900?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dodol Matcha',
        price: 'Rp35.000 / 500gr',
        description:
          'Perpaduan unik dodol dan matcha premium dengan aroma teh hijau yang lembut.',
        image:
          'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dodol Durian',
        price: 'Rp38.000 / 500gr',
        description:
          'Rasa durian montong yang kuat namun tetap seimbang dengan manis dodol.',
        image:
          'https://images.unsplash.com/photo-1589654317104-ff01439c4b63?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'eco-laundry',
    name: 'Eco Laundry Lab',
    category: 'Produk Kebersihan',
    location: 'Malang, Jawa Timur',
    whatsappNumber: '6281234567008',
    tagline: 'Detergen ramah lingkungan dengan teknologi enzim alami.',
    heroImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    description:
      'Eco Laundry Lab memproduksi detergen cair dan softener berbahan nabati yang efektif membersihkan sekaligus aman untuk kulit sensitif.',
    highlights: [
      'Kemasan isi ulang untuk mengurangi plastik sekali pakai',
      'Sertifikasi halal dan dermatology tested',
      'Program pengumpulan botol bekas pelanggan',
    ],
    products: [
      {
        name: 'Detergen Cair Fresh Breeze',
        price: 'Rp45.000 / 1L',
        description:
          'Detergen cair dengan aroma citrus segar dan teknologi anti-noda.',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Softener Lavender Calm',
        price: 'Rp38.000 / 900ml',
        description:
          'Pelembut pakaian dengan aroma lavender yang menenangkan, aman untuk bayi.',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Laundry Capsules Zero Waste',
        price: 'Rp68.000 / 20 kapsul',
        description:
          'Kapsul detergen larut air dengan dosis tepat, praktis dan tanpa residu plastik.',
        image:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'studio-keramik',
    name: 'Studio Keramik Lumera',
    category: 'Kerajinan Keramik',
    location: 'Bali, Indonesia',
    whatsappNumber: '6281234567009',
    tagline: 'Keramik handmade bertekstur organik untuk hunian modern.',
    heroImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description:
      'Lumera memadukan teknik putar tradisional dengan glasir eksperimental untuk menghasilkan koleksi keramik artistik bernuansa alam.',
    highlights: [
      'Setiap produk dibakar dua kali untuk daya tahan ekstra',
      'Paket workshop membuat keramik untuk wisatawan',
      'Penggunaan glasir bebas timbal',
    ],
    products: [
      {
        name: 'Set Cangkir Senja',
        price: 'Rp320.000 / set 2 pcs',
        description:
          'Cangkir espresso dengan gradasi glasir biru senja dan tekstur pasir laut.',
        image:
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Vas Ombak',
        price: 'Rp480.000',
        description:
          'Vas tinggi dengan motif ombak yang diukir manual sebelum proses pembakaran.',
        image:
          'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Piring Makan Terakota',
        price: 'Rp280.000 / set 2 pcs',
        description:
          'Piring makan terakota dengan glasir matte yang aman untuk microwave.',
        image:
          'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'aroma-therapy',
    name: 'Aroma Therapy Atelier',
    category: 'Aromaterapi',
    location: 'Bogor, Jawa Barat',
    whatsappNumber: '6281234567010',
    tagline: 'Minyak esensial dan lilin aromaterapi crafted by hand.',
    heroImage:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    description:
      'Aroma Therapy Atelier menghadirkan rangkaian minyak esensial dan lilin aromaterapi berbahan wax kedelai, diperkaya wewangian alami untuk relaksasi.',
    highlights: [
      'Bahan alami tanpa parafin',
      'Kemasan dapat dikembalikan untuk isi ulang',
      'Konsultasi aroma gratis untuk perusahaan',
    ],
    products: [
      {
        name: 'Lilin Soy Calm Night',
        price: 'Rp185.000',
        description:
          'Lilin aromaterapi dengan aroma lavender dan chamomile untuk tidur nyenyak.',
        image:
          'https://images.unsplash.com/photo-1515775538093-d2c5a1e84fc5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Essential Oil Focus Blend',
        price: 'Rp210.000 / 15ml',
        description:
          'Campuran minyak peppermint, rosemary, dan lemon untuk meningkatkan fokus.',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Room Spray Morning Dew',
        price: 'Rp120.000 / 100ml',
        description:
          'Room spray dengan aroma citrus segar yang bertahan lama.',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'tekstil-tenun',
    name: 'Tenun Pelangi Flores',
    category: 'Tekstil Tenun',
    location: 'Ende, Nusa Tenggara Timur',
    whatsappNumber: '6281234567011',
    tagline: 'Tenun ikat warna-warni dari penenun perempuan Flores.',
    heroImage:
      'https://images.unsplash.com/photo-1617032212157-5563d9739dc6?auto=format&fit=crop&w=800&q=80',
    description:
      'Tenun Pelangi Flores menghadirkan kain tenun ikat dengan pewarna alami dari tumbuhan lokal dan motif khas budaya setempat.',
    highlights: [
      'Pewarna alami dari daun indigo dan kulit kayu',
      'Setiap pembelian mendukung pendidikan anak penenun',
      'Pengiriman global dengan kemasan ramah lingkungan',
    ],
    products: [
      {
        name: 'Selendang Pelangi',
        price: 'Rp680.000',
        description:
          'Selendang tenun dengan gradasi warna cerah dan tekstur lembut.',
        image:
          'https://images.unsplash.com/photo-1584714268709-c14e6c383152?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kain Tenun Ende',
        price: 'Rp1.200.000',
        description:
          'Kain panjang motif Ende klasik yang cocok sebagai busana adat maupun dekorasi.',
        image:
          'https://images.unsplash.com/photo-1591769225440-811ad7d9e0d1?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tote Bag Tenun',
        price: 'Rp320.000',
        description:
          'Tas tote kombinasi kulit sintetis dan kain tenun warna-warni.',
        image:
          'https://images.unsplash.com/photo-1559696782-1b8e8f1c1d50?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kuliner-madu',
    name: 'Madu Hutan Lestari',
    category: 'Produk Natural',
    location: 'Kutai, Kalimantan Timur',
    whatsappNumber: '6281234567012',
    tagline: 'Madu murni panen liar dari hutan tropis Kalimantan.',
    heroImage:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
    description:
      'Madu Hutan Lestari dipanen secara berkelanjutan oleh komunitas lokal dengan menjaga kelestarian habitat lebah liar.',
    highlights: [
      'Sertifikasi organik dan bebas gula tambahan',
      'Program adopsi sarang lebah',
      'Analisis laboratorium setiap batch',
    ],
    products: [
      {
        name: 'Madu Hutan Premium',
        price: 'Rp180.000 / 500ml',
        description:
          'Madu kental dengan aroma bunga hutan dan rasa kompleks.',
        image:
          'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Madu Lemon Infused',
        price: 'Rp150.000 / 350ml',
        description:
          'Infus lemon alami yang cocok diminum hangat setiap pagi.',
        image:
          'https://images.unsplash.com/photo-1582719478141-9f48d1f9f198?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bee Pollen Granules',
        price: 'Rp95.000 / 120gr',
        description:
          'Bee pollen kaya nutrisi untuk campuran smoothie atau granola.',
        image:
          'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kriya-kulit',
    name: 'Atma Leather Studio',
    category: 'Aksesoris Kulit',
    location: 'Bandung, Jawa Barat',
    whatsappNumber: '6281234567013',
    tagline: 'Dompet dan tas kulit handmade dengan personalisasi inisial.',
    heroImage:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    description:
      'Atma Leather Studio memproduksi aksesori kulit sapi berkualitas dengan teknik saddle stitch untuk ketahanan ekstra.',
    highlights: [
      'Gratis emboss inisial',
      'Garansi perbaikan selama 2 tahun',
      'Kulit disamak nabati tanpa krom',
    ],
    products: [
      {
        name: 'Dompet Kulit Saku',
        price: 'Rp420.000',
        description:
          'Dompet lipat dengan 6 slot kartu dan kompartemen uang kertas.',
        image:
          'https://images.unsplash.com/photo-1515560570411-00a0026e608f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tas Selempang Urban',
        price: 'Rp980.000',
        description:
          'Tas selempang ringkas dengan banyak kantong untuk aktivitas harian.',
        image:
          'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gantungan Kunci Inisial',
        price: 'Rp95.000',
        description:
          'Gantungan kunci kulit dengan emboss inisial pilihan pelanggan.',
        image:
          'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'studio-daur-ulang',
    name: 'Re:Create Studio',
    category: 'Produk Daur Ulang',
    location: 'Surabaya, Jawa Timur',
    whatsappNumber: '6281234567014',
    tagline: 'Produk lifestyle dari plastik daur ulang yang trendi.',
    heroImage:
      'https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=800&q=80',
    description:
      'Re:Create Studio mengolah sampah plastik menjadi produk bernilai seperti tas, dompet, dan aksesori rumah tangga dengan desain kekinian.',
    highlights: [
      'Mengolah lebih dari 2 ton plastik setiap bulan',
      'Program workshop edukasi daur ulang',
      'Kolaborasi dengan komunitas bank sampah',
    ],
    products: [
      {
        name: 'Totebag Ocean',
        price: 'Rp260.000',
        description:
          'Tas tote dari plastik PET daur ulang dengan motif ombak biru.',
        image:
          'https://images.unsplash.com/photo-1584714268709-c14e6c383152?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Coaster Terrazzo',
        price: 'Rp140.000 / set 4 pcs',
        description:
          'Tatakan gelas motif terrazzo dari plastik campuran yang tahan panas.',
        image:
          'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Organizer Meja Pixel',
        price: 'Rp175.000',
        description:
          'Organizer meja warna-warni untuk menyimpan alat tulis dan gadget.',
        image:
          'https://images.unsplash.com/photo-1567016547715-2d3cdb6220a7?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'kopi-susu-botol',
    name: 'Kopisa Botolan',
    category: 'Minuman Siap Saji',
    location: 'Semarang, Jawa Tengah',
    whatsappNumber: '6281234567015',
    tagline: 'Kopi susu kekinian dalam botol kaca yang ramah lingkungan.',
    heroImage:
      'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=800&q=80',
    description:
      'Kopisa Botolan menawarkan pilihan kopi susu dengan campuran gula aren, vanilla, dan rempah lokal yang dikemas dalam botol kaca isi ulang.',
    highlights: [
      'Layanan berlangganan mingguan',
      'Pilihan susu oat dan almond',
      'Diskon khusus untuk komunitas',
    ],
    products: [
      {
        name: 'Kopi Susu Gula Aren',
        price: 'Rp25.000',
        description:
          'Kopi susu dengan gula aren premium dan espresso blend house blend.',
        image:
          'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Kopi Susu Pandan',
        price: 'Rp27.000',
        description:
          'Paduan espresso dengan susu pandan homemade dan aroma wangi daun pandan.',
        image:
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Latte Oat Kurma',
        price: 'Rp30.000',
        description:
          'Espresso dengan susu oat dan manis alami dari buah kurma.',
        image:
          'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export const storeCategories = Array.from(new Set(stores.map((store) => store.category))).sort((a, b) =>
  a.localeCompare(b, 'id-ID', { sensitivity: 'base' }),
);

export function getStoreById(storeId: string): Store | undefined {
  return stores.find((store) => store.id === storeId);
}
