// components/Tabs.tsx
'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Image, Video, AudioLines, MessageSquare } from 'lucide-react';
import AuthButton from './AuthButton';
import Generator from '@/components/Generator';
import VideoCreator from '@/components/VideoCreator';
import AudioGenerator from '@/components/AudioGenerator';
import Chatbot from '@/components/Chatbot';
import TextToVideo from '@/components/TextToVideo';

// Komponen Placeholder untuk konten yang terkunci
const LockedContent = () => (
  <div className="w-full p-8 md:p-12 glass shadow-xl rounded-[2rem] text-center animate-in fade-in zoom-in-95 duration-500">
    <div className="flex flex-col items-center gap-6 text-slate-600 dark:text-slate-300">
      <div className="h-20 w-20 rounded-full bg-primary-500/10 flex items-center justify-center">
        <Lock size={40} className="text-primary-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Fitur Terkunci</h2>
        <p className="max-w-md mx-auto text-lg">
          Silakan login untuk membuka potensi penuh dari generator AI kami.
        </p>
      </div>
      <div className="mt-4">
        <AuthButton />
      </div>
    </div>
  </div>
);

const Tabs = memo(() => {
  const [hasByopKey, setHasByopKey] = useState(false);

  useEffect(() => {
    setHasByopKey(!!localStorage.getItem('pollinations_api_key'));
  }, []);

  const tabs = useMemo(() => [
    { name: 'chatbot', label: 'Chatbot', icon: MessageSquare, content: <Chatbot />, isProtected: false, isDisabled: false },
    { 
      name: 'video', 
      label: 'Video Prompt', 
      icon: Video, 
      content: <VideoCreator />, 
      isProtected: true, 
      isDisabled: !hasByopKey 
    },
    { 
      name: 'text-to-video', 
      label: 'Text to Video', 
      icon: Video, 
      content: <TextToVideo />, 
      isProtected: true, 
      isDisabled: !hasByopKey 
    },
    { name: 'audio', label: 'Audio', icon: AudioLines, content: <AudioGenerator />, isProtected: true },
    { name: 'image', label: 'Image', icon: Image, content: <Generator />, isProtected: false }
  ], [hasByopKey]);

  const [activeTab, setActiveTab] = useState('image');
  const { status } = useSession();

  const activeContent = useMemo(() => {
    const currentTab = tabs.find(tab => tab.name === activeTab);
    if (!currentTab || currentTab.isDisabled) return null;

    if (currentTab.isProtected && status !== 'authenticated') {
      return <LockedContent />;
    }
    return currentTab.content;
  }, [activeTab, tabs, status]);

  return (
    <div className="w-full max-w-5xl">
      <div className="p-1.5 glass rounded-2xl md:rounded-full grid grid-cols-2 md:grid-cols-5 gap-1.5 mb-12">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          const isDisabled = tab.isDisabled;

          const layoutClass = index === tabs.length - 1 ? 'col-span-2 md:col-span-1' : '';

          return (
            <button
              key={tab.name}
              onClick={() => !isDisabled && setActiveTab(tab.name)}
              disabled={isDisabled}
              className={`group relative flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl md:rounded-full font-bold transition-all duration-500 ${layoutClass}
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}
                ${isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm tracking-tight">{tab.label}</span>
              
              {isDisabled && (
                <span className="absolute top-1 right-2 md:relative md:top-0 md:right-0 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse md:ml-1">
                  OFF
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
        {activeContent}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;