import type { SocialKey } from './social-platforms';

export type SocialLinks = Partial<Record<SocialKey, string>>;

export type PortfolioItem = {
  title: string;
  description: string;
  link?: string;
};

export type Creator = {
  slug: string;
  name: string;
  role: string;
  description: string;
  bio: string;
  availability: string;
  location: string;
  imageUrl: string;
  specialties: string[];
  socials: SocialLinks;
  highlights: string[];
  portfolio: PortfolioItem[];
};

type RawCreator = Omit<Creator, 'slug'>;

const rawCreators: RawCreator[] = [
  {
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
  },
  {
    name: 'Xenopath',
    role: 'Admin',
    description:
      'Kurator visual yang rajin berbagi preset dan referensi gaya sehingga ide liar komunitas bisa diwujudkan jadi gambar.',
    bio: 'Xenopath fokus mengembangkan referensi visual dan preset yang siap dipakai oleh kreator pemula maupun senior. Ia aktif memberi review karya dan memetakan gaya visual yang sedang tren di komunitas.',
    availability:
      'Siap membantu workshop visual, review prompt, dan kolaborasi moodboard.',
    location: 'Indonesia',
    imageUrl: '/author/img/xenopath.jpg',
    specialties: ['Kurasi Prompt', 'Eksperimen Visual', 'Mentor Komunitas'],
    socials: {
      facebook: 'https://web.facebook.com/xenopati',
    },
    highlights: [
      'Mengumpulkan referensi gaya visual untuk mempercepat proses eksplorasi kreator baru.',
      'Menyiapkan preset pencahayaan dan color grading yang bisa langsung diadaptasi pada berbagai model.',
      'Mereview karya komunitas dengan catatan teknis yang mudah dipahami dan diterapkan.',
    ],
    portfolio: [
      {
        title: 'Library Preset Visual',
        description:
          'Mengembangkan kumpulan preset dan contoh prompt yang memudahkan kreator menemukan mood yang tepat.',
      },
      {
        title: 'Sesi Bedah Karya Komunitas',
        description:
          'Memimpin sesi kritik konstruktif untuk membantu kreator mengidentifikasi kekuatan dan area pengembangan.',
      },
      {
        title: 'Referensi Gaya Mingguan',
        description:
          'Mengkurasi update gaya visual populer agar komunitas selalu punya inspirasi baru untuk eksperimen.',
      },
    ],
  },
  {
    name: 'Yogi Arfianto',
    role: 'Admin',
    description:
      'Menjaga percakapan komunitas tetap hangat sambil merangkum tips teknis agar tiap kreator cepat menemukan gaya uniknya.',
    bio: 'Yogi memastikan setiap diskusi di RuangRiung berlangsung ramah dan produktif. Ia merangkum insight terbaik komunitas menjadi panduan singkat yang membantu kreator mengatasi hambatan teknis.',
    availability:
      'Terbuka untuk modul bimbingan komunitas, sesi tanya jawab, dan kolaborasi edukasi.',
    location: 'Indonesia',
    imageUrl: '/author/img/yogi-profil.jpg',
    specialties: ['Moderasi Komunitas', 'Tutorial Cepat', 'Eksperimen Gaya'],
    socials: {
      facebook: 'https://web.facebook.com/yogee.krib',
    },
    highlights: [
      'Menyusun rangkuman diskusi teknis menjadi catatan singkat yang mudah dibagikan.',
      'Mengelola sesi live Q&A untuk menjawab kendala kreator secara real time.',
      'Menjaga kultur komunitas agar kolaborasi berlangsung suportif dan inklusif.',
    ],
    portfolio: [
      {
        title: 'Digest Tips Komunitas',
        description:
          'Mengubah diskusi maraton menjadi rangkuman praktis berisi checklist langkah demi langkah.',
      },
      {
        title: 'Sesi Tanya Jawab Mingguan',
        description:
          'Memfasilitasi Q&A tematik sehingga anggota bisa mendapatkan solusi teknis tanpa menunggu lama.',
      },
      {
        title: 'Program Buddy Kreator',
        description:
          'Memasangkan kreator baru dengan mentor komunitas untuk mempercepat adaptasi dan eksplorasi.',
      },
    ],
  },
  {
    name: 'Famii',
    role: 'Admin',
    description:
      'Storyteller yang senang memadukan narasi dan visual; karyanya sering jadi inspirasi kolaborasi lintas kreator.',
    bio: 'Famii mengembangkan gaya storytelling yang menyatukan visual dan narasi emosional. Ia membantu kreator lain menerjemahkan konsep abstrak menjadi cerita yang mudah diingat audiens.',
    availability:
      'Terbuka untuk kolaborasi storytelling, produksi konten kampanye, dan sesi brainstorming.',
    location: 'Indonesia',
    imageUrl: '/author/img/famii.jpg',
    specialties: ['Storytelling', 'Kolaborasi', 'Eksperimen Karakter'],
    socials: {
      facebook: 'https://web.facebook.com/nengayu.hong',
    },
    highlights: [
      'Menggagas sesi kolaborasi lintas disiplin untuk memadukan naskah, visual, dan sound design.',
      'Menyusun kerangka cerita pendek yang siap dipakai kreator untuk konten episodik.',
      'Mendorong komunitas untuk mendokumentasikan proses kreatif sebagai aset storytelling.',
    ],
    portfolio: [
      {
        title: 'Seri Narasi Komunitas',
        description:
          'Menyusun cerita berseri yang menampilkan perjalanan kreator RuangRiung secara humanis.',
      },
      {
        title: 'Workshop Story Framework',
        description:
          'Mengajarkan kerangka storytelling agar ide liar bisa dirapikan menjadi konten yang terstruktur.',
      },
      {
        title: 'Kolaborasi Visual + Narasi',
        description:
          'Bekerja sama dengan kreator visual untuk menghadirkan konten kampanye yang konsisten.',
      },
    ],
  },
  {
    name: 'Dery Lau',
    role: 'Admin',
    description:
      'Berbagi tips editing dan workflow sehingga anggota baru cepat percaya diri menyelesaikan proyek visual mereka.',
    bio: 'Dery memecah proses editing dan lighting menjadi langkah mudah diikuti. Ia rajin membuat template workflow supaya kreator bisa fokus berkreasi tanpa tersesat pada detail teknis.',
    availability:
      'Siap bekerja sama untuk kelas editing, konsultasi workflow, dan review portofolio.',
    location: 'Indonesia',
    imageUrl: '/author/img/dery-lau.jpg',
    specialties: ['Workflow Kreatif', 'Eksperimen Lighting', 'Pendampingan'],
    socials: {
      facebook: 'https://web.facebook.com/dery.megana',
      website: 'https://www.derylau.my.id/',
    },
    highlights: [
      'Menyediakan template workflow yang membantu kreator menjaga konsistensi kualitas.',
      'Membimbing eksperimen pencahayaan melalui demo langsung dan studi kasus.',
      'Memberikan review portofolio dengan fokus pada efisiensi produksi konten.',
    ],
    portfolio: [
      {
        title: 'Template Workflow Editing',
        description:
          'Membuat template editing modular untuk proyek video pendek, kampanye brand, dan konten edukasi.',
      },
      {
        title: 'Clinic Lighting Komunitas',
        description:
          'Mengadakan sesi klinik pencahayaan untuk membantu kreator memahami karakter cahaya.',
      },
      {
        title: 'Review Portofolio Personal',
        description:
          'Memberikan umpan balik mendalam pada portofolio kreator agar siap ditawarkan ke klien.',
      },
    ],
  },
  {
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
  },
  {
    name: 'Mahidara Ratri',
    role: 'Admin',
    description:
      'Meracik panduan teknis bertahap yang membuat pembelajaran AI generator jadi lebih mudah diikuti oleh siapa saja.',
    bio: 'Mahidara merancang panduan teknis yang sabar dan terstruktur. Ia memecah konsep rumit menjadi langkah sederhana sehingga setiap orang bisa mencoba tanpa rasa takut.',
    availability:
      'Terbuka untuk menulis tutorial, membuat modul onboarding, dan sesi belajar privat.',
    location: 'Indonesia',
    imageUrl: '/author/img/mahidara.jpg',
    specialties: ['Panduan Teknis', 'Eksperimen Model', 'Pembelajaran'],
    socials: {
      facebook: 'https://web.facebook.com/ruth.andanasari',
    },
    highlights: [
      'Menghasilkan panduan teknis berformat carousel dan PDF yang mudah diikuti.',
      'Mengadakan sesi belajar kecil untuk menguji kejelasan tutorial secara langsung.',
      'Mendokumentasikan eksperimen model AI untuk referensi komunitas.',
    ],
    portfolio: [
      {
        title: 'Tutorial Langkah Demi Langkah',
        description:
          'Menyusun tutorial dengan struktur bertahap untuk berbagai tools AI yang digunakan komunitas.',
      },
      {
        title: 'Modul Onboarding Kreator',
        description:
          'Membantu kreator baru memahami ekosistem RuangRiung melalui modul onboarding yang ringkas.',
      },
      {
        title: 'Eksperimen Model AI',
        description:
          'Mendokumentasikan hasil eksperimen model untuk memperluas referensi prompt dan gaya.',
      },
    ],
  },
  {
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
  },
  {
    name: 'Nurul Sholehah Eka',
    role: 'Admin',
    description:
      'Penulis tutorial yang telaten mendokumentasikan langkah demi langkah agar semua orang bisa mencoba hal baru setiap hari.',
    bio: 'Nurul menuliskan pengalaman eksperimen hariannya menjadi catatan yang bisa diikuti kreator lain. Ia menekankan dokumentasi rinci supaya proses belajar terasa ringan dan menyenangkan.',
    availability:
      'Terbuka untuk kolaborasi penulisan panduan, dokumentasi produk, dan workshop mini.',
    location: 'Indonesia',
    imageUrl: '/author/img/uul.jpg',
    specialties: ['Penulisan Tutorial', 'Eksperimen Harian', 'Dukungan Anggota'],
    socials: {
      facebook: 'https://web.facebook.com/uul.aja',
    },
    highlights: [
      'Mendokumentasikan eksperimen harian agar kreator lain bisa replikasi dengan mudah.',
      'Menyediakan template catatan eksperimen untuk membantu anggota menjaga progres.',
      'Menjawab pertanyaan teknis dengan gaya bahasa yang ramah dan sabar.',
    ],
    portfolio: [
      {
        title: 'Jurnal Eksperimen Harian',
        description:
          'Menulis jurnal eksperimen yang merangkum parameter, hasil, dan catatan pembelajaran.',
      },
      {
        title: 'Panduan Quickstart Tools',
        description:
          'Membuat panduan quickstart untuk berbagai tools AI yang sering dipakai komunitas.',
      },
      {
        title: 'Sesi Dukungan One-on-One',
        description:
          'Memberikan bantuan personal bagi anggota yang membutuhkan penjelasan tambahan.',
      },
    ],
  },
  {
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
  },
  {
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
  },
];

const slugify = (value: string) => {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

const assignSlugs = (creators: RawCreator[]): Creator[] => {
  const slugCounts = new Map<string, number>();

  return creators.map((creator) => {
    const base = slugify(creator.name) || 'profil';
    const count = slugCounts.get(base) ?? 0;
    const nextCount = count + 1;
    slugCounts.set(base, nextCount);
    const slug = count === 0 ? base : `${base}-${nextCount}`;

    return { ...creator, slug };
  });
};

const creatorsWithSlugs = assignSlugs(rawCreators);

const creatorMap = new Map<string, Creator>(
  creatorsWithSlugs.map((creator) => [creator.slug, creator]),
);

export const creators = creatorsWithSlugs;

export const getCreatorBySlug = (slug: string) => {
  return creatorMap.get(slug);
};

export const creatorSlugs = creatorsWithSlugs.map((creator) => creator.slug);
