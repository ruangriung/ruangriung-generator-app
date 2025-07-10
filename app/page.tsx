import { Wand2 } from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import Generator from '@/components/Generator';
import VideoCreator from '@/components/VideoCreator';
import AudioGenerator from '@/components/AudioGenerator';

export default function Home() {
  const tabs = [
    { label: 'Image Generator', content: <Generator />, isProtected: false },
    { label: 'Creator Prompt Video', content: <VideoCreator />, isProtected: true },
    { label: 'Audio Generator', content: <AudioGenerator />, isProtected: true }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-8">
        {/* Bagian Judul */}
        <div className="flex items-center justify-center md:justify-start gap-x-4">
          <Wand2 className="w-10 h-10 text-amber-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700">Ruang Riung</h1>
        </div>
        <p className="text-gray-500 mt-2 text-center md:text-left">Wujudkan imajinasi Anda menjadi gambar, video, dan audio</p>
        
        {/* Bagian Tombol Login - di bawah header */}
        <div className="mt-4 flex justify-center md:justify-end">
          <AuthButton />
        </div>
      </header>
      
      <Tabs tabs={tabs} />
    </main>
  );
}