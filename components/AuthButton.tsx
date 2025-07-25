// ruangriung/ruangriung-generator-app/components/AuthButton.tsx
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  const containerStyle = "flex items-center justify-center gap-3 p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button min-h-[52px]";

  if (status === "loading") {
    return <div className="h-[52px] w-full bg-light-bg dark:bg-gray-700 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset animate-pulse"></div>;
  }

  if (status === "authenticated") {
    // Tampilan untuk pengguna yang sudah login
    return (
      <div className={containerStyle}>
        <Image 
          // PERBAIKAN: Berikan path gambar default jika session.user?.image kosong atau null
          src={session.user?.image || '/v1/user.png'} // Menggunakan logo default dari public/v1/ruangriung.png
          alt={session.user?.name || 'User Avatar'}
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {session.user?.name || session.user?.email || 'Pengguna'} {/* Tampilkan nama atau email */}
        </span>
        <button 
          onClick={() => signOut()} 
          className="ml-auto p-2 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-700"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  // Tampilan untuk pengguna yang belum login
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4">
      <button 
        onClick={() => signIn('google')} 
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 min-h-[52px]"
      >
        <Image src="/google-icon.svg" alt="Google logo" width={20} height={20} className="mr-3" />
        <span>Login with Google</span>
      </button>
      <button 
        onClick={() => signIn('facebook')} 
        className="w-full inline-flex items-center justify-center px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 min-h-[52px]"
      >
        <Image src="/facebook-icon.svg" alt="Facebook logo" width={20} height={20} className="mr-3" /> {/* Menggunakan icon facebook.svg */}
        <span>Login with Facebook</span>
      </button>
    </div>
  );
}