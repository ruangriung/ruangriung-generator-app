'use client';

import { useState } from 'react';
import { Sparkles, Film, Type, Clapperboard, Settings, Camera, Wand, Smile, ClipboardCopy, Check, X, Expand } from 'lucide-react'; 
import ButtonSpinner from './ButtonSpinner';
import Accordion from './Accordion';
import TextareaModal from './TextareaModal';

export default function VideoCreator() {
  const [inputs, setInputs] = useState({
    konsep: 'Detektif cyberpunk di gang kota yang diterangi lampu neon',
    narasi: '',
    model: 'Default',
    gayaVisual: 'Sinematik',
    shotSize: 'Medium Shot',
    pergerakanKamera: 'Statis',
    efekVisual: 'Tidak Ada',
    mood: 'Misterius',
  });
  
  const [videoIdea, setVideoIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editingField, setEditingField] = useState<null | 'konsep' | 'narasi'>(null);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateIdea = async () => {
    if (!inputs.konsep) {
      alert('Konsep Utama Video tidak boleh kosong!');
      return;
    }
    setIsLoading(true);
    setVideoIdea('');

    let fullPrompt = `Buatkan saya ide skrip video pendek berdasarkan informasi berikut:\n`;
    fullPrompt += `- Konsep Utama: ${inputs.konsep}\n`;
    if (inputs.narasi) fullPrompt += `- Narasi/Dialog: ${inputs.narasi}\n`;
    fullPrompt += `- Model/Gaya Video: ${inputs.model}\n`;
    fullPrompt += `- Gaya Visual: ${inputs.gayaVisual}\n`;
    fullPrompt += `- Ukuran Pengambilan Gambar (Shot): ${inputs.shotSize}\n`;
    fullPrompt += `- Pergerakan Kamera: ${inputs.pergerakanKamera}\n`;
    if (inputs.efekVisual !== 'Tidak Ada') fullPrompt += `- Efek Visual: ${inputs.efekVisual}\n`;
    fullPrompt += `- Mood dan Suasana: ${inputs.mood}\n\n`;
    fullPrompt += `Berikan hasilnya dalam format naratif yang mendeskripsikan adegan per adegan secara sinematik.`;

    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`
        },
        body: JSON.stringify({
          model: 'openai',
          messages: [{ role: 'user', content: fullPrompt }],
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const result = await response.json();
      setVideoIdea(result.choices[0].message.content);
    } catch (error) {
      console.error("Error generating video idea:", error);
      alert('Terjadi kesalahan saat membuat ide video.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!videoIdea) return;
    navigator.clipboard.writeText(videoIdea).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const textareaStyle = `${inputStyle} pr-20 cursor-pointer resize-none`; // pr-20 untuk ruang tombol, resize-none untuk mematikan handle resize browser

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 flex items-center justify-center gap-x-2">
                <Film className="text-purple-600" />
                Creator Prompt Video
            </h2>
            <p className="text-gray-500 mt-1">Masukkan topik, dan biarkan AI membuatkan ide video untuk Anda.</p>
        </div>
        
        <div>
          <label htmlFor="konsep" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Type size={16} className="text-purple-600"/>Konsep Utama Video *</label>
          <div className="relative w-full">
            <textarea id="konsep" value={inputs.konsep} readOnly onFocus={() => setEditingField('konsep')} className={`${textareaStyle} h-24`} placeholder="Klik untuk mengedit..."/>
            <div className="absolute top-2 right-2 flex gap-x-1">
              {inputs.konsep && <button title="Hapus" onClick={(e) => { e.stopPropagation(); handleInputChange('konsep', '') }} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200"><X size={18} /></button>}
              <button title="Perbesar" onClick={() => setEditingField('konsep')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200"><Expand size={18} /></button>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="narasi" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Type size={16} className="text-purple-600"/>Narasi (Opsional)</label>
          <div className="relative w-full">
            <textarea id="narasi" value={inputs.narasi} readOnly onFocus={() => setEditingField('narasi')} className={`${textareaStyle} h-20`} placeholder="Klik untuk mengedit..."/>
            <div className="absolute top-2 right-2 flex gap-x-1">
              {inputs.narasi && <button title="Hapus" onClick={(e) => { e.stopPropagation(); handleInputChange('narasi', '')}} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200"><X size={18} /></button>}
              <button title="Perbesar" onClick={() => setEditingField('narasi')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200"><Expand size={18} /></button>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="model" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Clapperboard size={16} className="text-purple-600"/>Model Video AI</label>
          <select id="model" value={inputs.model} onChange={(e) => handleInputChange('model', e.target.value)} className={`${inputStyle} appearance-none`}>
            <option>Default (Umum)</option>
            <option>Animasi</option>
            <option>Realistis</option>
          </select>
        </div>

        <div className="space-y-2 pt-4">
          <Accordion title={<div className="flex items-center gap-2"><Settings size={16} /> Gaya Visual</div>}>
             <select value={inputs.gayaVisual} onChange={(e) => handleInputChange('gayaVisual', e.target.value)} className={`${inputStyle} appearance-none`}>
                <option>Sinematik</option><option>Vlog</option><option>Dokumenter</option>
            </select>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Camera size={16} /> Sinematografi</div>}>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Shot Size</label>
                <select value={inputs.shotSize} onChange={(e) => handleInputChange('shotSize', e.target.value)} className={`${inputStyle} appearance-none mt-1`}>
                  <option>Medium Shot</option><option>Close Up</option><option>Wide Shot</option><option>Extreme Close Up</option><option>Full Shot</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Pergerakan Kamera</label>
                <select value={inputs.pergerakanKamera} onChange={(e) => handleInputChange('pergerakanKamera', e.target.value)} className={`${inputStyle} appearance-none mt-1`}>
                  <option>Statis</option><option>Tracking Shot</option><option>Dolly Zoom</option><option>Handheld</option><option>Crane Shot</option>
                </select>
              </div>
            </div>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Wand size={16} /> Efek Visual</div>}>
            <select value={inputs.efekVisual} onChange={(e) => handleInputChange('efekVisual', e.target.value)} className={`${inputStyle} appearance-none`}>
              <option>Tidak Ada</option><option>Slow Motion</option><option>Vignette</option><option>Light Leaks</option><option>Glitch</option>
            </select>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Smile size={16} /> Mood & Suasana</div>}>
            <select value={inputs.mood} onChange={(e) => handleInputChange('mood', e.target.value)} className={`${inputStyle} appearance-none`}>
              <option>Misterius</option><option>Ceria</option><option>Dramatis</option><option>Nostalgia</option><option>Tegang</option><option>Romantis</option>
            </select>
          </Accordion>
        </div>

        <div className="text-center pt-4">
          <button onClick={handleGenerateIdea} disabled={isLoading} className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400">
            {isLoading ? <ButtonSpinner /> : <Sparkles className="w-5 h-5 mr-2" />}
            <span>Buat Ide Video</span>
          </button>
        </div>

        {videoIdea && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600">Hasil Ide Prompt:</label>
              <button onClick={handleCopy} className="flex items-center gap-x-1.5 px-3 py-1.5 text-sm rounded-md transition-colors duration-200 bg-light-bg shadow-neumorphic-button active:shadow-neumorphic-inset">
                {isCopied ? (
                  <><Check size={16} className="text-green-500" /> <span className="text-green-500">Tersalin!</span></>
                ) : (
                  <><ClipboardCopy size={16} className="text-gray-600" /> <span className="text-gray-600">Salin</span></>
                )}
              </button>
            </div>
            <textarea readOnly value={videoIdea} className={`${inputStyle} h-64`} />
          </div>
        )}
      </div>

      <TextareaModal
        isOpen={editingField !== null}
        onClose={() => setEditingField(null)}
        title={editingField === 'konsep' ? 'Edit Konsep Utama' : 'Edit Narasi'}
        value={editingField ? inputs[editingField] : ''}
        onChange={(newValue) => {
          if (editingField) {
            handleInputChange(editingField, newValue);
          }
        }}
      />
    </>
  );
}