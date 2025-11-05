'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bot, List, Sparkles, X } from 'lucide-react';

const sections = [
  { id: 'tujuan', title: '1) Menentukan Tujuan Utama' },
  { id: 'audiens', title: '2) Mengenali Target Audiens' },
  { id: 'identitas', title: '3) Gaya & Identitas Konten' },
  { id: 'produksi', title: '4) Rencana Produksi & Kalender' },
  { id: 'distribusi', title: '5) Strategi Distribusi' },
  { id: 'analitik', title: '6) Evaluasi & Analisis' },
  { id: 'adaptasi', title: '7) Adaptasi & Eksperimen' },
  { id: 'story', title: '8) Mesin Cerita yang Melekat' },
  { id: 'kolaborasi', title: '9) Kolaborasi & Komunitas' },
  { id: 'etika', title: '10) Etika & Kepercayaan' },
  { id: 'template', title: 'Template Praktis & Contoh' },
  { id: 'glosarium', title: 'Glosarium Mini' },
  { id: 'faq', title: 'FAQ Singkat' },
] as const;

type Metric = {
  metric: string;
  definition: string;
  purpose: string;
  baseline: string;
};

const ANALYTICS_METRICS: Metric[] = [
  {
    metric: 'Retention',
    definition: 'Persentase durasi tonton',
    purpose: 'Validasi struktur cerita',
    baseline: '>35–45% shorts; 40%+ video 5 menit',
  },
  {
    metric: 'CTR',
    definition: 'Klik per impresi',
    purpose: 'Kualitas judul & thumbnail',
    baseline: '2–5% awal',
  },
  {
    metric: 'ER',
    definition: '(Like+komen+share) / reach',
    purpose: 'Keterlibatan emosi',
    baseline: '5–10% awal',
  },
  {
    metric: 'Conversion',
    definition: 'Tindakan lanjut (email/DM/beli)',
    purpose: 'Kesesuaian CTA',
    baseline: 'Tergantung funnel',
  },
];

