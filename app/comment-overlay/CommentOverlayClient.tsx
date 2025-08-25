'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Image as ImageIcon } from 'lucide-react';

const CommentOverlayClient: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState('Tulis komentarmu di sini...');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    const node = bubbleRef.current;
    if (!node) return;
    const canvas = await html2canvas(node);
    const link = document.createElement('a');
    link.download = 'comment.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Teks Komentar</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Warna Latar Bubble</label>
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-16 h-8 p-1 border rounded-md bg-white dark:bg-gray-800"
          />
        </div>
        <button
          onClick={downloadImage}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
        >
          <Download size={16} /> Unduh
        </button>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center">
        <div
          ref={bubbleRef}
          className="flex items-start gap-3 p-3 rounded-xl shadow-lg max-w-sm"
          style={{ backgroundColor: bgColor }}
        >
          {photo ? (
            <img src={photo} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              <ImageIcon size={24} />
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{text}</p>
            <span className="text-xs text-gray-500 mt-1">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentOverlayClient;
