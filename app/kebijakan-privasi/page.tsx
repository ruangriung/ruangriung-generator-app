import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Ruang Riung',
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-500 mb-6">Terakhir diperbarui: 11 Juli 2025</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan beberapa jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan Layanan kami kepada Anda.</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Data Pribadi</h3>
            <p>
              Saat menggunakan Layanan kami, terutama saat login dengan Google, kami dapat meminta Anda untuk memberikan kami informasi pengenal pribadi tertentu. Informasi ini meliputi:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Alamat Email (dari akun Google Anda)</li>
              <li>Nama Lengkap (dari akun Google Anda)</li>
              <li>URL Gambar Profil (dari akun Google Anda)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p>Ruang Riung menggunakan data yang dikumpulkan untuk berbagai tujuan:</p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Untuk menyediakan dan memelihara Layanan kami.</li>
              <li>Untuk mengelola Akun Anda dan memberikan Anda akses ke fitur-fitur yang memerlukan otentikasi.</li>
              <li>Untuk menghubungi Anda terkait pembaruan atau informasi layanan.</li>
              <li>[Jelaskan tujuan lain jika ada, misalnya untuk analisis internal.]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Penyedia Layanan Pihak Ketiga</h2>
            <p>Kami menggunakan layanan pihak ketiga untuk memfasilitasi Layanan kami ("Penyedia Layanan"), untuk menyediakan Layanan atas nama kami, atau untuk membantu kami menganalisis bagaimana Layanan kami digunakan.</p>
             <ul className="list-disc list-inside pl-4 mt-2">
              <li><strong>Google Authentication:</strong> Untuk proses login dan manajemen pengguna.</li>
              <li><strong>Pollinations.AI:</strong> Untuk memproses permintaan pembuatan gambar, video, dan audio.</li>
              <li><strong>Vercel:</strong> Untuk hosting dan deployment aplikasi.</li>
            </ul>
             <p className="mt-2">[Sebutkan layanan pihak ketiga lain yang mungkin Anda gunakan dan tautkan ke kebijakan privasi mereka.]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Keamanan Data</h2>
            <p>
              Keamanan data Anda penting bagi kami, tetapi ingatlah bahwa tidak ada metode transmisi melalui Internet, atau metode penyimpanan elektronik yang 100% aman. Meskipun kami berusaha untuk menggunakan cara yang dapat diterima secara komersial untuk melindungi Data Pribadi Anda, kami tidak dapat menjamin keamanan mutlaknya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Hak Anda</h2>
            <p>
              Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda. Silakan lihat halaman Prosedur Penghapusan Data kami untuk instruksi lebih lanjut.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}