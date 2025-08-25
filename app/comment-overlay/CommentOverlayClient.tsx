'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, User, Smile } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const CommentOverlayClient: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState('Nama Pengguna');
  const [text, setText] = useState('Tulis komentarmu di sini...');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showPicker, setShowPicker] = useState(false); // State untuk menampilkan/menyembunyikan picker
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevText => prevText + emojiData.emoji);
    setShowPicker(false);
  };

  const downloadImage = async () => {
    const node = bubbleRef.current;
    if (!node) return;

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    
    const link = document.createElement('a');
    link.download = 'comment-bubble.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
      
      {/* Controls */}
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Foto Profil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Pengguna</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Warna Latar</label>
            <input
              type="color"
              value={bgColor}
              onChange={e => setBgColor(e.target.value)}
              className="w-16 h-10 p-1 border rounded-md bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        {/* Kolom Komentar dengan Tombol Emoji */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Teks Komentar</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            rows={4}
          />
          <button 
            className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPicker(val => !val)}
            aria-label="Pilih emoji"
          >
            <Smile />
          </button>
          {showPicker && (
            <div className="absolute z-10 right-0 mt-2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <button
          onClick={downloadImage}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm w-full lg:w-auto"
        >
          <Download size={16} /> Unduh Gambar
        </button>
      </div>

      {/* Preview */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-4">
        <div ref={bubbleRef} className="p-5">
            <div
                className="relative p-4 rounded-xl shadow-lg w-full max-w-sm"
                style={{ backgroundColor: bgColor }}
            >
                <div
                    style={{
                        content: "''",
                        position: 'absolute',
                        bottom: '-15px',
                        left: '20px',
                        width: 0,
                        height: 0,
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderTop: `15px solid ${bgColor}`,
                    }}
                />
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        {photo ? (
                            <img src={photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                <User size={20} />
                            </div>
                        )}
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{username}</span>
                    </div>
                    <div className="pl-12">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{text}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{date}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommentOverlayClient;