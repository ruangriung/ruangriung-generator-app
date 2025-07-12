// app/page.tsx
import { Wand2 } from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      {/* GANTI SELURUH BLOK <header> DI BAWAH INI */}
      <header className="w-full max-w-4xl mb-8 text-center">
        {/* div pembungkus untuk memastikan perataan tengah konsisten */}
        <div className="flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {/* PERBAIKAN UTAMA DI SINI */}
            <Wand2 className="text-purple-600 inline-block align-middle h-8 w-8 sm:h-10 sm:w-10 -mt-1 mr-1" />
            <span className="align-middle">RuangRiung AI Generator</span>
          </h1>
        </div>
        <p className="text-gray-500 mt-2">
          Transform your imagination into stunning visuals with AI
        </p>
      </header>
      
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <AuthButton />
      </div>
      
      <Tabs />
    </main>
  );
}