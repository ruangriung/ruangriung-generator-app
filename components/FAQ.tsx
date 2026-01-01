'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Definisikan tipe untuk setiap item FAQ
interface FAQItem {
  question: string;
  answer: string;
}

// Daftar pertanyaan dan jawaban yang sudah diperbarui
const faqData: FAQItem[] = [
  {
    question: "Apa itu RuangRiung AI Generator?",
    answer: "RuangRiung AI Generator adalah sebuah platform kreatif yang memungkinkan Anda untuk membuat gambar, ide konten video, dan audio unik hanya dengan menggunakan teks. Cukup ketikkan ide Anda, dan biarkan AI kami yang bekerja."
  },
  {
    question: "Apakah layanan ini gratis?",
    answer: "Ya, fitur pembuatan gambar dan chatbot dapat digunakan secara gratis tanpa perlu login. Untuk fitur yang lebih canggih seperti pembuatan video dan audio, Anda perlu login menggunakan akun Google atau Facebook Anda."
  },
  {
    question: "Bagaimana cara kerja pembuatan gambar?",
    answer: "Kami menggunakan model AI canggih seperti Flux dan model dari Pollinations.ai. Anda hanya perlu menuliskan deskripsi gambar (prompt) yang Anda inginkan, pilih gaya seni, dan AI akan menghasilkan gambar berdasarkan deskripsi tersebut."
  },
  {
    question: "Model AI apa saja yang tersedia di chatbot?",
    answer: "Chatbot kami didukung oleh berbagai model AI terkemuka, termasuk model dari OpenAI (seperti GPT), Google, dan Mistral. Anda bisa memilih model yang paling sesuai dengan kebutuhan Anda untuk mendapatkan jawaban atau bantuan."
  },
  {
    question: "Apakah saya bisa menggunakan gambar yang dihasilkan untuk tujuan komersial?",
    answer: "Kebijakan penggunaan gambar untuk tujuan komersial bergantung pada lisensi dari masing-masing model AI yang digunakan. Kami sarankan untuk memeriksa syarat dan ketentuan dari penyedia model (seperti OpenAI) untuk memastikan kepatuhan."
  },
  {
    question: "Bagaimana cara menyimpan riwayat percakapan di chatbot?",
    answer: "Sangat mudah! Semua percakapan Anda di chatbot disimpan secara otomatis di browser Anda menggunakan teknologi localStorage. Anda bisa menutup browser dan membukanya kembali, dan riwayat chat Anda akan tetap ada."
  },
  {
    question: "Data apa yang disimpan saat saya menggunakan aplikasi ini?",
    answer: "Kami sangat menghargai privasi Anda. Untuk pengguna yang tidak login, kami tidak menyimpan data pribadi apa pun. Untuk pengguna yang login, kami hanya menyimpan informasi dasar dari profil Anda (nama dan email) untuk otentikasi. Riwayat chat Anda disimpan secara lokal di browser Anda dan tidak dikirim ke server kami."
  },
  {
    question: "Mengapa saya perlu login untuk fitur video dan audio?",
    answer: "Proses pembuatan video dan audio membutuhkan sumber daya komputasi yang lebih besar. Dengan mewajibkan login, kami dapat mengelola penggunaan sumber daya dengan lebih baik dan mencegah penyalahgunaan, sehingga layanan tetap stabil untuk semua pengguna."
  },
  {
    question: "Apakah aplikasi ini bisa diinstal di perangkat saya?",
    answer: "Tentu saja! Aplikasi ini adalah Progressive Web App (PWA), yang berarti Anda bisa menginstalnya di perangkat desktop atau mobile Anda untuk akses yang lebih cepat dan pengalaman seperti aplikasi asli. Cari tombol 'Install App' di banner atas."
  },
  {
    question: "Bagaimana jika saya mengalami masalah atau memiliki pertanyaan lain?",
    answer: "Jika Anda mengalami kendala atau memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami melalui halaman kontak atau media sosial yang tertera di bagian bawah halaman."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
        Pertanyaan yang Sering Diajukan (FAQ)
      </h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.question}</span>
              <ChevronDown
                className={`w-6 h-6 text-purple-600 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''
                  }`}
              />
            </button>
            <div
              className={`grid transition-all duration-500 ease-in-out ${activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-gray-600 dark:text-gray-400">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;