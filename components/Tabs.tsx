'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Image, Video, AudioLines, MessageSquare } from 'lucide-react';
import AuthButton from './AuthButton';
import Generator from '@/components/Generator';
import VideoCreator from '@/components/VideoCreator';
import AudioGenerator from '@/components/AudioGenerator';
import Chatbot from '@/components/Chatbot';

// Komponen Placeholder untuk konten yang terkunci
const LockedContent = () => (
  <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic text-center">
    <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-300">
      <Lock size={48} className="text-purple-600" />
      <h2 className="text-2xl font-bold">Fitur Terkunci</h2>
      <p className="max-w-md">
        Silakan login dengan akun Google atau Facebook Anda untuk mengakses fitur ini.
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
    // --- PERUBAHAN DI SINI ---
    { name: 'chatbot', label: 'Chatbot', icon: MessageSquare, content: <Chatbot />, isProtected: false }, 
    // --- AKHIR PERUBAHAN ---
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
    <div className="w-full max-w-4xl">
      <div className="p-2 bg-light-bg dark:bg-dark-bg rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset flex flex-wrap justify-center items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`md:flex-1 flex items-center justify-center gap-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300
                ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
                    : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500' 
                }`
              }
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="pt-8">
        {activeContent()}
      </div>
    </div>
  );
}