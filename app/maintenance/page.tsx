import Image from 'next/image';
import { Timer, Mail, MessageSquare, ArrowRight } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse transition-all duration-3000" />
      
      <div className="max-w-2xl w-full z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              <div className="relative p-2 rounded-3xl">
                <Image 
                  src="/assets/ruangriung.png" 
                  alt="RuangRiung Logo" 
                  width={120} 
                  height={120} 
                  className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl drop-shadow-2xl"
                  priority
                />
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

          {/* Action / Contact Section - Using Existing Project Style */}
          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</p>
                <a href="mailto:admin@ruangriung.my.id" className="text-sm font-bold text-indigo-400 hover:underline block">
                  admin@ruangriung.my.id
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Community Hub</p>
                <a href="https://web.facebook.com/groups/1182261482811767/" target="_blank" className="text-sm font-bold text-purple-400 hover:underline block">
                  RuangRiung Group
                </a>
              </div>
            </div>
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
