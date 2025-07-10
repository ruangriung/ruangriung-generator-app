'use client';

import { useState } from 'react';
// 1. Tambahkan ikon yang hilang di sini
import { Sparkles, Film, Type, Clapperboard, Settings, Camera, Wand, Smile, ClipboardCopy, Check } from 'lucide-react'; 
import ButtonSpinner from './ButtonSpinner';
import Accordion from './Accordion';

export default function VideoCreator() {
  // State untuk menampung semua input dari form
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
  const [isCopied, setIsCopied] = useState(false); // State untuk melacak status copy

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
  const selectStyle = `${inputStyle} appearance-none`;

  return (
    <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
      <div className="space-y-4">
        <div>
          <label htmlFor="konsep" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Type size={16} className="text-purple-600"/>Konsep Utama Video *</label>
          <textarea id="konsep" rows={3} value={inputs.konsep} onChange={(e) => handleInputChange('konsep', e.target.value)} className={inputStyle} placeholder="Cth: Detektif cyberpunk di gang neon..."/>
        </div>
        <div>
          <label htmlFor="narasi" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Type size={16} className="text-purple-600"/>Narasi (Opsional)</label>
          <textarea id="narasi" rows={2} value={inputs.narasi} onChange={(e) => handleInputChange('narasi', e.target.value)} className={inputStyle} placeholder="Ketik narasi atau dialog di sini..."/>
        </div>
        <div>
          <label htmlFor="model" className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2"><Clapperboard size={16} className="text-purple-600"/>Model Video AI</label>
          <select id="model" value={inputs.model} onChange={(e) => handleInputChange('model', e.target.value)} className={selectStyle}>
            <option>Default (Umum)</option>
            <option>Animasi</option>
            <option>Realistis</option>
          </select>
        </div>

        <div className="space-y-2 pt-4">
          <Accordion title={<div className="flex items-center gap-2"><Settings size={16} /> Pengaturan Dasar</div>}>
             <select value={inputs.gayaVisual} onChange={(e) => handleInputChange('gayaVisual', e.target.value)} className={selectStyle}>
                <option>Sinematik</option><option>Vlog</option><option>Dokumenter</option>
            </select>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Camera size={16} /> Sinematografi</div>}>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Shot Size</label>
                <select value={inputs.shotSize} onChange={(e) => handleInputChange('shotSize', e.target.value)} className={`${selectStyle} mt-1`}>
                  <option>Medium Shot</option><option>Close Up</option><option>Wide Shot</option><option>Extreme Close Up</option><option>Full Shot</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Pergerakan Kamera</label>
                <select value={inputs.pergerakanKamera} onChange={(e) => handleInputChange('pergerakanKamera', e.target.value)} className={`${selectStyle} mt-1`}>
                  <option>Statis</option><option>Tracking Shot</option><option>Dolly Zoom</option><option>Handheld</option><option>Crane Shot</option>
                </select>
              </div>
            </div>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Wand size={16} /> Efek Visual</div>}>
            <select value={inputs.efekVisual} onChange={(e) => handleInputChange('efekVisual', e.target.value)} className={selectStyle}>
              <option>Tidak Ada</option><option>Slow Motion</option><option>Vignette</option><option>Light Leaks</option><option>Glitch</option>
            </select>
          </Accordion>
          <Accordion title={<div className="flex items-center gap-2"><Smile size={16} /> Mood & Suasana</div>}>
            <select value={inputs.mood} onChange={(e) => handleInputChange('mood', e.target.value)} className={selectStyle}>
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
    </div>
  );
}