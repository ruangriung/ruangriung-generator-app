import React from 'react';
import Link from 'next/link';
import { Construction, Timer, Mail, MessageCircle, ArrowRight } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse transition-all duration-3000" />
      
      <div className="max-w-2xl w-full z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Logo / Icon Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Construction className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Construction</span>
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              Kami sedang melakukan pembaharuan besar untuk memberikan pengalaman yang lebih baik bagi Anda. RuangRiung akan segera kembali dengan fitur-fitur baru yang luar biasa.
            </p>

            {/* Duration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-indigo-300 text-sm font-medium mb-4">
              <Timer className="w-4 h-4" />
              <span>Kembali dalam: 1 Bulan (6 Juni 2026)</span>
            </div>

            {/* Progress Bar (Visual only) */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-8">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full w-[15%] animate-pulse" 
                style={{ width: '15%' }} 
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Sistem Update</span>
              <span>15% Selesai</span>
            </div>
          </div>

          {/* Action / Contact Section */}
          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Email</p>
                <p className="text-sm">support@ruangriung.my.id</p>
              </div>
            </div>

            <Link 
              href="https://wa.me/628123456789" 
              className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold transition-all hover:bg-green-50 hover:text-green-600 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
              Hubungi via WhatsApp
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        {/* Footer Attribution */}
        <p className="text-center mt-8 text-slate-500 text-sm">
          &copy; 2026 RuangRiung AI. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
