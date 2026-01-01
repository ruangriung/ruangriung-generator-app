
'use client';

import { useState } from 'react';
import { Video, Sparkles, Download, AlertCircle, Wand2 } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function TextToVideo() {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [seed, setSeed] = useState('-1');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [model, setModel] = useState('veo');
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const response = await fetch('/api/pollinations/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai', // Use decent model for enhancement
                    prompt: `Enhance this video prompt to be detailed and cinematic, suitable for AI video generation. Keep it under 50 words: "${prompt}"`,
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

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error('Masukkan prompt terlebih dahulu!');
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);

        try {
            // Calculate width/height from aspect ratio
            const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
            // Base size roughly 1024x1024 area, adapted for ratio
            // Pollinations likely takes width/height
            // Let's assume standard HD-ish sizing scaling
            // 16:9 -> 1280x720 or 1024x576. Let's send ratio string or dimensions if API supports.
            // Based on Image API it accepts width/height.
            let width = 1024;
            let height = 1024;
            if (wRatio > hRatio) {
                width = 1280;
                height = Math.round(1280 * (hRatio / wRatio));
            } else if (hRatio > wRatio) {
                height = 1280;
                width = Math.round(1280 * (wRatio / hRatio));
            }

            const params = new URLSearchParams({
                model: model,
                prompt: prompt,
                negative_prompt: negativePrompt,
                seed: seed === '-1' || !seed ? Math.floor(Math.random() * 1000000).toString() : seed,
                width: width.toString(),
                height: height.toString(),
            });

            const response = await fetch(`/api/pollinations/video?${params.toString()}`);

            if (!response.ok) {
                throw new Error('Gagal membuat video');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
            toast.success('Video berhasil dibuat!');
        } catch (error) {
            console.error(error);
            toast.error('Terjadi kesalahan saat membuat video.');
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
        <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-x-2">
                    <Video className="text-purple-600" />
                    Text to Video Generator
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Buat video pendek dari teks menggunakan model AI terbaru.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['veo', 'seedance', 'seedance-pro'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setModel(m)}
                                className={`p-3 rounded-lg text-sm font-semibold capitalize border transition-all ${model === m
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-neumorphic-button'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {m.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prompt Video
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Deskripsikan video yang ingin Anda buat... (Inggris lebih akurat)"
                        className="w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200 h-32 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Negative Prompt (Elemen yang dihindari)
                    </label>
                    <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Blurry, distorted, bad quality..."
                        className="w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200 h-20 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Seed (Opsional, -1 untuk acak)
                        </label>
                        <input
                            type="number"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            className="w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
                            placeholder="-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Aspect Ratio
                        </label>
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200 appearance-none"
                        >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait/Shorts)</option>
                            <option value="1:1">1:1 (Square)</option>
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
