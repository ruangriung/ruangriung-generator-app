// app/tentang-kami/page.tsx
'use client';

import { ArrowLeft, Users, Heart, FacebookIcon } from 'lucide-react';
import Link from 'next/link';
import { AdBanner } from '@/components/AdBanner';
import Image from 'next/image';

const teamMembers = [
  { name: 'Koko Ajeeb', role: 'Admin - Founder & CEO', profileUrl: 'https://web.facebook.com/koko.ajeeb', imageUrl: '/author/img/koko-ajeeb.jpg' },
  { name: 'Xenopath', role: 'Admin', profileUrl: 'https://web.facebook.com/xenopati', imageUrl: '/author/img/xenopath.jpg' },
  { name: 'Yogi Arfianto', role: 'Admin', profileUrl: 'https://web.facebook.com/yogee.krib', imageUrl: '/author/img/yogi-profil.jpg' },
  { name: 'Famii', role: 'Admin', profileUrl: 'https://web.facebook.com/nengayu.hong', imageUrl: '/author/img/famii.jpg' },
  { name: 'Dery Lau', role: 'Admin', profileUrl: 'https://web.facebook.com/dery.megana', imageUrl: '/author/img/dery-lau.jpg' },
  { name: 'Paijem Ardian Arip', role: 'Admin', profileUrl: 'https://web.facebook.com/ardian.arip.2025', imageUrl: '/v1/img/placeholder-thumb.png' },
  { name: 'Mahidara Ratri', role: 'Admin', profileUrl: 'https://web.facebook.com/ruth.andanasari', imageUrl: '/author/img/mahidara.jpg' },
  { name: 'Nadifa Family', role: 'Admin', profileUrl: 'https://web.facebook.com/nadifa.familly', imageUrl: '/author/img/nadifa.jpg' },
  { name: 'Nurul Sholehah Eka', role: 'Admin', profileUrl: 'https://web.facebook.com/uul.aja', imageUrl: '/author/img/uul.jpg' },
  { name: 'Arif Tirtana', role: 'Kontributor & Tukang Hore', profileUrl: 'https://web.facebook.com/ayicktigabelas', imageUrl: '/author/img/arif.jpg' },
];

export default function TentangKamiPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ArrowLeft size={18} />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
          
          <div className="flex justify-center mb-6">
            <Heart size={48} className="text-red-500" />
          </div>

          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
            Tentang kami RuangRiung
          </h1>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
            Dari sebuah gambar terjalin sebuah persahabatan
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-justify">
            <p>
              Semuanya berawal dari sebuah grup Facebook yang ramai, dengan Motto <strong>"Dari sebuah gambar terjalin sebuah persahabatan"</strong> sebuah ruang digital tempat canda tawa, semangat, dan ide-ide liar tak pernah ada habisnya. Kami adalah <strong>RuangRiung</strong>, sebuah kolektif yang percaya bahwa kreativitas terbaik lahir dari kolaborasi, dukungan, dan sedikit kegilaan yang sehat. Visi kami sederhana: menjadi sumber inspirasi yang tak pernah kering bagi siapa saja.
            </p><br/>
            <p>
              Misi kami adalah memberdayakan Anda untuk mandiri. Kami ingin setiap orang, terlepas dari latar belakangnya, memiliki alat untuk mengubah imajinasi menjadi kenyataan. Generator AI ini adalah perwujudan dari semangat tersebut. Ini bukan sekadar alat; ini adalah kanvas digital yang kami bangun khusus untuk Anda, para pejuang kreatif yang ingin berkarya tanpa batas. Kami ingin Anda tidak lagi bergantung pada sumber daya yang mahal atau proses yang rumit. Dengan beberapa klik, ide yang dulu hanya ada di kepala kini bisa divisualisasikan, diedit, dan dibagikan ke seluruh dunia.
            </p><br/>
            <p>
              RuangRiung lebih dari sekadar aplikasi; ini adalah sebuah gerakan. Gerakan untuk terus belajar, berbagi, dan tentu saja, bersenang-senang. Kami mengundang Anda untuk tidak hanya menggunakan alat ini, tetapi juga untuk bergabung dengan percakapan hangat kami di Facebook. Jadilah bagian dari keluarga kami, tempat di mana setiap ide dihargai dan setiap karya dirayakan.
            </p>
            <p className="text-center font-semibold mt-6">
              Mari ciptakan sesuatu yang luar biasa, bersama-sama!
            </p>
          </div>

          <div className="mt-10 text-center">
            <a 
              href="https://web.facebook.com/groups/1182261482811767/" // Ganti dengan URL grup Facebook Anda yang sebenarnya
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FacebookIcon size={20} />
              Gabung Komunitas Facebook Kami
            </a>
          </div>
          
          <hr className="my-8 border-gray-300 dark:border-gray-600" />

          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 flex items-center justify-center gap-2">
              <Users className="text-purple-600" /> Tim di Balik RuangRiung
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {teamMembers.map((member, index) => (
                <a 
                  key={index} 
                  href={member.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset transition-all text-center"
                >
                  <Image 
                    src={member.imageUrl} 
                    alt={`Foto profil ${member.name}`}
                    width={64}
                    height={64}
                    className="rounded-full mb-2 border-2 border-black dark:border-purple-800"
                  />
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{member.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  <span className="text-xs text-purple-600 dark:text-purple-400 mt-1">Lihat Profil</span>

                </a>
              ))}
            </div>
          </div>

          <hr className="my-8 border-gray-300 dark:border-gray-600" />

          <div className="w-full flex justify-center">
            {/* Anda bisa menggunakan slot iklan yang sama dengan halaman kontak atau yang baru */}
            <AdBanner dataAdSlot="6897039624" />
          </div>

        </div>
      </div>
    </main>
  );
}
