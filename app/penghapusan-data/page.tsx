import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Penghapusan Data - Ruang Riung',
};

export default function PenghapusanDataPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Prosedur Penghapusan Data</h1>
        <div className="space-y-4 text-gray-700">
          <p>Kami menghormati privasi Anda dan menyediakan cara bagi Anda untuk meminta penghapusan data pribadi Anda.</p>
          <p>
            Karena kami menggunakan Google Login, satu-satunya data yang kami simpan terkait dengan profil Google Anda adalah nama, alamat email, dan URL gambar profil Anda.
          </p>

          <h2 className="text-xl font-semibold pt-4">Cara Meminta Penghapusan Data</h2>
          <p>
            Untuk meminta penghapusan data Anda dari sistem kami, silakan kirim email ke alamat kontak kami dengan subjek "Permintaan Penghapusan Data".
          </p>
          <p>
            Harap kirim permintaan dari alamat email yang sama dengan yang Anda gunakan untuk login ke layanan kami. Kami akan memproses permintaan Anda dalam waktu 30 hari kerja.
          </p>
          <p className="pt-6 font-semibold">
            [... Pastikan prosedur ini sesuai dengan cara kerja aplikasi Anda ...]
          </p>
        </div>
      </div>
    </main>
  );
}