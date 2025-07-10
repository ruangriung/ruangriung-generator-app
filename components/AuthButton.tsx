// components/AuthButton.tsx
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react"; // Impor ikon logout

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Tampilkan placeholder saat status sedang loading
    return <div className="h-[52px] w-[210px] bg-light-bg rounded-lg shadow-neumorphic-inset animate-pulse"></div>;
  }

  if (status === "authenticated") {
    return (
      // Tampilan saat sudah login dengan gaya neumorphic
      <div className="flex items-center gap-3 p-2 bg-light-bg rounded-lg shadow-neumorphic-button">
        <Image 
          src={session.user?.image || ''} 
          alt={session.user?.name || 'User Avatar'}
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="font-semibold text-gray-700 text-sm">{session.user?.name}</span>
        <button 
          onClick={() => signOut()} 
          className="ml-auto p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-full hover:bg-white"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    // Tombol login dengan gaya neumorphic
    <button 
      onClick={() => signIn('google')} 
      className="inline-flex items-center justify-center px-4 py-3 bg-light-bg text-gray-700 font-bold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset transition-all duration-150"
    >
      <img src="/google-icon.svg" alt="Google logo" className="w-5 h-5 mr-3" />
      <span>Login dengan Google</span>
    </button>
  );
}