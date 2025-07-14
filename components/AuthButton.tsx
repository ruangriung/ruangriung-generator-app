// components/AuthButton.tsx
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // <--- PERUBAHAN: Tambahkan dark:bg-gray-700 dan dark:shadow-dark-neumorphic-inset
    return <div className="h-[52px] w-[210px] bg-light-bg dark:bg-gray-700 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset animate-pulse"></div>;
  }

  if (status === "authenticated") {
    return (
      // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic-button, dark:text-gray-200
      <div className="flex items-center gap-3 p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button">
        <Image 
          src={session.user?.image || ''} 
          alt={session.user?.name || 'User Avatar'}
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="font-semibold text-gray-700 dark:text-gray-200">{session.user?.name}</span> {/* <--- PERUBAHAN: dark:text-gray-200 */}
        <button 
          onClick={() => signOut()} 
          // <--- PERUBAHAN: Tambahkan dark:hover:bg-gray-700
          className="ml-auto p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors rounded-full hover:bg-white dark:hover:bg-gray-700" // <--- PERUBAHAN: dark:text-gray-300 dan dark:hover:bg-gray-700
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button 
        onClick={() => signIn('google')} 
        // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg, dark:shadow-dark-neumorphic-button, dark:active:shadow-dark-neumorphic-inset, dark:text-gray-200
        className="inline-flex items-center justify-center px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150"
      >
       <Image src="/google-icon.svg" alt="Google logo" width={20} height={20} className="mr-3" />
  <span>Login with Google</span>
      </button>
      <button 
        onClick={() => signIn('facebook')} 
        // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg, dark:shadow-dark-neumorphic-button, dark:active:shadow-dark-neumorphic-inset, dark:text-gray-200
        className="inline-flex items-center justify-center px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150"
      >
        <Image src="/facebook-icon.svg" alt="Facebook logo" width={20} height={20} className="w-5 h-5 mr-3" />
        <span>Login with Facebook</span>
      </button>
    </div>
  );
}