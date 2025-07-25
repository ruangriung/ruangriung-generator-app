// components/VideoCreator.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Film, Type, Clapperboard, Settings, Camera, Wand, Smile, ClipboardCopy, Check, X, Expand, Download, ChevronDown } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import Accordion from './Accordion';
import TextareaModal from './TextareaModal';
import toast from 'react-hot-toast';

export default function VideoCreator() {
  const [inputs, setInputs] = useState({
    konsep: 'Detektif cyberpunk di gang kota yang diterangi lampu neon',
    narasi: '',
    model: 'Sora',
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
      toast.error('Konsep Utama Video tidak boleh kosong!');
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
    fullPrompt += `Berikan hasilnya dalam format JSON. JSON harus memiliki struktur berikut:
{
  "title": "Judul video yang menarik",
  "scenes": [
    {
      "scene_number": 1,
      "description": "Deskripsi singkat adegan ini",
      "narration": "Narasi atau dialog untuk adegan ini (jika ada, kosongkan jika tidak)",
      "shot_size": "Ukuran pengambilan gambar untuk adegan ini",
      "camera_movement": "Pergerakan kamera untuk adegan ini",
      "visual_effects": "Efek visual yang diterapkan (jika ada, kosongkan jika tidak)",
      "mood": "Mood atau suasana adegan ini"
    }
  ],
  "overall_notes": "Catatan tambahan atau rekomendasi umum untuk produksi video"
}
Pastikan hanya mengembalikan objek JSON, tidak ada teks atau penjelasan lain sebelum atau sesudahnya.`;

    const generatePromise = new Promise<string>(async (resolve, reject) => {
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        let idea = result.choices[0].message.content;

        try {
          // Attempt to parse the idea as JSON
          const parsedIdea = JSON.parse(idea);
          // If successful, stringify it with pretty printing for display
          idea = JSON.stringify(parsedIdea, null, 2);
        } catch (parseError) {
          console.warn("Failed to parse AI response as JSON, using raw text.", parseError);
          // If parsing fails, use the raw text as is
        }
        setVideoIdea(idea);
        resolve('Ide video berhasil dibuat!');
      } catch (error: any) {
        console.error("Error generating video idea:", error);
        reject('Terjadi kesalahan saat membuat ide video.');
      } finally {
        setIsLoading(false);
      }
    });

    toast.promise(generatePromise, {
      loading: 'Membuat ide video...',
      success: (message: string) => message,
      error: (message: string) => `Gagal membuat ide video: ${message}`,
    });
  };
  
  const handleCopy = () => {
    if (!videoIdea) return;
    navigator.clipboard.writeText(videoIdea).then(() => {
      setIsCopied(true);
      toast.success("Ide video berhasil disalin!");
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownloadJson = () => {
    if (!videoIdea) return;
    
    let dataToSave;
    try {
      dataToSave = JSON.parse(videoIdea); // Try to parse if it's already JSON stringified
    } catch (e) {
      dataToSave = {
        inputs: inputs,
        generatedIdea: videoIdea,
        timestamp: new Date().toISOString()
      };
    }
    
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `video_prompt_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("File JSON berhasil diunduh!");
  };

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} pr-20 cursor-pointer resize-none`;
  const actionButtonStyle = "flex items-center gap-x-1.5 px-3 py-1.5 text-sm rounded-md transition-colors duration-200 bg-light-bg dark:bg-dark-bg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700";
  const selectStyleWithIcon = `${inputStyle} appearance-none pr-10`;

  return (
    <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      <div className="space-y-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-x-2">
                <Film className="text-purple-600" />
                Creator Prompt Video
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Masukkan topik, dan biarkan AI membuatkan ide video untuk Anda.</p>
        </div>
        
        <div>
          <label htmlFor="konsep" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"><Type size={16} className="text-purple-600"/>Konsep Utama Video *</label>
          <div className="relative w-full">
            <textarea id="konsep" value={inputs.konsep} onChange={(e) => handleInputChange('konsep', e.target.value)} className={`${textareaStyle} h-24`} placeholder="Ketik di sini atau klik perbesar untuk edit..." />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {inputs.konsep && <button title="Hapus" onClick={(e) => { e.stopPropagation(); handleInputChange('konsep', '') }} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={18} /></button>}
              <button title="Perbesar" onClick={() => setEditingField('konsep')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Expand size={18} /></button>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="narasi" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"><Type size={16} className="text-purple-600"/>Narasi (Opsional)</label>
          <div className="relative w-full">
            <textarea id="narasi" value={inputs.narasi} onChange={(e) => handleInputChange('narasi', e.target.value)} className={`${textareaStyle} h-20`} placeholder="Ketik di sini atau klik perbesar untuk edit..." />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {inputs.narasi && <button title="Hapus" onClick={(e) => { e.stopPropagation(); handleInputChange('narasi', '')}} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={18} /></button>}
              <button title="Perbesar" onClick={() => setEditingField('narasi')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Expand size={18} /></button>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="model" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"><Clapperboard size={16} className="text-purple-600"/>Model Video AI</label>
          <div className="relative">
            <select id="model" value={inputs.model} onChange={(e) => handleInputChange('model', e.target.value)} className={selectStyleWithIcon}>
              <option value="Sora" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Sora (OpenAI)</option>
              <option value="Veo" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Veo (Google)</option>
              <option value="Lumiere" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Lumiere (Google)</option>
              <option value="Runway" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Runway Gen-3</option>
              <option value="Kling" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Kling</option>
              <option value="Pika" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Pika Labs</option>
              <option value="CapCut" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">CapCut AI</option>
              <option value="Stable Video" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Stable Video Diffusion</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <ChevronDown className="h-5 w-5" aria-hidden="true"/>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Accordion title={<div className="flex items-center gap-2"><Settings size={16} /> <span className="text-gray-700 dark:text-gray-300">Gaya Visual</span></div>}>
            <div className="relative mt-2">
              <select value={inputs.gayaVisual} onChange={(e) => handleInputChange('gayaVisual', e.target.value)} className={selectStyleWithIcon}>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Sinematik</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Vlog</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Dokumenter</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Animasi 3D</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Anime</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Retro/Vintage</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Futuristik</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <ChevronDown className="h-5 w-5" aria-hidden="true"/>
              </div>
            </div>
          </Accordion>
          
          <Accordion title={<div className="flex items-center gap-2"><Camera size={16} /> <span className="text-gray-700 dark:text-gray-300">Sinematografi</span></div>}>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Shot Size</label>
                <div className="relative mt-1">
                  <select value={inputs.shotSize} onChange={(e) => handleInputChange('shotSize', e.target.value)} className={selectStyleWithIcon}>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Wide Shot</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Full Shot</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Medium Shot</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Close Up</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Extreme Close Up</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Point of View (POV)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <ChevronDown className="h-5 w-5" aria-hidden="true"/>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Pergerakan Kamera</label>
                <div className="relative mt-1">
                  <select value={inputs.pergerakanKamera} onChange={(e) => handleInputChange('pergerakanKamera', e.target.value)} className={selectStyleWithIcon}>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Statis</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Panning (Geser Horizontal)</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Tilting (Geser Vertikal)</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Dolly (Maju/Mundur)</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Tracking Shot</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Dolly Zoom</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Handheld (Genggam)</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Crane Shot</option>
                    <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Drone Shot</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <ChevronDown className="h-5 w-5" aria-hidden="true"/>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>
          
          <Accordion title={<div className="flex items-center gap-2"><Wand size={16} /> <span className="text-gray-700 dark:text-gray-300">Efek Visual</span></div>}>
            <div className="relative mt-2">
              <select value={inputs.efekVisual} onChange={(e) => handleInputChange('efekVisual', e.target.value)} className={selectStyleWithIcon}>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Tidak Ada</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Slow Motion</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Timelapse</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Vignette</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Light Leaks</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Glitch</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Film Grain</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Color Grading (Hangat/Dingin)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <ChevronDown className="h-5 w-5" aria-hidden="true"/>
              </div>
            </div>
          </Accordion>
          
          <Accordion title={<div className="flex items-center gap-2"><Smile size={16} /> <span className="text-gray-700 dark:text-gray-300">Mood & Suasana</span></div>}>
            <div className="relative mt-2">
              <select value={inputs.mood} onChange={(e) => handleInputChange('mood', e.target.value)} className={selectStyleWithIcon}>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Misterius</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ceria</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Dramatis</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Nostalgia</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Tegang</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Romantis</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Epick/Megah</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Menyeramkan</option>
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Tenang/Damai</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <ChevronDown className="h-5 w-5" aria-hidden="true"/>
              </div>
            </div>
          </Accordion>
        </div>

        <div className="text-center pt-4">
          <button onClick={handleGenerateIdea} disabled={isLoading} className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150">
            {isLoading ? <ButtonSpinner /> : <Sparkles className="w-5 h-5 mr-2" />}
            <span>Buat Ide Video</span>
          </button>
        </div>

        {videoIdea && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Hasil Ide Prompt:</label>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadJson} className={actionButtonStyle}>
                  <Download size={16} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">JSON</span>
                </button>
                <button onClick={handleCopy} className={actionButtonStyle}>
                  {isCopied ? (
                    <><Check size={16} className="text-green-500" /> <span className="text-green-500">Tersalin!</span></>
                  ) : (
                    <><ClipboardCopy size={16} className="text-gray-600 dark:text-gray-300" /> <span className="text-gray-600 dark:text-gray-300">Salin</span></>
                  )}
                </button>
              </div>
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
    </div>
  );
}