// app/ketentuan-layanan/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/Accordion'; // Import Accordion component
import { FileText, User, Hammer, Lightbulb, Lock, Award, RotateCw, Mail } from 'lucide-react'; // Import icons

export const metadata: Metadata = {
  title: 'Ketentuan Layanan - Ruang Riung',
};

export default function KetentuanLayananPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8"> {/* <-- PERUBAHAN: Background theme */}
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic"> {/* <-- PERUBAHAN: Background & Shadow theme */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Ketentuan Layanan</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Terakhir diperbarui: 11 Juli 2025</p>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300"> {/* <-- PERUBAHAN: Text color theme */}
          
          {/* Section 1: Penerimaan Ketentuan */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><FileText size={20}/>1. Penerimaan Ketentuan</h2>}>
            <p>
              Dengan mengakses dan menggunakan aplikasi Ruang Riung AI Generator (&quot;Layanan&quot;), Anda setuju untuk mematuhi dan terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan Layanan kami.
            </p>
            <p className="mt-2">
              Ketentuan ini berlaku untuk semua pengunjung, pengguna, dan pihak lain yang mengakses atau menggunakan Layanan.
            </p>
          </Accordion>

          {/* Section 2: Deskripsi Layanan */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Lightbulb size={20}/>2. Deskripsi Layanan</h2>}>
            <p>
              Layanan kami menyediakan alat berbasis kecerdasan buatan (AI) untuk menghasilkan gambar, ide prompt video, dan audio. Layanan ini menggunakan API pihak ketiga, termasuk Google Authentication dan Pollinations.AI.
            </p>
            <p className="mt-2">
              Tujuan utama Layanan ini adalah untuk memberdayakan kreativitas Anda dengan menyediakan alat AI yang mudah digunakan untuk berbagai kebutuhan konten digital.
            </p>
          </Accordion>

          {/* Section 3: Akun Pengguna */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><User size={20}/>3. Akun Pengguna</h2>}>
            <p>
              Untuk mengakses fitur tertentu seperti &quot;Creator Prompt Video&quot; dan &quot;Audio Generator&quot;, Anda harus mendaftar dan login menggunakan akun Google Anda. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda.
            </p>
            <p className="mt-2">
              Anda setuju untuk tidak membagikan kredensial akun Anda dengan pihak lain dan untuk segera memberitahu kami jika ada penggunaan akun Anda yang tidak sah.
            </p>
          </Accordion>

          {/* Section 4: Penggunaan yang Diizinkan */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Hammer size={20}/>4. Penggunaan yang Diizinkan</h2>}>
            <p>
              Anda setuju untuk menggunakan Layanan hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda tidak diizinkan untuk:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
              <li>Menghasilkan konten yang melanggar hukum, cabul, atau menyinggung, termasuk namun tidak terbatas pada konten yang bersifat pornografi, kekerasan, diskriminatif, atau mempromosikan kebencian.</li>
              <li>Mencoba mengakses akun pengguna lain secara tidak sah atau mengumpulkan informasi pribadi pengguna lain.</li>
              <li>Mengganggu atau merusak integritas dan kinerja server serta jaringan kami atau layanan pihak ketiga yang kami gunakan.</li>
              <li>Menggunakan Layanan untuk tujuan komersial tanpa persetujuan tertulis dari kami.</li>
              <li>Menyebarluaskan malware, virus, atau kode berbahaya lainnya melalui Layanan.</li>
            </ul>
          </Accordion>

          {/* Section 5: Hak Kekayaan Intelektual */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Lock size={20}/>5. Hak Kekayaan Intelektual</h2>}>
            <p>
              Konten yang Anda hasilkan menggunakan Layanan ini adalah milik Anda. Namun, dengan menggunakan Layanan, Anda memberikan kami lisensi non-eksklusif untuk menggunakan, mereproduksi, dan menampilkan konten tersebut sebatas untuk keperluan operasional dan promosi Layanan.
            </p>
            <p className="mt-2">
              Anda menyatakan dan menjamin bahwa Anda memiliki semua hak, kepemilikan, dan kepentingan atas konten yang Anda hasilkan atau bahwa Anda memiliki izin yang diperlukan untuk menggunakan konten tersebut.
            </p>
          </Accordion>

          {/* Section 6: Batasan Tanggung Jawab */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Award size={20}/>6. Batasan Tanggung Jawab</h2>}>
            <p>
              Layanan disediakan &quot;sebagaimana adanya&quot; dan &quot;sebagaimana tersedia&quot;. Kami tidak menjamin bahwa Layanan akan selalu bebas dari kesalahan, gangguan, atau aman dari ancaman siber.
            </p>
            <p className="mt-2">
              Sejauh diizinkan oleh hukum, Ruang Riung tidak akan bertanggung jawab atas segala kerusakan tidak langsung, insidental, khusus, konsekuensial, atau ganti rugi pun yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan Layanan.
            </p>
          </Accordion>

          {/* Section 7: Perubahan Ketentuan */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><RotateCw size={20}/>7. Perubahan Ketentuan</h2>}>
            <p>
              Kami dapat merevisi Ketentuan Layanan ini dari waktu ke waktu. Versi terbaru akan selalu diposting di halaman ini dengan tanggal &quot;Terakhir diperbarui&quot; yang direvisi.
            </p>
            <p className="mt-2">
              Dengan terus menggunakan Layanan setelah perubahan berlaku, Anda setuju untuk terikat oleh ketentuan yang telah direvisi. Jika Anda tidak setuju dengan ketentuan baru, Anda harus berhenti menggunakan Layanan.
            </p>
          </Accordion>

          {/* Section 8: Kontak */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Mail size={20}/>8. Kontak</h2>}>
            <p>
              Jika Anda memiliki pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-purple-600 dark:text-purple-400 hover:underline">Kontak</Link> kami.
            </p>
            <p className="mt-2">
              Anda juga dapat mengirimkan email langsung ke: <a href="mailto:admin@ruangriung.my.id" className="text-purple-600 dark:text-purple-400 hover:underline">admin@ruangriung.my.id</a>
            </p>
          </Accordion>

        </div>

        {/* Tombol Kembali ke Beranda */}
        <div className="mt-8 text-center">
          <Link href="https://www.ruangriung.my.id" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 dark:bg-purple-700 dark:hover:bg-purple-800">
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}
