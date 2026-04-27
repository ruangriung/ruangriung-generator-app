
'use client';

import { useState, useEffect } from 'react';
import { Video, Sparkles, Download, AlertCircle, Wand2, Image as ImageIcon, X, Plus } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function TextToVideo() {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [seed, setSeed] = useState('-1');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [model, setModel] = useState('veo');
    const [models, setModels] = useState<string[]>(['veo', 'seedance', 'seedance-pro']);
    const [inputImage, setInputImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Fetch dynamic models
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const headers: Record<string, string> = {};
                const apiKey = localStorage.getItem('pollinations_api_key');
                if (apiKey) {
                    headers['x-pollinations-key'] = apiKey;
                }

                const response = await fetch('/api/pollinations/models/image', { headers });
                if (response.ok) {
                    const rawModels: string[] = await response.json();
                    // Filter for video models
                    const videoModels = rawModels.filter(m => 
                        m.toLowerCase().includes('video') || 
                        m.toLowerCase().includes('veo') || 
                        m.toLowerCase().includes('wan') || 
                        m.toLowerCase().includes('seedance') || 
                        m.toLowerCase().includes('ltx') || 
                        m.toLowerCase().includes('reel')
                    );
                    if (videoModels.length > 0) {
                        setModels(videoModels);
                        // If current model not in list, set to first video model
                        if (!videoModels.includes(model)) {
                            setModel(videoModels[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch video models:", error);
            }
        };
        fetchModels();
    }, []);

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/pollinations/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai', 
                    messages: [{ role: 'user', content: `Enhance this video prompt to be detailed and cinematic, suitable for AI video generation. Keep it under 50 words: "${prompt}"` }],
                    json: false
                })
            });
            const newPrompt = await response.text();
            if (newPrompt) setPrompt(newPrompt.trim().replace(/^"|"$/g, ''));
            toast.success('Prompt disempurnakan!');
        } catch (e) {
            console.error(e);
            toast.error('Gagal menyempurnakan prompt');
        } finally {
            setIsEnhancing(false);
        }
    };

    const isProModel = (modelName: string) => {
        const normalized = modelName.toLowerCase();
        return normalized.includes('-pro') || ['veo', 'seedance', 'wan', 'p-video'].some(m => normalized.includes(m));
    };

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Masukkan prompt terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);
        
        try {
            const apiKey = localStorage.getItem('pollinations_api_key');
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (apiKey) {
                headers['x-pollinations-key'] = apiKey;
            }

            const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
            let width = 1024;
            let height = 1024;
            if (wRatio > hRatio) {
                width = 1280;
                height = Math.round(1280 * (hRatio / wRatio));
            } else if (hRatio > wRatio) {
                height = 1280;
                width = Math.round(1280 * (wRatio / hRatio));
            }

            const response = await fetch('/api/pollinations/video', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    negative_prompt: negativePrompt,
                    seed: seed === '-1' || !seed ? Math.floor(Math.random() * 1000000).toString() : seed,
                    width: width.toString(),
                    height: height.toString(),
                    image: inputImage || undefined
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal membuat video');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            toast.success('Video berhasil dibuat!');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Terjadi kesalahan saat membuat video.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (videoUrl) {
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = `generated-video-${Date.now()}.mp4`; // Assuming mp4
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    return (
        <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                    <Video size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Text to Video</h2>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Ciptakan mahakarya visual bergerak dari kata-kata Anda.</p>

            <div className="space-y-4">
                <div className="space-y-3">
                    <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Pilih Mesin Video
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto p-1 custom-scrollbar">
                        {models.map((m) => {
                            const isPro = isProModel(m);
                            return (
                                <button
                                    key={m}
                                    onClick={() => setModel(m)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap flex items-center gap-2 ${model === m
                                        ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                                        : 'glass border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'
                                        }`}
                                >
                                    {m.replace(/-/g, ' ')}
                                    {isPro && (
                                        <span className={`px-1 py-0.5 rounded text-[7px] font-black ${
                                            model === m ? 'bg-white/20 text-white' : 'bg-primary-500/10 text-primary-500'
                                        }`}>PRO</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-inset p-6 rounded-3xl">
                    <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                        <ImageIcon size={14} className="text-primary-500" /> Gambar Referensi <span className="text-slate-400 lowercase">(opsional)</span>
                    </label>
                    
                    <div className="relative group">
                        <div className="glass-card !bg-white/5 border-dashed border-2 border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-all min-h-[100px]">
                            {inputImage ? (
                                <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden group">
                                    <img src={inputImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setInputImage('')}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                                            title="Hapus"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        id="video-image-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    toast.error("File terlalu besar (Maks 2MB).");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => setInputImage(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="video-image-upload"
                                        className="flex flex-col items-center cursor-pointer"
                                    >
                                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition-colors mb-2" />
                                        <span className="text-[10px] font-bold text-gray-500">UNGGAH GAMBAR REFERENSI</span>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-4 italic font-bold">Gunakan foto sebagai titik awal untuk video AI Anda (I2V).</p>
                </div>

                <div className="space-y-3">
                    <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Prompt Video
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Deskripsikan video yang ingin Anda buat..."
                        className="w-full p-6 bg-slate-50 dark:bg-black/40 backdrop-blur-md rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 h-32 resize-none shadow-inner leading-relaxed"
                    />
                </div>

                <div className="space-y-3">
                    <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Negative Prompt <span className="text-slate-400 lowercase">(dihindari)</span>
                    </label>
                    <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Blurry, distorted, bad quality..."
                        className="w-full p-6 bg-slate-50 dark:bg-black/40 backdrop-blur-md rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 h-24 resize-none shadow-inner leading-relaxed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            Seed <span className="text-slate-400 lowercase">(acak: -1)</span>
                        </label>
                        <input
                            type="number"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 transition-all text-slate-800 dark:text-slate-200 font-bold"
                            placeholder="-1"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            Aspek Rasio
                        </label>
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 transition-all text-slate-800 dark:text-slate-200 font-bold appearance-none cursor-pointer"
                        >
                            <option value="16:9" className="bg-white dark:bg-slate-900">16:9 (Landscape)</option>
                            <option value="9:16" className="bg-white dark:bg-slate-900">9:16 (Portrait/Shorts)</option>
                            <option value="1:1" className="bg-white dark:bg-slate-900">1:1 (Square)</option>
                        </select>
                    </div>
                </div>

                <div className="text-center pt-2 gap-2 flex flex-wrap justify-center">
                    <button
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !prompt}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                    >
                        {isEnhancing ? <ButtonSpinner /> : <Wand2 className="w-5 h-5 mr-2" />}
                        <span>Sempurnakan Prompt</span>
                    </button>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? <ButtonSpinner /> : <Sparkles className="w-5 h-5 mr-2" />}
                        <span>Generate Video</span>
                    </button>
                </div>

                {videoUrl && (
                    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Hasil Video:</h3>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                <Download size={18} /> Download
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Catatan: Generasi video membutuhkan waktu lebih lama dari gambar (bisa 1-2 menit). Pastikan jaringan Anda stabil.
                </p>
            </div>

        </div>
    );
}
