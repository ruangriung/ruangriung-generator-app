// ruangriung/ruangriung-generator-app/app/premium/layout.tsx
import { Suspense } from 'react';
import '../globals.css'; // Pastikan ini mengimpor globals.css dari root
import './globals.css'; // Dan ini mengimpor globals.css khusus premium (jika ada)

export const metadata = {
  title: 'RuangRiung Premium',
  description: 'Akses fitur-fitur premium RuangRiung',
};

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // PERBAIKAN: Hapus tag <html> dan <body> di sini
    // Konten ini akan di-render di dalam <body> dari app/layout.tsx
    <> 
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300">
          Memuat halaman premium...
        </div>
      }>
        {children}
      </Suspense>
    </>
  );
}