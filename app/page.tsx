import Generator from '../components/Generator';
import { Wand2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-x-4">
          <Wand2 className="w-10 h-10 text-amber-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-black-700">RuangRiung AI Generator</h1>
        </div>
        <p className="text-gray-500 mt-2">Wujudkan imajinasi Anda menjadi gambar</p>
      </header>
      
      <Generator />
      
    </main>
  );
}