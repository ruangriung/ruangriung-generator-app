'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

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

export default function PlaybookStrategiBerkelanjutan() {
  const [active, setActive] = useState<(typeof sections)[number]['id']>(sections[0].id);
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

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-2xl bg-slate-900" />
            <h1 className="text-xl font-semibold tracking-tight">Playbook Strategi Kreator Berkelanjutan</h1>
          </div>
          <a
            href="#template"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:opacity-90"
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
              Halaman ini melanjutkan strategi dasar dengan contoh superpraktis. Cocok untuk kreator pemula, pelajar, bisnis rumahan,
              sampai tim konten profesional yang ingin membangun hubungan jangka panjang.
            </p>
            <ul className="mt-5 text-slate-700 list-disc pl-5 space-y-2">
              <li>Mulai dari dasar (tujuan, audiens, identitas) dengan contoh ringan dan bahasa sehari-hari.</li>
              <li>Bangun mesin cerita, kolaborasi, dan etika sebagai bahan bakar kepercayaan.</li>
              <li>Lengkapi dengan template, contoh copy, dan glosarium agar mudah diterapkan siapa pun.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
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
            items: ['Dokumentasikan proses belajar mingguan', 'Cerita gagal dan pelajaran jujur', 'Highlight karya terbaik tiap bulan'],
          },
          {
            title: 'Penjualan Produk/Jasa',
            items: ['Demo sederhana (sebelum vs sesudah)', 'Testimoni pelanggan awam', 'Promo terbatas dengan CTA jelas'],
          },
          {
            title: 'Hiburan & Edukasi Ringan',
            items: ['Sketsa lucu dari masalah harian', 'Fun fact 30–60 detik', 'Meme yang bantu orang paham konsep sulit'],
          },
        ].map((card) => (
          <Card key={card.title} title={card.title} items={card.items} />
        ))}
      </div>
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
          bullets={['Durasi 15–45 detik, hook cepat dan relatable', 'Humor ringan + contoh keseharian kampus', 'Caption singkat dengan ajakan komentar']}
        />
        <PersonaCard
          title="Profesional/Founder (LinkedIn/YouTube)"
          bullets={[
            'Bahasa formal, sertakan data dan grafik sederhana',
            'Format studi kasus 5–10 menit dengan langkah jelas',
            'Akhiri dengan CTA ke newsletter atau lead magnet',
          ]}
        />
      </div>
      <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-700">Tip cepat untuk pemula:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Tulis 3 kalimat tentang apa yang bikin audiens Anda stres.</li>
          <li>Sebutkan 3 hal yang bikin mereka senyum. Jadikan dua daftar ini sumber ide konten.</li>
          <li>Uji lewat IG story poll atau Google Form singkat.</li>
        </ul>
      </div>
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
          items={['Edukasi ramah, langsung ke intinya', 'Gunakan analogi sederhana', 'Hindari jargon kecuali dijelaskan']}
        />
        <Spec
          title="Identitas Visual"
          items={['Palet biru/putih/abu atau sesuaikan brand', 'Tipografi tegas untuk headline', 'Gunakan pola pembuka yang sama (misal, “Hai, saya...”)']}
        />
        <Spec title="Nilai Inti" items={['Keaslian lebih penting daripada sensasi', 'Transparansi proses produksi', 'Anti-plagiarisme & kredit jelas']} />
      </div>
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
          <Stage k="M1" v="Riset tren, kumpulkan 20 ide, pilih 5 terbaik" />
          <Stage k="M2" v="Tulis naskah dan shot list 8–12 konten" />
          <Stage k="M3" v="Batch shooting 1–2 hari, rekam VO" />
          <Stage k="M4" v="Editing, jadwalkan unggahan, siapkan thumbnail/caption" />
        </div>
        <p className="mt-3 text-xs text-slate-500">Gunakan Notion, Trello, atau Google Calendar untuk ceklis status tiap konten.</p>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <Card
          title="Tim Kecil"
          items={[
            'Bagikan tugas: riset, penulis naskah, editor',
            'Simpan file di folder cloud dengan penamaan tanggal',
            'Gunakan grup chat khusus update produksi',
          ]}
        />
        <Card
          title="Solo Creator"
          items={['Gunakan template skrip 1 halaman', 'Ambil gambar tambahan (B-roll) sekali banyak', 'Siapkan slot buffer untuk revisi dadakan']}
        />
      </div>
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
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card title="Multi-Platform" items={['YouTube (versi panjang)', 'Shorts/Reels/TikTok (klip utama)', 'Carousel/Thread (ringkasan teks)']} />
        <Card title="Komunitas & Kolaborasi" items={['Bagikan di grup niche', 'Live bareng atau duet kreator lain', 'Balas komentar populer dengan video lanjutan']} />
        <Card title="Promosi Terkendali" items={['Boost konten pilar terbaik', 'CTA ke newsletter atau grup WA/Discord', 'Remarketing ringan untuk konten edukasi']} />
      </div>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Contoh nyata:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Video YouTube 6 menit → 3 potongan TikTok → carousel LinkedIn berisi poin penting → email newsletter berisi cerita pribadi.</li>
          <li>Podcast audio → highlight quote untuk Twitter → poster tips A4 untuk komunitas sekolah.</li>
        </ul>
      </div>
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
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm border border-slate-200 rounded-2xl overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <Th>Metrik</Th>
              <Th>Definisi</Th>
              <Th>Gunanya</Th>
              <Th>Ambang Awal</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <Row m="Retention" d="Persentase durasi tonton" g="Validasi struktur cerita" a=">35–45% shorts; 40%+ video 5 menit" />
            <Row m="CTR" d="Klik per impresi" g="Kualitas judul & thumbnail" a="2–5% awal" />
            <Row m="ER" d="(Like+komen+share) / reach" g="Keterlibatan emosi" a="5–10% awal" />
            <Row m="Conversion" d="Tindakan lanjut (email/DM/beli)" g="Kesesuaian CTA" a="Tergantung funnel" />
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Catatan mingguan sederhana:</p>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>Pilih 1 konten terbaik dan 1 yang kurang perform.</li>
          <li>Tulis dugaan penyebab dalam 2 kalimat.</li>
          <li>Rencanakan eksperimen untuk minggu depan.</li>
        </ol>
      </div>
    </section>
  );
}

