'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

export default function PremiumLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // ... (logika logout tidak berubah)
    const toastId = toast.loading('Keluar dari sesi premium...');
    try {
      const response = await fetch('/premium/api/logout', { method: 'POST' });
      if (response.ok) {
        toast.success('Berhasil keluar', { id: toastId });
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Gagal untuk keluar');
      }
    } catch (error) {
      toast.error('Gagal keluar. Silakan coba lagi.', { id: toastId });
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors" // <-- TAMBAHKAN 'w-full'
    >
      <LogOut size={18} />
      <span>Keluar Sesi Premium</span>
    </button>
  );
}