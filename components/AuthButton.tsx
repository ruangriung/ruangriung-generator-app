// components/AuthButton.tsx
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-4">
        <Image 
          src={session.user?.image || ''} 
          alt={session.user?.name || 'User Avatar'}
          width={40}
          height={40}
          className="rounded-full"
        />
        <button onClick={() => signOut()} className="font-semibold text-gray-600 hover:text-purple-600 transition-colors">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')} 
      className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-bold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset transition-all duration-150"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" className="w-5 h-5 mr-3" />
      Login dengan Google
    </button>
  );
}