function SectionAdaptasi() {
  return (
    <section id="adaptasi" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">7) Adaptasi & Eksperimen</h3>
      <p className="mt-2 text-slate-700">Eksperimen terukur: ubah satu variabel per iterasi, catat hasilnya, ulangi yang berhasil.</p>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <Card title="Variabel Uji" items={['Hook 3 variasi (pertanyaan, fakta, cerita)', 'Durasi 20/40/60 detik', 'Kecepatan cut 1.0x vs 1.25x']} />
        <Card title="Dokumentasi" items={['Log eksperimen mingguan', 'Template A/B judul', 'Daftar kemenangan kecil tiap bulan']} />
        <Card title="Pembelajaran" items={['Ikut workshop/webinar', 'Bedah kanal mentor', 'Bikin rangkuman buku/artikel bulanan']} />
      </div>
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Eksperimen awam yang gampang dicoba:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Rekam dua versi pembuka, minta teman pilih yang paling bikin penasaran.</li>
          <li>Post di jam berbeda (pagi vs malam) selama seminggu, catat perbedaannya.</li>
          <li>Ubah call-to-action dari “Like dong” menjadi ajakan spesifik seperti “Simpan untuk praktek weekend”.</li>
        </ul>
      </div>
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
        <Card title="Struktur 3 Bab" items={['Masalah: jelaskan rasa sakit penonton', 'Perjalanan: tunjukkan langkah yang Anda ambil', 'Hasil: bagikan perubahan yang dirasakan']} />
        <Card
          title="Format Cerita"
          items={['Diary harian (30 detik cerita “hari ini saya coba...”)', 'Serial mingguan (Episode 1–4)', 'Cerita pelanggan: tanya jawab singkat + foto/video sebelum sesudah']}
        />
        <Card
          title="Stok Cerita"
          items={['Catat momen kecil di notes HP', 'Ambil foto/video BTS meski seadanya', 'Simpan tangkapan layar komentar bagus (minta izin kalau pribadi)']}
        />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold">Contoh hook storytelling (untuk awam):</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>“Tiga bulan lalu, saya cuma punya modal 300 ribu. Ini cara saya balik modal lewat jasa desain.”</li>
          <li>“Kalau kamu sering ditanya ‘kapan lulus?’, pakai jawaban ini biar obrolan tetap sopan tapi lucu.”</li>
          <li>“Ibu saya baru paham kenapa saya jadi kreator setelah lihat angka ini.”</li>
        </ul>
      </div>
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
        <Card title="Cara Kolab" items={['Tukar konten (saya edit video kamu, kamu bantu script)', 'Live bareng bahas topik hangat', 'Buat challenge mingguan dengan hashtag khusus']} />
        <Card title="Bangun Komunitas" items={['Buka grup WA/Discord kecil berisi 20 orang pertama', 'Adakan sesi review karya tiap Jumat', 'Sediakan folder resource bersama (template, referensi)']} />
        <Card title="Dukungan Psikologis" items={['Rutin tanya kabar rekan kreator', 'Rayakan pencapaian kecil bersama', 'Buat jadwal coworking online (Zoom 60 menit)']} />
      </div>
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Checklist kirim pitch kolaborasi:</p>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>Sebut nama dan alasan spesifik kenapa tertarik.</li>
          <li>Tawarkan ide kolab yang win-win (misal, cross-post, giveaway bareng).</li>
          <li>Sertakan contoh konten Anda dan angka ringkas (view rata-rata, ER).</li>
          <li>Tutup dengan ajakan aksi sederhana: “Kalau setuju, balas DM ini atau isi link form”.</li>
        </ol>
      </div>
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
        <Card title="Transparansi" items={['Sebutkan sponsor atau penggunaan AI', 'Cantumkan sumber data & kredit karya', 'Respons keluhan dengan sopan dan terbuka']} />
        <Card title="Keamanan Data" items={['Hindari menampilkan data pribadi tanpa izin', 'Blur wajah anak-anak jika belum ada persetujuan', 'Gunakan musik bebas lisensi atau berbayar resmi']} />
        <Card title="Kode Etik Komunitas" items={['Tidak menyebar hoaks atau clickbait menyesatkan', 'Jujur soal hasil: tampilkan proses, bukan cuma sukses', 'Siapkan SOP menghadapi hate speech (moderasi komentar)']} />
      </div>
      <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <p className="font-semibold">Langkah cepat bangun kepercayaan:</p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Buat halaman “Disclaimer” atau “Tentang” singkat yang menjelaskan nilai Anda.</li>
          <li>Jawab minimal 5 komentar setiap posting dalam 1 jam pertama.</li>
          <li>Kalau salah, revisi konten dan jelaskan pembaruan secara terbuka.</li>
        </ul>
      </div>
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
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
            <Template t="Edukasi" ex={['Tutorial 60 detik', 'Mini case study', 'Myth vs Fact']} />
            <Template t="Inspirasi" ex={['Kisah gagal → bangkit', 'Showcase karya/audiens', 'Quote + konteks pengalaman pribadi']} />
            <Template t="Diskusi/Humor" ex={['Hot take sopan', 'Meme penjelas konsep', 'Tanya pendapat dengan opsi sederhana']} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Contoh Kalender 2 Minggu (4–6 konten)</h4>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
            <Cal title="Minggu A" items={['Senin: Edukasi (tutorial 60 detik)', 'Rabu: Inspirasi (cerita proses)', 'Jumat: Diskusi (polling topik)']} />
            <Cal title="Minggu B" items={['Selasa: Edukasi (case study)', 'Kamis: Humor (meme relate)', 'Sabtu: Live Q&A 30 menit']} />
          </div>
          <p className="mt-2 text-xs text-slate-500">Sesuaikan slot dengan jam aktif audiens berdasarkan insight platform.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Checklist Evaluasi Bulanan</h4>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            <li>3 konten performa terbaik dan alasannya.</li>
            <li>3 hipotesis eksperimen berikutnya.</li>
            <li>Perbandingan angka retensi/CTR/ER vs bulan lalu.</li>
            <li>Kolaborasi yang terjadi & tindak lanjut.</li>
            <li>Perkembangan aset: email list, komunitas, library konten.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Contoh CTA & Copy Mini</h4>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
            <Copy title="Edukasi" lines={['Simpan dulu, praktekkan akhir pekan.', 'Kalau membantu, kirim ke satu teman yang butuh.']} />
            <Copy title="Diskusi" lines={['Setuju atau ada sudut lain? Tulis satu kalimat di komentar.', 'Pilih A/B di polling, hasilnya dibahas besok.']} />
            <Copy title="Monetisasi" lines={['Butuh bimbingan? DM “COACH” untuk detail.', 'Template lengkap ada di tautan bio.']} />
          </div>
        </div>
      </div>
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
        <Glossary term="Hook" meaning="Kalimat/potongan pertama yang bikin penonton lanjut menonton." />
        <Glossary term="Retention" meaning="Seberapa lama penonton bertahan menonton konten Anda." />
        <Glossary term="CTR" meaning="Persentase orang yang klik konten setelah melihat thumbnail/judul." />
        <Glossary term="ER (Engagement Rate)" meaning="Perbandingan interaksi (like, komentar, share) dengan jumlah orang yang melihat." />
        <Glossary term="CTA" meaning="Ajakan yang Anda ucapkan atau tulis supaya penonton melakukan tindakan tertentu." />
        <Glossary term="Funnel" meaning="Tahapan sederhana dari kenal → suka → percaya → membeli/bergabung." />
      </div>
    </section>
  );
}

