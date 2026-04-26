// app/tentang-kami/page.tsx
'use client';

import { ArrowLeft, Users, Heart, FacebookIcon, ContactRound } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const teamMembers = [
  { name: 'Koko Ajeeb', role: 'Admin - Founder & CEO', profileUrl: 'https://web.facebook.com/koko.ajeeb', imageUrl: '/author/img/koko-ajeeb.jpg' },
  { name: 'Xenopath', role: 'Admin', profileUrl: 'https://web.facebook.com/xenopati', imageUrl: '/author/img/xenopath.jpg' },
  { name: 'Yogi Arfianto', role: 'Admin', profileUrl: 'https://web.facebook.com/yogee.krib', imageUrl: '/author/img/yogi-profil.jpg' },
  { name: 'Famii', role: 'Admin', profileUrl: 'https://web.facebook.com/nengayu.hong', imageUrl: '/author/img/famii.jpg' },
  { name: 'Dery Lau', role: 'Admin', profileUrl: 'https://web.facebook.com/dery.megana', imageUrl: '/author/img/dery-lau.jpg' },
  { name: 'Paijem Ardian Arip', role: 'Admin', profileUrl: 'https://web.facebook.com/ardian.arip.2025', imageUrl: '/author/img/paijem.jpg' },
  { name: 'Mahidara Ratri', role: 'Admin', profileUrl: 'https://web.facebook.com/ruth.andanasari', imageUrl: '/author/img/mahidara.jpg' },
  { name: 'Nadifa Family', role: 'Admin', profileUrl: 'https://web.facebook.com/nadifa.familly', imageUrl: '/author/img/nadifa.jpg' },
  { name: 'Nurul Sholehah Eka', role: 'Admin', profileUrl: 'https://web.facebook.com/uul.aja', imageUrl: '/author/img/uul.jpg' },
  { name: 'Arif Tirtana', role: 'Kontributor & Tukang Hore', profileUrl: 'https://web.facebook.com/ayicktigabelas', imageUrl: '/author/img/arif.jpg' },
  { name: 'Hus', role: 'Admin', profileUrl: 'https://web.facebook.com/janseengan', imageUrl: '/author/img/hus.jpg' },

];

export default function TentangKamiPage() {
  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="glass-card p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 text-primary-500 relative z-10">
            <ContactRound size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Tentang RuangRiung
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
              "Dari sebuah gambar terjalin sebuah persahabatan"
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 text-primary-500">
              <Heart size={24} /> Our Story
            </h2>
            <div className="prose prose-premium dark:prose-invert">
              <p>
                Semuanya berawal dari sebuah grup Facebook yang ramai, tempat canda tawa, semangat, dan ide-ide liar tak pernah ada habisnya. Kami adalah <strong>RuangRiung</strong>, sebuah kolektif yang percaya bahwa kreativitas terbaik lahir dari kolaborasi, dukungan, dan sedikit kegilaan yang sehat.
              </p>
              <p>
                Generator AI ini adalah perwujudan dari semangat tersebut. Ini bukan sekadar alat; ini adalah kanvas digital yang kami bangun khusus untuk Anda, para pejuang kreatif yang ingin berkarya tanpa batas.
              </p>
            </div>
            <div className="pt-6">
              <a 
                href="https://web.facebook.com/groups/1182261482811767/" 
                target="_blank"
                className="glass-button w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FacebookIcon size={18} />
                Join Our Community
              </a>
            </div>
          </div>

          <div className="glass-card p-10 space-y-6 bg-slate-900/5 dark:bg-white/5">
            <h2 className="text-2xl font-black uppercase tracking-tight text-primary-500">Our Mission</h2>
            <div className="space-y-6">
              {[
                { title: 'Independent Creativity', desc: 'Memberdayakan Anda untuk mengubah imajinasi menjadi kenyataan tanpa hambatan teknis.' },
                { title: 'Digital Equality', desc: 'Menyediakan alat premium yang bisa diakses oleh siapa saja, di mana saja.' },
                { title: 'Continuous Growth', desc: 'Membangun ekosistem tempat kita bisa belajar, berbagi, dan bersenang-senang bersama.' }
              ].map((item) => (
                <div key={item.title} className="glass-inset p-5 rounded-2xl space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-widest">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center justify-center gap-3">
              <Users className="text-primary-500" /> Core Collective
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">The brains behind the Riung</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <a 
                key={index} 
                href={member.profileUrl} 
                target="_blank" 
                className="glass-card p-4 text-center group hover:scale-[1.02] transition-all"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image 
                    src={member.imageUrl} 
                    alt={member.name}
                    fill
                    className="rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ring-2 ring-slate-500/10 group-hover:ring-primary-500/30"
                  />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white truncate">
                  {member.name}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-tight text-slate-400 mb-3 truncate">
                  {member.role}
                </p>
                <div className="text-[8px] font-black uppercase tracking-widest text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/" 
            className="glass-button px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
