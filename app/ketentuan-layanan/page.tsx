import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan - Ruang Riung',
};

export default function KetentuanLayananPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ketentuan Layanan</h1>
        <p className="text-sm text-gray-500 mb-6">Terakhir diperbarui: 11 Juli 2025</p>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Penerimaan Ketentuan</h2>
            <p>
              Dengan mengakses dan menggunakan aplikasi Ruang Riung AI Generator ("Layanan"), Anda setuju untuk mematuhi dan terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Deskripsi Layanan</h2>
            <p>
              Layanan kami menyediakan alat berbasis kecerdasan buatan (AI) untuk menghasilkan gambar, ide prompt video, dan audio. Layanan ini menggunakan API pihak ketiga, termasuk Google Authentication dan Pollinations.AI.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Akun Pengguna</h2>
            <p>
              Untuk mengakses fitur tertentu seperti "Creator Prompt Video" dan "Audio Generator", Anda harus mendaftar dan login menggunakan akun Google Anda. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Penggunaan yang Diizinkan</h2>
            <p>
              Anda setuju untuk menggunakan Layanan hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda tidak diizinkan untuk:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>[Contoh: Menghasilkan konten yang melanggar hukum, cabul, atau menyinggung.]</li>
              <li>[Contoh: Mencoba mengakses akun pengguna lain secara tidak sah.]</li>
              <li>[Contoh: Mengganggu atau merusak integritas server dan jaringan kami.]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Hak Kekayaan Intelektual</h2>
            <p>
              Konten yang Anda hasilkan menggunakan Layanan ini adalah milik Anda. Namun, dengan menggunakan Layanan, Anda memberikan kami lisensi non-eksklusif untuk menggunakan, mereproduksi, dan menampilkan konten tersebut sebatas untuk keperluan operasional dan promosi Layanan. [Sesuaikan klausul ini sesuai dengan model bisnis Anda.]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Batasan Tanggung Jawab</h2>
            <p>
              Layanan disediakan "sebagaimana adanya". Kami tidak menjamin bahwa Layanan akan selalu bebas dari kesalahan atau gangguan. Sejauh diizinkan oleh hukum, Ruang Riung tidak akan bertanggung jawab atas segala kerusakan tidak langsung yang timbul dari penggunaan Layanan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Perubahan Ketentuan</h2>
            <p>
              Kami dapat merevisi Ketentuan Layanan ini dari waktu ke waktu. Versi terbaru akan selalu diposting di halaman ini. Dengan terus menggunakan Layanan setelah perubahan berlaku, Anda setuju untuk terikat oleh ketentuan yang telah direvisi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami melalui halaman Kontak.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}