function SectionFAQ() {
  return (
    <section id="faq" className="scroll-mt-24">
      <h3 className="text-2xl font-bold">FAQ Singkat</h3>
      <div className="mt-4 grid gap-3">
        <FAQ q="Seberapa sering harus posting?" a="Mulai 3–5 kali per minggu. Fokus konsistensi dan kualitas sinyal (retensi/ER), bukan kuantitas semata." />
        <FAQ q="Perlu semua platform?" a="Tidak. Mulai dari 1–2 kanal utama yang paling cocok dengan audiens, tambah kanal pendukung saat proses sudah stabil." />
        <FAQ q="Kapan mulai monetisasi?" a="Saat ada tanda minat nyata: komentar tanya beli, DM konsultasi, atau trafik stabil ke aset (newsletter/website)." />
        <FAQ q="Bagaimana kalau masih malu depan kamera?" a="Mulai dari format suara atau teks. Gunakan footage stok/B-roll dan tambahkan narasi Anda." />
      </div>
    </section>
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

function Row({ m, d, g, a }: { m: string; d: string; g: string; a: string }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="p-3 font-medium">{m}</td>
      <td className="p-3 text-slate-700">{d}</td>
      <td className="p-3 text-slate-700">{g}</td>
      <td className="p-3 text-slate-700">{a}</td>
    </tr>
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
