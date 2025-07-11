import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-200 mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <p>&copy; {currentYear} Ruang Riung. All Rights Reserved.</p>
        <div className="flex gap-x-6 mt-4 sm:mt-0">
          <Link href="/ketentuan-layanan" className="hover:text-purple-600">Ketentuan Layanan</Link>
          <Link href="/kebijakan-privasi" className="hover:text-purple-600">Kebijakan Privasi</Link>
          <Link href="/kontak" className="hover:text-purple-600">Kontak</Link>
        </div>
      </div>
    </footer>
  );
}