export default function PlaybookStrategiBerkelanjutan() {
  const [active, setActive] = useState<(typeof sections)[number]['id']>(sections[0].id);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const opts = { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] };
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id as (typeof sections)[number]['id']);
        }
      });
    }, opts);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) {
        observer.current?.observe(el);
      }
    });

    return () => observer.current?.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const { body } = document;
    const originalOverflow = body.style.overflow;

    if (isTocOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = originalOverflow || '';
    }

    return () => {
      body.style.overflow = originalOverflow;
    };
  }, [isTocOpen]);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Playbook Strategi Kreator Berkelanjutan</h1>
          </div>
          <a
            href="#template"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 sm:w-auto"
          >
            Mulai Pakai Template
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Bahan bakar jangka panjang untuk kreator yang mau naik kelas
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
              Jadikan ide satu konten tumbuh jadi ekosistem: fondasi kuat, cerita menyentuh, kolaborasi sehat, dan etika yang bikin
              dipercaya.
            </h2>
            <p className="mt-4 text-slate-600">
              Fokus utama playbook ini adalah <span className="font-semibold">kreator Mode Profesional Facebook</span> yang ingin
              menumbuhkan profil atau halaman secara organik lalu memperluas ke kanal lain. Semua contoh dijelaskan dengan bahasa
              sehari-hari agar bisa langsung diterapkan oleh kreator pemula, pelajar, bisnis rumahan, sampai tim konten profesional.
            </p>
            <ul className="mt-5 text-slate-700 list-disc pl-5 space-y-2">
              <li>
                Mulai dari dasar (tujuan, audiens, identitas) — misalnya, pilih satu tujuan 90 hari dan gambarkan sosok penonton
                ideal seperti “Rina, admin komunitas Facebook UMKM yang cari tips live shopping”.
              </li>
              <li>
                Bangun mesin cerita, kolaborasi, dan etika — contoh: buat seri cerita 4 episode, ajak teman UKM lokal kolaborasi,
                dan selalu sebutkan sumber ide.
              </li>
              <li>
                Lengkapi dengan template, contoh copy, dan glosarium — gunakan kalender 2 minggu dan contoh CTA agar siapa pun
                bisa langsung mempraktikkan.
              </li>
            </ul>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-800">Sorotan fitur Facebook Profesional:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Aktifkan Mode Profesional di profil untuk membuka dashboard insight, monetisasi Stars, dan kotak pesan kolaborasi.</li>
                <li>Gunakan Content Inspiration di Professional Dashboard untuk menemukan topik hangat lokal sebelum membuat skrip.</li>
                <li>Jadwalkan Reels dan posting halaman lewat Meta Business Suite agar upload tetap rapi walau tim kecil.</li>
              </ul>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-2 md:grid-cols-3">
              {[
                { k: 'Retensi', v: '>45%' },
                { k: 'ER', v: '5–10%' },
                { k: 'CTR', v: '2–4%' },
                { k: 'Frekuensi', v: '3–5x/mgg' },
                { k: 'Pilar', v: '3–5' },
                { k: 'Channel', v: '3+' },
              ].map((metric) => (
                <div key={metric.k} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">{metric.k}</div>
                  <div className="text-lg font-semibold">{metric.v}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Gunakan angka panduan sebagai titik awal, lalu sesuaikan dengan data kanal Anda sendiri.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-20 grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden md:block sticky top-16 h-max">
          <nav className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-xs font-semibold text-slate-500 px-2 mb-2">Daftar Isi</div>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`block rounded-xl px-3 py-2 text-sm hover:bg-slate-100 ${
                      active === section.id ? 'bg-slate-900 text-white' : 'text-slate-700'
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-12">
          <SectionTujuan />
          <SectionAudiens />
          <SectionIdentitas />
          <SectionProduksi />
          <SectionDistribusi />
          <SectionAnalitik />
          <SectionAdaptasi />
          <SectionStory />
          <SectionKolaborasi />
          <SectionEtika />
          <SectionTemplate />
          <SectionGlosarium />
          <SectionFAQ />
        </div>
      </main>

      <button
        type="button"
        onClick={() => setIsTocOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:opacity-90 md:hidden"
        aria-label="Buka daftar isi"
      >
        <List className="h-5 w-5" aria-hidden />
      </button>

      {isTocOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup daftar isi"
            onClick={() => setIsTocOpen(false)}
            className="absolute inset-0 bg-slate-900/60"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Daftar Isi</p>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setIsTocOpen(false)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      active === section.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{section.title}</span>
                    <span className="text-xs text-slate-400">{section.id}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            Playbook ini bisa disesuaikan dengan niche apa pun. Ambil bagian yang relevan, lakukan eksperimen terukur, dan bagikan
            pembelajaran agar ekosistem kreator semakin sehat.
          </p>
          <a href="#tujuan" className="rounded-xl px-4 py-2 bg-slate-900 text-white">
            Kembali ke atas
          </a>
        </div>
      </footer>
    </div>
  );
}

function SectionTujuan() {
  return (
    <section id="tujuan" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">1) Menentukan Tujuan Utama</h3>
      <p className="mt-2 text-slate-700">
        Tujuan memberi arah untuk tema, format, dan CTA. Fokus pada satu prioritas 90 hari agar energi tidak pecah. Tujuan lain jadi
        bonus ketika Anda sudah stabil.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {[
          {
            title: 'Personal Branding',
            items: [
              'Dokumentasikan proses belajar mingguan — contohnya, ceritakan apa yang kamu kuasai setelah mencoba efek baru di CapCut dan unggah ke Reels + Stories Facebook.',
              'Cerita gagal dan pelajaran jujur — misal, jelaskan kenapa video kemarin sepi dan apa perbaikanmu minggu ini di postingan teks panjang dengan foto pendukung.',
              'Highlight karya terbaik tiap bulan — pin postingan carousel foto di profil/halaman agar pengunjung baru langsung melihat progresmu.',
            ],
          },
          {
            title: 'Penjualan Produk/Jasa',
            items: [
              'Demo sederhana (sebelum vs sesudah) — rekam produk dipakai orang biasa agar penonton mudah membayangkan hasilnya, lalu tambahkan tombol “Pesan sekarang” lewat link bio atau WhatsApp.',
              'Testimoni pelanggan awam — rekam suara atau kutip pesan WhatsApp dari pelanggan pertama sebagai bukti sosial dan unggah ke Facebook Stories dengan stiker pertanyaan.',
              'Promo terbatas dengan CTA jelas — contohnya, “Diskon 20% sampai Jumat, klik link bio untuk pesan”, lalu aktifkan fitur pengingat event di postingan.',
            ],
          },
          {
            title: 'Hiburan & Edukasi Ringan',
            items: [
              'Sketsa lucu dari masalah harian — contoh: adegan orang tua nanya pekerjaan kreator lengkap dengan punchline sederhana dan tag teman pakai fitur mention.',
              'Fun fact 30–60 detik — bacakan fakta ringan lalu beri contoh penerapan sehari-hari supaya cepat dipahami; akhiri dengan tombol “Add Yours” di Reels.',
              'Meme yang bantu orang paham konsep sulit — gunakan perbandingan gambar/teks populer untuk menjelaskan istilah teknis dan bagikan ulang ke grup komunitas.',
            ],
          },
        ].map((card) => (
          <Card key={card.title} title={card.title} items={card.items} />
        ))}
      </div>
      <AskAICallout
        question="Masih bingung memilih tujuan utama yang paling pas?"
        prompt="Bantu saya memilih tujuan 90 hari untuk Mode Profesional Facebook. Profil saya fokus pada ______ dan saya ingin tahu tujuan mana yang sebaiknya jadi prioritas."
      />
    </section>
  );
}

function SectionAudiens() {
  return (
    <section id="audiens" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">2) Mengenali Target Audiens</h3>
      <p className="mt-2 text-slate-700">
        Buat persona ringkas berisi pekerjaan, masalah utama, dan platform favorit. Validasi lewat polling, DM, atau ngobrol langsung.
        Semakin Anda mengerti bahasa audiens, semakin kuat hook di 3 detik pertama.
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <PersonaCard
          title="Mahasiswa 18–25 (TikTok/IG)"
          bullets={[
            'Durasi 15–45 detik, hook cepat dan relatable — contohnya, buka dengan pertanyaan “Siapa di sini yang masih skripsi?”',
            'Humor ringan + contoh keseharian kampus — rekam adegan antre print atau drama dosen killer.',
            'Caption singkat dengan ajakan komentar — misal, “Pilih tim nugas pagi atau begadang?”',
          ]}
        />
        <PersonaCard
          title="Profesional/Founder (LinkedIn/YouTube)"
          bullets={[
            'Bahasa formal, sertakan data dan grafik sederhana — misalnya, tampilkan tabel biaya marketing sebelum dan sesudah konten.',
            'Format studi kasus 5–10 menit dengan langkah jelas — jelaskan tahap masalah → solusi → hasil nyata.',
            'Akhiri dengan CTA ke newsletter atau lead magnet — contoh: “Unduh template pitch deck gratis di link komentar”.',
          ]}
        />
        <PersonaCard
          title="Pelaku UMKM 25–40 (Facebook Profesional)"
          bullets={[
            'Aktif di grup jual beli dan komunitas lokal — gunakan bahasa sehari-hari plus emotikon agar terasa akrab.',
            'Suka konten kombinasi teks + video pendek — bagikan Reels demo produk lalu tulis ringkasan harga di caption panjang.',
            'Responsif lewat Messenger/WhatsApp — sertakan tombol kontak dan balas pesan dalam 1×24 jam untuk menjaga algoritma pesan.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Tip cepat untuk pemula:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Tulis 3 kalimat tentang apa yang bikin audiens Anda stres — contoh: “Susah cari ide konten karena alat minim”.</li>
          <li>Sebutkan 3 hal yang bikin mereka senyum lalu jadikan sumber ide — misal, “Senang lihat before-after desain murid”.</li>
          <li>Uji lewat IG story poll atau Google Form singkat — tanyakan pilihan sederhana seperti “Lebih butuh tips edit atau naskah?”.</li>
          <li>Cek tab Insight di Professional Dashboard Facebook — lihat jam aktif utama lalu cocokkan dengan jadwal upload.</li>
        </ul>
      </div>
      <AskAICallout
        question="Belum yakin persona mana yang harus diprioritaskan?"
        prompt="Saya ingin membuat persona audiens untuk konten Facebook Mode Profesional. Target saya adalah ______. Tolong bantu susun deskripsi singkat tentang umur, kebiasaan, masalah utama, dan jam online mereka."
      />
    </section>
  );
}

function SectionIdentitas() {
  return (
    <section id="identitas" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">3) Gaya & Identitas Konten</h3>
      <p className="mt-2 text-slate-700">
        Konsistensi gaya membuat audiens mudah mengingat Anda. Tentukan tone, visual, dan nilai inti yang selalu muncul bahkan ketika
        konten berubah format.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Spec
          title="Tone of Voice"
          items={[
            'Edukasi ramah, langsung ke intinya — jelaskan langkah satu per satu tanpa istilah rumit.',
            'Gunakan analogi sederhana — misal, bandingkan algoritma dengan “satpam komplek” yang pilih konten rapi.',
            'Hindari jargon kecuali dijelaskan — kalau sebut “retensi”, langsung tambah kalimat “artinya berapa lama orang nonton”.',
            'Gunakan sapaan hangat khas Facebook — seperti “Hai teman-teman komunitas...” agar cocok untuk komentar keluarga & pelanggan.',
          ]}
        />
        <Spec
          title="Identitas Visual"
          items={[
            'Palet biru/putih/abu atau sesuaikan brand — tulis kode warna sederhana agar desain konsisten.',
            'Tipografi tegas untuk headline — contohnya, pakai font Montserrat untuk judul dan font ringan untuk isi.',
            'Gunakan pola pembuka yang sama (misal, “Hai, saya...”) — latih audiens mengenali videomu dari 2 detik pertama.',
            'Siapkan cover dan avatar berkualitas untuk profil Mode Profesional — ukuran 1:1 (profil) dan 1200×628 px (cover) agar tidak terpotong.',
          ]}
        />
        <Spec
          title="Nilai Inti"
          items={[
            'Keaslian lebih penting daripada sensasi — lebih baik cerita apa adanya meski views kecil.',
            'Transparansi proses produksi — tunjukkan behind the scenes agar penonton paham kerja kerasmu.',
            'Anti-plagiarisme & kredit jelas — cantumkan nama sumber foto, musik, atau ide inspirasi.',
            'Utamakan interaksi sehat — moderasi komentar dengan fitur “Moderation Assist” agar komunitas nyaman.',
          ]}
        />
      </div>
      <AskAICallout
        question="Masih ragu menentukan gaya bahasa atau visual?"
        prompt="Saya butuh ide tone of voice dan identitas visual untuk konten Facebook. Posisi brand saya adalah ______. Tolong berikan contoh kalimat pembuka dan kombinasi warna/font yang cocok."
      />
    </section>
  );
}

function SectionProduksi() {
  return (
    <section id="produksi" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">4) Rencana Produksi & Kalender</h3>
      <p className="mt-2 text-slate-700">
        Buat ritme produksi supaya tidak panik di hari H. Gunakan siklus bulanan: riset → naskah → produksi → edit → publikasi → review.
      </p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          <Stage k="M1" v="Riset tren, kumpulkan 20 ide, pilih 5 terbaik — cek Content Inspiration & grup Facebook lokal." />
          <Stage k="M2" v="Tulis naskah dan shot list 8–12 konten — buat skrip singkat + daftar adegan agar syuting hemat waktu." />
          <Stage k="M3" v="Batch shooting 1–2 hari, rekam VO — atur outfit seragam dan rekam suara terpisah supaya rapi." />
          <Stage k="M4" v="Editing, jadwalkan unggahan, siapkan thumbnail/caption — pakai Meta Business Suite untuk schedule Reels & posting." />
        </div>
        <p className="mt-3 text-xs text-slate-500">Gunakan Notion, Trello, atau Google Calendar untuk ceklis status tiap konten.</p>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <Card
          title="Tim Kecil"
          items={[
            'Bagikan tugas: riset, penulis naskah, editor — tulis siapa melakukan apa di dokumen Google.',
            'Simpan file di folder cloud dengan penamaan tanggal — contoh: “2024-05-brief-produk-a”.',
            'Gunakan grup chat khusus update produksi — bisa WhatsApp/Discord agar info tidak tercecer.',
          ]}
        />
        <Card
          title="Solo Creator"
          items={[
            'Gunakan template skrip 1 halaman — isi kolom hook, poin utama, dan CTA untuk setiap ide.',
            'Ambil gambar tambahan (B-roll) sekali banyak — misalnya rekam stok tangan mengetik untuk dipakai ulang.',
            'Siapkan slot buffer untuk revisi dadakan — sisakan satu hari tanpa upload agar bisa perbaiki jika perlu.',
          ]}
        />
      </div>
      <AskAICallout
        question="Jadwal produksi masih terasa berantakan?"
        prompt="Saya sedang menyusun kalender produksi konten Facebook. Tolong bantu buatkan jadwal mingguan untuk ______ (solo creator/tim kecil) dengan detail tugas harian dan alat yang bisa dipakai."
      />
    </section>
  );
}

function SectionDistribusi() {
  return (
    <section id="distribusi" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">5) Strategi Distribusi</h3>
      <p className="mt-2 text-slate-700">
        Satu konten bisa hadir di banyak format. Utamakan platform utama Anda, lalu ubah versi ringkasnya untuk kanal lain.
      </p>
      <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          title="Multi-Platform"
          items={[
            'YouTube (versi panjang) — jelaskan topik lengkap 5–8 menit dengan contoh kasus nyata.',
            'Shorts/Reels/TikTok (klip utama) — potong bagian terbaik 30 detik dengan subtitle jelas.',
            'Carousel/Thread (ringkasan teks) — ubah poin penting jadi slide atau tweet bernomor.',
          ]}
        />
        <Card
          title="Komunitas & Kolaborasi"
          items={[
            'Bagikan di grup niche — misal, komunitas Facebook UMKM dan sertakan pertanyaan pemantik.',
            'Live bareng atau duet kreator lain — pilih topik ringan seperti “Tips konten modal HP”.',
            'Balas komentar populer dengan video lanjutan — tunjukkan Anda dengar kebutuhan audiens.',
          ]}
        />
        <Card
          title="Promosi Terkendali"
          items={[
            'Boost konten pilar terbaik — pakai budget kecil Rp20 ribu/hari untuk konten edukasi utama.',
            'CTA ke newsletter atau grup WA/Discord — ajak penonton lanjut ngobrol di ruang privat.',
            'Remarketing ringan untuk konten edukasi — arahkan ulang orang yang pernah nonton 50% videomu.',
          ]}
        />
        <Card
          title="Mode Profesional Facebook"
          items={[
            'Aktifkan crossposting otomatis Reels ke halaman agar view dari follower lama ikut naik.',
            'Gunakan fitur “Kolaborasi” saat upload Reels supaya muncul di profil partner sekaligus.',
            'Manfaatkan tab Grup & Event untuk ajak audiens daftar live shopping atau kelas Zoom.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Contoh nyata:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Video YouTube 6 menit → 3 potongan Reels Facebook + Instagram → carousel LinkedIn berisi poin penting → email newsletter berisi cerita pribadi.</li>
          <li>Podcast audio → highlight quote untuk Twitter → poster tips A4 untuk komunitas sekolah → postingan grup Facebook untuk diskusi lanjutan.</li>
        </ul>
      </div>
      <AskAICallout
        question="Masih bingung menentukan jalur distribusi?"
        prompt="Saya ingin mendistribusikan konten Facebook ke beberapa kanal. Tolong buatkan strategi repurpose dari satu konten utama bertema ______ ke Reels, grup komunitas, dan email dengan contoh CTA."
      />
    </section>
  );
}

function SectionAnalitik() {
  return (
    <section id="analitik" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">6) Evaluasi & Analisis</h3>
      <p className="mt-2 text-slate-700">
        Jangan terpaku pada like. Pantau metrik yang berhubungan langsung dengan tujuan Anda. Simpan catatan sederhana tiap minggu.
      </p>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="min-w-full overflow-hidden rounded-2xl border border-slate-200 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <Th>Metrik</Th>
              <Th>Definisi</Th>
              <Th>Gunanya</Th>
              <Th>Ambang Awal</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ANALYTICS_METRICS.map((metric) => (
              <Row
                key={metric.metric}
                metric={metric.metric}
                definition={metric.definition}
                purpose={metric.purpose}
                baseline={metric.baseline}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 md:hidden">
        {ANALYTICS_METRICS.map((metric) => (
          <MetricCard key={metric.metric} {...metric} />
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Catatan mingguan sederhana:</p>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>Pilih 1 konten terbaik dan 1 yang kurang perform — contohnya, bandingkan video tips vs vlog santai.</li>
          <li>Tulis dugaan penyebab dalam 2 kalimat — misal, “Hook vlog terlalu lama, jadi banyak yang skip”.</li>
          <li>Rencanakan eksperimen untuk minggu depan — coba ubah opening atau thumbnail sesuai catatan.</li>
        </ol>
      </div>
      <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="font-semibold">Pakailah data dari Facebook Professional Dashboard:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Lihat tab Insight & Audience untuk mengecek usia, lokasi, dan jam aktif — cocokkan dengan persona yang sudah Anda buat.</li>
          <li>Gunakan laporan “Konten yang disarankan” untuk menilai topik apa yang layak diremake minggu depan.</li>
          <li>Cek fitur Monetisasi untuk memantau kelayakan Stars, Bonus Reels, atau Iklan In-Stream dan catat syarat yang belum terpenuhi.</li>
        </ul>
      </div>
      <AskAICallout
        question="Masih bingung membaca angka insight?"
        prompt="Saya melihat data insight Facebook seperti retensi, CTR, dan engagement rate. Tolong jelaskan artinya dalam bahasa sederhana dan beri saran tindakan jika retensi saya hanya ______%."
      />
    </section>
  );
}

function SectionAdaptasi() {
  return (
    <section id="adaptasi" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">7) Adaptasi & Eksperimen</h3>
      <p className="mt-2 text-slate-700">Eksperimen terukur: ubah satu variabel per iterasi, catat hasilnya, ulangi yang berhasil.</p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card
          title="Variabel Uji"
          items={[
            'Hook 3 variasi (pertanyaan, fakta, cerita) — lihat mana yang bikin penonton bertahan 10 detik di Reels Facebook.',
            'Durasi 20/40/60 detik — cocok untuk tahu panjang video favorit audiensmu dan apakah layak dipanjangkan ke Live.',
            'Caption pendek vs panjang + hashtag lokal — cek mana yang bantu reach organik lewat fitur pencarian Facebook.',
          ]}
        />
        <Card
          title="Dokumentasi"
          items={[
            'Log eksperimen mingguan — tulis hasil di spreadsheet sederhana setiap Jumat, lampirkan screenshot insight.',
            'Template A/B judul — simpan dua versi judul dan catat mana yang CTR-nya tinggi dari Professional Dashboard.',
            'Daftar kemenangan kecil tiap bulan — misalnya, “Live perdana ditonton 30 orang”, “Stars perdana diterima”.',
          ]}
        />
        <Card
          title="Pembelajaran"
          items={[
            'Ikut workshop/webinar — pilih acara gratis YouTube, Meta Boost, atau komunitas lokal.',
            'Bedah kanal mentor — tonton ulang video kreator favorit sambil catat pola bagusnya.',
            'Bikin rangkuman buku/artikel bulanan — tulis 5 poin penting supaya mudah diingat, unggah ke Notes Facebook.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Eksperimen awam yang gampang dicoba:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Rekam dua versi pembuka, minta teman pilih yang paling bikin penasaran — kirim lewat chat dan lihat respon spontan.</li>
          <li>Post di jam berbeda (pagi vs malam) selama seminggu, catat perbedaannya — cukup tulis di catatan HP.</li>
          <li>Ubah call-to-action dari “Like dong” menjadi ajakan spesifik seperti “Simpan untuk praktek weekend” — lihat apakah simpanan meningkat di insight Simpanan Facebook.</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Fitur Facebook yang mendukung eksperimen:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Gunakan “Rekomendasi untuk Anda” untuk melihat konten terkait yang sedang naik, lalu adaptasi gaya judulnya.</li>
          <li>Aktifkan uji A/B thumbnail di Meta Business Suite (jika tersedia) agar bisa bandingkan visual secara otomatis.</li>
          <li>Catat performa Live di tab Insight Live — perhatikan titik drop-off untuk mengatur ulang rundown sesi berikutnya.</li>
        </ul>
      </div>
      <AskAICallout
        question="Butuh ide eksperimen yang aman dicoba?"
        prompt="Saya ingin melakukan eksperimen konten Facebook. Kondisi saya: ______. Tolong sarankan 3 eksperimen sederhana yang bisa saya lakukan minggu ini beserta cara mengukur hasilnya."
      />
    </section>
  );
}

function SectionStory() {
  return (
    <section id="story" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">8) Mesin Cerita yang Melekat</h3>
      <p className="mt-2 text-slate-700">
        Cerita adalah bahan bakar emosional yang bikin konten diingat. Gunakan struktur sederhana agar penonton paham tanpa harus tahu
        latar belakang Anda.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card
          title="Struktur 3 Bab"
          items={[
            'Masalah: jelaskan rasa sakit penonton — contohnya, “Aku bingung atur jadwal konten sambil kerja kantoran”.',
            'Perjalanan: tunjukkan langkah yang Anda ambil — ceritakan proses coba-coba sampai menemukan cara yang pas.',
            'Hasil: bagikan perubahan yang dirasakan — misal, “Sekarang bisa posting 3 kali tanpa begadang”.',
          ]}
        />
        <Card
          title="Format Cerita"
          items={[
            'Diary harian (30 detik cerita “hari ini saya coba...”) — update singkat layaknya voice note ke teman.',
            'Serial mingguan (Episode 1–4) — tiap pekan fokus ke langkah berbeda agar penonton menanti kelanjutannya.',
            'Cerita pelanggan: tanya jawab singkat + foto/video sebelum sesudah — tunjukkan dampak nyata di kehidupan mereka dan tag akun mereka (dengan izin).',
          ]}
        />
        <Card
          title="Stok Cerita"
          items={[
            'Catat momen kecil di notes HP — tulis kejadian unik begitu selesai terjadi.',
            'Ambil foto/video BTS meski seadanya — misalnya, kamera disangga tumpukan buku.',
            'Simpan tangkapan layar komentar bagus (minta izin kalau pribadi) — gunakan untuk bukti sosial di konten berikutnya atau Album Highlights Facebook.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Contoh hook storytelling (untuk awam):</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>“Tiga bulan lalu, saya cuma punya modal 300 ribu. Ini cara saya balik modal lewat jasa desain.”</li>
          <li>“Kalau kamu sering ditanya ‘kapan lulus?’, pakai jawaban ini biar obrolan tetap sopan tapi lucu.”</li>
          <li>“Ibu saya baru paham kenapa saya jadi kreator setelah lihat angka insight ini di Facebook.”</li>
        </ul>
      </div>
      <AskAICallout
        question="Sulit menyusun cerita yang menyentuh?"
        prompt="Saya ingin membuat seri cerita Facebook tentang ______. Tolong bantu susun kerangka 3 episode (pembuka, konflik, penutup) dan contoh kalimat hook untuk setiap episodenya."
      />
    </section>
  );
}

function SectionKolaborasi() {
  return (
    <section id="kolaborasi" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">9) Kolaborasi & Komunitas</h3>
      <p className="mt-2 text-slate-700">
        Kolaborasi membuka jangkauan baru dan menjaga motivasi. Mulai dari lingkaran kecil: teman sekolah, UMKM tetangga, atau kreator
        mikro di niche serupa.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card
          title="Cara Kolab"
          items={[
            'Tukar konten (saya edit video kamu, kamu bantu script) — jelas peran agar waktu tidak saling tabrakan.',
            'Live bareng bahas topik hangat — contoh: ngobrol santai soal harga jasa kreator dan ajak audiens kirim pertanyaan lewat komentar.',
            'Buat challenge mingguan dengan hashtag khusus — misal, #30HariCeritaBisnis dan ajak posting di grup Facebook.',
          ]}
        />
        <Card
          title="Bangun Komunitas"
          items={[
            'Buka grup Facebook atau WA/Discord kecil berisi 20 orang pertama — jaga agar diskusi tetap akrab.',
            'Adakan sesi review karya tiap Jumat — gantian memberi masukan sopan dan jelas.',
            'Sediakan folder resource bersama (template, referensi) — pakai Google Drive agar mudah diakses dan sematkan di fitur “Panduan” grup.',
          ]}
        />
        <Card
          title="Dukungan Psikologis"
          items={[
            'Rutin tanya kabar rekan kreator — kirim pesan “Ada yang bisa dibantu?” seminggu sekali.',
            'Rayakan pencapaian kecil bersama — contoh, buat ucapan selamat ketika follower teman naik 1000.',
            'Buat jadwal coworking online (Zoom 60 menit) — nyalakan kamera sambil kerja agar merasa ditemani, lalu bagikan link rekaman di grup.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Checklist kirim pitch kolaborasi:</p>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>Sebut nama dan alasan spesifik kenapa tertarik — contoh: “Aku suka cara kamu jelasin finansial dengan bahasa ringan”.</li>
          <li>Tawarkan ide kolab yang win-win (misal, cross-post, giveaway bareng) — jelaskan apa yang kamu siapkan.</li>
          <li>Sertakan contoh konten Anda dan angka ringkas (view rata-rata, ER) — cukup pakai 1–2 link terbaik.</li>
          <li>Tutup dengan ajakan aksi sederhana: “Kalau setuju, balas DM ini atau isi link form” — beri tenggat sopan 3 hari.</li>
        </ol>
      </div>
      <AskAICallout
        question="Butuh bantuan menulis pesan kolaborasi?"
        prompt="Saya ingin mengirim pesan kolaborasi ke kreator ______ di Facebook. Tolong buatkan draft DM yang sopan, menyebut alasan saya tertarik, ide konten bersama, dan ajakan tindak lanjut."
      />
    </section>
  );
}

function SectionEtika() {
  return (
    <section id="etika" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">10) Etika & Kepercayaan</h3>
      <p className="mt-2 text-slate-700">
        Kredibilitas tumbuh dari sikap konsisten. Cerita, kolaborasi, dan etika yang kuat bikin Anda bukan sekadar dikenal, tapi juga
        dipercaya dan diingat.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card
          title="Transparansi"
          items={[
            'Sebutkan sponsor atau penggunaan AI — cukup tambahkan teks “Video ini disponsori oleh...”',
            'Cantumkan sumber data & kredit karya — tulis nama pemilik foto/musik di deskripsi.',
            'Respons keluhan dengan sopan dan terbuka — balas komentar negatif dengan solusi, bukan debat, gunakan fitur Moderation Assist bila perlu.',
          ]}
        />
        <Card
          title="Keamanan Data"
          items={[
            'Hindari menampilkan data pribadi tanpa izin — sensor nomor telepon/alamat dengan stiker.',
            'Blur wajah anak-anak jika belum ada persetujuan — pakai fitur blur di aplikasi edit.',
            'Gunakan musik bebas lisensi atau berbayar resmi — cek perpustakaan audio YouTube atau Artlist, atau audio bebas lisensi Reels.',
          ]}
        />
        <Card
          title="Kode Etik Komunitas"
          items={[
            'Tidak menyebar hoaks atau clickbait menyesatkan — pastikan judul sesuai isi.',
            'Jujur soal hasil: tampilkan proses, bukan cuma sukses — ceritakan juga tantangan dan kegagalan.',
            'Siapkan SOP menghadapi hate speech (moderasi komentar) — tulis aturan di deskripsi/live chat dan pin di bagian “Peraturan Grup”.',
          ]}
        />
      </div>
      <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <p className="font-semibold">Langkah cepat bangun kepercayaan:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Buat halaman “Disclaimer” atau “Tentang” singkat yang menjelaskan nilai Anda — bisa ditaruh di link bio.</li>
          <li>Jawab minimal 5 komentar setiap posting dalam 1 jam pertama — gunakan jawaban hangat seperti ngobrol langsung.</li>
          <li>Kalau salah, revisi konten dan jelaskan pembaruan secara terbuka — tulis “Update: angka yang benar adalah...” di caption dan gunakan fitur edit posting Facebook.</li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Checklist etika khusus Facebook Profesional:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Aktifkan label “Konten Bermerek” ketika bekerja sama dengan brand agar mematuhi kebijakan Facebook.</li>
          <li>Atur preferensi moderasi kata kunci di Professional Dashboard untuk menyaring komentar spam.</li>
          <li>Simpan arsip live penting dan berikan akses ulang hanya untuk anggota komunitas yang sudah mendaftar.</li>
        </ul>
      </div>
      <AskAICallout
        question="Takut salah langkah soal etika atau kebijakan?"
        prompt="Saya ingin memastikan konten Facebook saya mematuhi kebijakan. Tolong jelaskan aturan utama untuk ______ (misal, konten bermerek, penggunaan musik, data pelanggan) dan beri contoh kalimat transparansi yang bisa saya pakai."
      />
    </section>
  );
}

function SectionTemplate() {
  return (
    <section id="template" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">Template Praktis & Contoh</h3>
      <div className="mt-4 grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Template Pilar Konten (isi cepat)</h4>
          <div className="mt-3 grid md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
            <Template
              t="Edukasi"
              ex={[
                'Tutorial 60 detik — tunjukkan langkah praktis seperti cara atur lighting dengan lampu meja.',
                'Mini case study — ceritakan perubahan klien sebelum dan sesudah memakai tipsmu.',
                'Myth vs Fact — luruskan salah kaprah, contohnya “Editing harus pakai laptop mahal?”.',
              ]}
            />
            <Template
              t="Inspirasi"
              ex={[
                'Kisah gagal → bangkit — bagikan momen down dan apa yang kamu pelajari.',
                'Showcase karya/audiens — tampilkan karya follower dan jelaskan prosesnya.',
                'Quote + konteks pengalaman pribadi — pilih kutipan yang kamu alami sendiri.',
              ]}
            />
            <Template
              t="Diskusi/Humor"
              ex={[
                'Hot take sopan — utarakan pendapat unik dengan alasan jelas.',
                'Meme penjelas konsep — pakai format meme populer untuk menerangkan istilah sulit.',
                'Tanya pendapat dengan opsi sederhana — misal, “Tim video horizontal atau vertikal?”.',
              ]}
            />
            <Template
              t="Facebook Profesional"
              ex={[
                'Reels demo produk + tombol Add Yours — ajak audiens ikut upload versi mereka.',
                'Status panjang dengan cerita pelanggan + link katalog WhatsApp Business.',
                'Postingan grup: tanya kabar komunitas dan selipkan survei ringan via fitur Polling.',
              ]}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Contoh Kalender 2 Minggu (4–6 konten)</h4>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
            <Cal
              title="Minggu A"
              items={[
                'Senin: Edukasi (tutorial 60 detik) — ajari cara setting tripod murah.',
                'Rabu: Inspirasi (cerita proses) — kisahkan perjalanan edit video pertama.',
                'Jumat: Diskusi (polling topik) — tanya audiens mau belajar apa minggu depan via Polling Facebook.',
              ]}
            />
            <Cal
              title="Minggu B"
              items={[
                'Selasa: Edukasi (case study) — bagikan hasil konten klien UKM setelah 2 minggu.',
                'Kamis: Humor (meme relate) — unggah meme kehidupan kreator saat deadline, mention anggota grup aktif.',
                'Sabtu: Live Q&A 30 menit — jawab pertanyaan basic sambil tunjukkan layar, jadwalkan dan promokan lewat Event Facebook.',
              ]}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">Sesuaikan slot dengan jam aktif audiens berdasarkan insight platform dan jadwalkan di Meta Business Suite agar upload tetap konsisten.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Checklist Evaluasi Bulanan</h4>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>3 konten performa terbaik dan alasannya — catat apa yang bikin penonton betah.</li>
            <li>3 hipotesis eksperimen berikutnya — tulis ide seperti “coba judul pakai angka”.</li>
            <li>Perbandingan angka retensi/CTR/ER vs bulan lalu — gunakan tabel sederhana di spreadsheet.</li>
            <li>Kolaborasi yang terjadi & tindak lanjut — misal, “Live bareng Dina, lanjut bikin e-book bersama”, “Reels kolab berhasil tembus grup X”.</li>
            <li>Perkembangan aset: email list, komunitas, library konten — cek apakah ada penambahan anggota grup Facebook.</li>
            <li>Status monetisasi: cek kelayakan Stars, Iklan In-Stream, atau Bonus Reels di Professional Dashboard.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Contoh CTA & Copy Mini</h4>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
            <Copy
              title="Edukasi"
              lines={[
                'Simpan dulu, praktekkan akhir pekan — cocok untuk penonton yang ingin mencoba pelan-pelan.',
                'Kalau membantu, kirim ke satu teman yang butuh — dorong penyebaran organik.',
              ]}
            />
            <Copy
              title="Diskusi"
              lines={[
                'Setuju atau ada sudut lain? Tulis satu kalimat di komentar — memancing cerita pribadi.',
                'Pilih A/B di polling, hasilnya dibahas besok — bikin penonton menunggu update.',
              ]}
            />
            <Copy
              title="Monetisasi"
              lines={[
                'Butuh bimbingan? DM “COACH” untuk detail — jelas siapa yang harus menghubungi dan bagaimana.',
                'Nyalakan notifikasi live + kirim Stars kalau merasa terbantu — jelaskan cara memberi dukungan.',
                'Template lengkap ada di tautan bio — arahkan ke produk digital tanpa memaksa.',
              ]}
            />
          </div>
        </div>
      </div>
      <AskAICallout
        question="Butuh template yang lebih spesifik?"
        prompt="Saya ingin template konten Facebook untuk niche ______. Tolong buatkan struktur pilar konten, contoh format Reels, caption, dan CTA yang sesuai."
      />
    </section>
  );
}

function SectionGlosarium() {
  return (
    <section id="glosarium" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">Glosarium Mini</h3>
      <p className="mt-2 text-slate-700">
        Cocok untuk teman atau klien yang baru masuk dunia konten. Simpan dan bagikan ketika ada yang bingung istilah teknis.
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-slate-700">
        <Glossary term="Hook" meaning="Kalimat/potongan pertama yang bikin penonton lanjut menonton. Contoh: “Cuma pakai lampu belajar, video kamu bisa kelihatan mahal.”" />
        <Glossary term="Retention" meaning="Seberapa lama penonton bertahan menonton konten Anda. Contoh: 45% orang menonton sampai habis berarti ceritamu kuat." />
        <Glossary term="CTR" meaning="Persentase orang yang klik konten setelah melihat thumbnail/judul. Misal, 100 orang melihat dan 5 klik berarti CTR 5%." />
        <Glossary term="ER (Engagement Rate)" meaning="Perbandingan interaksi (like, komentar, share) dengan jumlah orang yang melihat. Jika 200 orang lihat dan 20 orang berinteraksi, ER-nya 10%." />
        <Glossary term="CTA" meaning="Ajakan yang Anda ucapkan atau tulis supaya penonton melakukan tindakan tertentu, misalnya “Klik link daftar kelas gratis”." />
        <Glossary term="Funnel" meaning="Tahapan sederhana dari kenal → suka → percaya → membeli/bergabung. Contoh: lihat Reels → follow → daftar newsletter → beli template." />
        <Glossary term="Mode Profesional Facebook" meaning="Fitur yang mengubah profil pribadi jadi profil kreator lengkap dengan insight, monetisasi Stars, dan kotak pesan kolaborasi." />
        <Glossary term="Stars" meaning="Mata uang virtual di Facebook. Penonton bisa membeli dan mengirim Stars saat live atau video on-demand sebagai bentuk dukungan." />
        <Glossary term="Meta Business Suite" meaning="Dashboard gratis untuk mengatur jadwal posting, menjawab pesan, dan membaca insight Facebook + Instagram di satu tempat." />
      </div>
      <AskAICallout
        question="Masih ada istilah yang bikin bingung?"
        prompt="Saya menemukan istilah ______ saat belajar konten Facebook. Tolong jelaskan artinya dengan bahasa sehari-hari dan berikan contoh penerapannya."
      />
    </section>
  );
}

function SectionFAQ() {
  return (
    <section id="faq" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">FAQ Singkat</h3>
      <div className="mt-4 grid gap-3">
        <FAQ q="Seberapa sering harus posting?" a="Mulai 3–5 kali per minggu. Fokus konsistensi dan kualitas sinyal (retensi/ER), bukan kuantitas semata. Contoh: unggah Senin, Rabu, Jumat agar penonton tahu jadwalnya." />
        <FAQ q="Perlu semua platform?" a="Tidak. Mulai dari 1–2 kanal utama yang paling cocok dengan audiens, tambah kanal pendukung saat proses sudah stabil. Misalnya, fokus IG Reels dulu sebelum masuk YouTube." />
        <FAQ q="Kapan mulai monetisasi?" a="Saat ada tanda minat nyata: komentar tanya beli, DM konsultasi, atau trafik stabil ke aset (newsletter/website). Kumpulkan testimoni awal sebelum buka penawaran besar." />
        <FAQ q="Bagaimana kalau masih malu depan kamera?" a="Mulai dari format suara atau teks. Gunakan footage stok/B-roll dan tambahkan narasi Anda. Coba tampilkan tangan atau layar kerja sebelum berani menampilkan wajah." />
        <FAQ q="Apa saja checklist untuk Mode Profesional Facebook?" a="Pastikan konten orisinal, aktif posting minimal 5 kali dalam 30 hari, patuhi Kebijakan Monetisasi, dan aktifkan 2FA. Rajin balas pesan di kotak masuk gabungan agar badge responsif tetap hijau." />
      </div>
    </section>
  );
}

function AskAICallout({ question, prompt }: { question: string; prompt: string }) {
  const encodedPrompt = encodeURIComponent(prompt);
  const aiHref = `/asisten-ai?prompt=${encodedPrompt}&autoSend=1`;

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
          <Bot className="h-4 w-4" aria-hidden />
        </span>
        <p className="font-medium text-slate-800">{question}</p>
      </div>
      <Link
        href={aiHref}
        target="_blank"
        rel="noreferrer"
        prefetch={false}
        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
      >
        Tanyakan ke AI
      </Link>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function PersonaCard({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold">{title}</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

function Spec({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold">{title}</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Stage({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="text-left p-3 text-slate-600 text-xs uppercase tracking-wide">{children}</th>;
}

function Row({ metric, definition, purpose, baseline }: Metric) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="p-3 font-medium">{metric}</td>
      <td className="p-3 text-slate-700">{definition}</td>
      <td className="p-3 text-slate-700">{purpose}</td>
      <td className="p-3 text-slate-700">{baseline}</td>
    </tr>
  );
}

function MetricCard({ metric, definition, purpose, baseline }: Metric) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800">{metric}</p>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{baseline}</span>
      </div>
      <dl className="mt-3 space-y-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Definisi</dt>
          <dd>{definition}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gunanya</dt>
          <dd>{purpose}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ambang Awal</dt>
          <dd>{baseline}</dd>
        </div>
      </dl>
    </div>
  );
}

function Template({ t, ex }: { t: string; ex: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-sm font-semibold">{t}</div>
      <ul className="mt-1 list-disc pl-5 text-xs text-slate-700 space-y-1">
        {ex.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </div>
  );
}

function Cal({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-1 list-disc pl-5 text-xs text-slate-700 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Copy({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-1 list-disc pl-5 text-xs text-slate-700 space-y-1">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function Glossary({ term, meaning }: { term: string; meaning: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="font-semibold text-slate-800">{term}</p>
      <p className="mt-1 text-slate-600">{meaning}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full text-left p-4 font-medium flex items-center justify-between"
      >
        <span>{q}</span>
        <span className="text-slate-400">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="px-4 pb-4 text-sm text-slate-700">{a}</div> : null}
    </div>
  );
}
