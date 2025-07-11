// app/page.tsx
import { Wand2 } from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import CoinDisplay from '@/components/CoinDisplay'; // <-- Impor komponen baru

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      {/* Header sekarang sepenuhnya di tengah */}
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center gap-x-4">
          <Wand2 className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700">RuangRiung AI Generator</h1>
        </div>
        <p className="text-gray-500 mt-2">Transform your imagination into stunning visuals with AI</p>
      </header>
      
      {/* PERUBAHAN DI SINI: Bungkus tombol dan koin dalam satu div */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <AuthButton />
        <CoinDisplay />
      </div>
      
      <Tabs />
    </main>
  );
}