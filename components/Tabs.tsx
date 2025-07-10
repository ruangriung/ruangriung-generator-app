// components/Tabs.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'; // Impor useSession
import { Lock } from 'lucide-react';
import AuthButton from './AuthButton'; // Impor AuthButton

interface Tab {
  label: string;
  content: React.ReactNode;
  isProtected: boolean; // Tambahkan properti untuk menandai tab yang dilindungi
}

interface TabsProps {
  tabs: Tab[];
}

// Komponen Placeholder untuk konten yang terkunci
const LockedContent = () => (
  <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic text-center">
    <div className="flex flex-col items-center gap-4 text-gray-600">
      <Lock size={48} className="text-amber-600" />
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

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { status } = useSession(); // Dapatkan status sesi

  return (
    <div className="w-full max-w-4xl">
      <div className="border-b border-gray-300">
        <div className="flex space-x-6 -mb-px">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`px-1 py-3 font-semibold text-lg border-b-4 transition-colors duration-200
                ${
                  activeTab === index
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-purple-600'
                }`
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8">
        {(() => {
          const currentTab = tabs[activeTab];
          // Jika tab dilindungi dan pengguna belum login, tampilkan konten terkunci
          if (currentTab.isProtected && status !== 'authenticated') {
            return <LockedContent />;
          }
          // Jika tidak, tampilkan konten asli
          return currentTab.content;
        })()}
      </div>
    </div>
  );
}