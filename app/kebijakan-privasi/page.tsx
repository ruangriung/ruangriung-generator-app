import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Ruang Riung',
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Kebijakan Privasi</h1>
        <div className="space-y-4 text-gray-700">
          <p>Kebijakan Privasi ini menjelaskan bagaimana informasi Anda dikumpulkan, digunakan, dan dibagikan saat Anda menggunakan layanan kami.</p>
          
          <h2 className="text-xl font-semibold pt-4">Informasi yang Kami Kumpulkan</h2>
          <p>
            Saat Anda mendaftar dan login menggunakan Google, kami mengumpulkan informasi profil dasar Anda seperti nama, alamat email, dan gambar profil.
            Kami tidak menyimpan kata sandi Anda.
          </p>

          <h2 className="text-xl font-semibold pt-4">Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>
            Kami menggunakan informasi yang kami kumpulkan untuk mengoperasikan, memelihara, dan menyediakan fitur dan fungsionalitas Layanan,
            serta untuk berkomunikasi langsung dengan Anda.
          </p>

          <p className="pt-6 font-bold text-red-600">
            DISCLAIMER: Ini bukan nasihat hukum. Harap ganti teks ini dengan kebijakan privasi Anda yang sebenarnya.
          </p>
        </div>
      </div>
    </main>
  );
}