import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan - Ruang Riung',
};

export default function KetentuanLayananPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ketentuan Layanan</h1>
        <div className="space-y-4 text-gray-700">
          <p>Selamat datang di Ruang Riung AI Generator!</p>
          <p>
            Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh syarat dan ketentuan ini.
            Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diizinkan untuk menggunakan layanan kami.
          </p>

          <h2 className="text-xl font-semibold pt-4">1. Penggunaan Layanan</h2>
          <p>
            Anda setuju untuk tidak menggunakan layanan untuk tujuan ilegal atau tidak sah. Anda tidak boleh, dalam penggunaan Layanan,
            melanggar hukum apa pun di yurisdiksi Anda (termasuk namun tidak terbatas pada hukum hak cipta).
          </p>
          
          <h2 className="text-xl font-semibold pt-4">2. Konten</h2>
          <p>
            Layanan kami memungkinkan Anda untuk membuat gambar, teks, dan audio ("Konten"). Anda bertanggung jawab atas Konten yang Anda buat.
            Kami tidak mengklaim kepemilikan atas konten yang Anda hasilkan.
          </p>

          <h2 className="text-xl font-semibold pt-4">3. Perubahan pada Layanan</h2>
          <p>
            Kami berhak untuk mengubah atau menghentikan, sementara atau permanen, Layanan (atau bagian apa pun darinya)
            dengan atau tanpa pemberitahuan.
          </p>
          <p className="pt-6 font-semibold">
            [... Harap lanjutkan dengan ketentuan layanan lengkap Anda di sini ...]
          </p>
        </div>
      </div>
    </main>
  );
}