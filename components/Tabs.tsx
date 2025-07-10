// components/Tabs.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Image, Video, AudioLines } from 'lucide-react';
import AuthButton from './AuthButton';
import Generator from '@/components/Generator';
import VideoCreator from '@/components/VideoCreator';
import AudioGenerator from '@/components/AudioGenerator';

// Komponen Placeholder Konten Terkunci
const LockedContent = () => (
  <div className="text-center p-8">
    <div className="flex flex-col items-center gap-4 text-gray-600">
      <Lock size={48} className="text-purple-600" />
      <h2 className="text-2xl font-bold">Fitur Terkunci</h2>
      <p className="max-w-md">
        Silakan login dengan akun Google Anda untuk mengakses fitur ini.
      </p>
      <div className="mt-4">
        <AuthButton />
      </div>
    </div>
  </div>
);

export default function Tabs() {
  const tabs = [
    { name: 'image', label: 'Image', icon: Image, content: <Generator />, isProtected: false },
    { name: 'video', label: 'Video', icon: Video, content: <VideoCreator />, isProtected: true },
    { name: 'audio', label: 'Audio', icon: AudioLines, content: <AudioGenerator />, isProtected: true }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const { status } = useSession();

  const activeContent = () => {
    const currentTab = tabs.find(tab => tab.name === activeTab);
    if (!currentTab) return null;
    
    if (currentTab.isProtected && status !== 'authenticated') {
      return <LockedContent />;
    }
    return currentTab.content;
  };

  return (
    // Panel Neumorphic utama yang membungkus semuanya
    <div className="w-full max-w-4xl p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
      {/* Header Tab di dalam panel */}
      <div className="p-2 bg-light-bg rounded-xl shadow-neumorphic-inset flex items-center gap-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex-1 flex items-center justify-center gap-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300
                ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-neumorphic-button'
                    : 'text-gray-500 hover:text-purple-600'
                }`
              }
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Konten dinamis dengan jarak dari header tab */}
      <div className="mt-8">
        {activeContent()}
      </div>
    </div>
  );
}