'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, Facebook } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-[52px] w-full glass rounded-2xl animate-pulse"></div>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-3 p-1.5 glass rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="relative group">
          <Image 
            src={session.user?.image || ''} 
            alt={session.user?.name || 'User Avatar'}
            width={36}
            height={36}
            className="rounded-xl border-2 border-primary-500/50 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
            {session.user?.name?.split(' ')[0]}
          </span>
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none">
            PRO USER
          </span>
        </div>
        <button 
          onClick={() => signOut()} 
          className="ml-2 h-9 w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl group"
          aria-label="Logout"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
      <button 
        onClick={() => signIn('google')} 
        className="group relative flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl shadow-md hover:shadow-primary-500/10 hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden text-sm w-full md:w-auto"
      >
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        <span>Google</span>
      </button>
      
      <button 
        onClick={() => signIn('facebook')} 
        className="group relative flex items-center justify-center gap-3 px-6 py-3 bg-[#0866FF] text-white font-bold rounded-2xl shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden text-sm w-full md:w-auto"
      >
        <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
          <Facebook size={18} className="text-[#0866FF] fill-[#0866FF]" />
        </div>
        <span>Facebook</span>
      </button>
    </div>
  );
}