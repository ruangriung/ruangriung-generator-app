'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PremiumLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/premium/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }), // Hanya kirim password
      });

      if (res.ok) {
        toast.success('Akses Premium Diberikan!');
        router.push('/premium');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Kata sandi salah.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mencoba login.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyle = "w-full p-3 pr-10 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="w-full max-w-sm p-8 space-y-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
            <Key className="text-purple-600" />
            Akses Halaman Premium
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Masukkan kata sandi untuk melanjutkan.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="password" className="sr-only">Kata Sandi</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
              placeholder="Kata Sandi Premium"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-purple-500"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}