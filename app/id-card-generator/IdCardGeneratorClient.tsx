'use client';

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import Draggable from 'react-draggable';
import {
    Upload, Download, Image as ImageIcon, FileText, User, Building, Calendar,
    ToggleLeft, ToggleRight, Palette, Type, QrCode, Paintbrush, Link as LinkIcon,
    RefreshCw, Save, FolderOpen, Wand2, Layers, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

// --- Tipe Data dan Nilai Default ---
interface CardSettings {
    layout: 'horizontal' | 'vertical';
    name: string;
    studentId: string;
    major: string;
    university: string;
    issueDate: string;
    expiryDate: string;
    photo: string | null;
    logo: string | null;
    background: string | null;
    overlayColor: string;
    overlayOpacity: number;
    textColor: string;
    qrBgColor: string;
    qrFgColor: string;
    headerColor1: string;
    headerColor2: string;
    cardBgColor: string;
    qrCodeValue: string;
    qrCodeContentType: 'dynamic' | 'manual';
    fontFamily: string;
    photoPosition: { x: number; y: number };
    logoPosition: { x: number; y: number };
}

const defaultSettings: CardSettings = {
    layout: 'horizontal',
    name: 'Nama Mahasiswa',
    studentId: '1234567890',
    major: 'Jurusan/Fakultas',
    university: 'Nama Universitas',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split('T')[0],
    photo: null,
    logo: null,
    background: null,
    overlayColor: '#000000',
    overlayOpacity: 0.5,
    textColor: '#FFFFFF',
    qrBgColor: '#FFFFFF',
    qrFgColor: '#000000',
    headerColor1: '#6D28D9',
    headerColor2: '#4F46E5',
    cardBgColor: '#FFFFFF',
    qrCodeValue: 'https://ruangriung.my.id',
    qrCodeContentType: 'manual',
    fontFamily: 'Arial',
    photoPosition: { x: 0, y: 0 },
    logoPosition: { x: 0, y: 0 },
};

// --- Komponen Utama ---
const IdCardGeneratorClient = () => {
    const [settings, setSettings] = useState<CardSettings>(defaultSettings);
    const [bgPrompt, setBgPrompt] = useState('abstract blue pattern');
    const [isGeneratingBg, setIsGeneratingBg] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (settings.qrCodeContentType === 'dynamic') {
            const dynamicContent = `Nama: ${settings.name}\nNIM: ${settings.studentId}\nUniversitas: ${settings.university}`;
            setSettings(s => ({ ...s, qrCodeValue: dynamicContent }));
        }
    }, [settings.name, settings.studentId, settings.university, settings.qrCodeContentType]);

    const handleSettingChange = (key: keyof CardSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'photo' | 'logo' | 'background') => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                handleSettingChange(key, event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // --- FUNGSI UNDUH YANG TELAH DIPERBAIKI ---
    const downloadCard = () => {
        const node = cardRef.current;
        if (!node) {
            toast.error("Referensi kartu tidak ditemukan.");
            return;
        }

        toast.loading("Mempersiapkan unduhan...", { id: 'download-toast' });

        const scale = 2; // Menghasilkan gambar 2x lebih besar untuk kualitas lebih baik
        const width = settings.layout === 'horizontal' ? 336 : 210;
        const height = settings.layout === 'horizontal' ? 210 : 336;

        const clonedNode = node.cloneNode(true) as HTMLDivElement;

        clonedNode.style.width = `${width}px`;
        clonedNode.style.height = `${height}px`;
        clonedNode.style.transform = 'scale(1)';
        clonedNode.style.boxShadow = 'none';
        clonedNode.style.position = 'absolute';
        clonedNode.style.top = '0';
        clonedNode.style.left = '-9999px';

        document.body.appendChild(clonedNode);

        const images = Array.from(clonedNode.getElementsByTagName('img'));
        const promises = images.map(img => new Promise((resolve, reject) => {
            if (img.complete) {
                resolve(true);
            } else {
                img.onload = resolve;
                img.onerror = reject;
            }
        }));

        // Pastikan background image juga dimuat jika ada
        if (settings.background) {
            // ** PERBAIKAN DI SINI **
            const backgroundUrl = settings.background;
            promises.push(new Promise((resolve, reject) => {
                const bgImg = new Image();
                bgImg.src = backgroundUrl; // Gunakan variabel yang sudah pasti string
                bgImg.onload = resolve;
                bgImg.onerror = reject;
            }));
        }

        Promise.all(promises).then(() => {
            setTimeout(() => {
                html2canvas(clonedNode, {
                    useCORS: true,
                    scale: scale,
                    backgroundColor: null,
                    width: width,
                    height: height,
                    scrollX: 0,
                    scrollY: 0,
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `id-card-${settings.studentId}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    toast.success("Unduhan dimulai!", { id: 'download-toast' });
                }).catch(err => {
                    console.error("Error generating canvas:", err);
                    toast.error("Gagal membuat gambar kartu.", { id: 'download-toast' });
                }).finally(() => {
                    document.body.removeChild(clonedNode);
                });
            }, 500);
        }).catch(error => {
            console.error("Error loading images:", error);
            toast.error("Gagal memuat gambar untuk diunduh.", { id: 'download-toast' });
            document.body.removeChild(clonedNode);
        });
    };

    // --- FUNGSI LAINNYA (TIDAK ADA PERUBAHAN) ---
    const handleGenerateBg = async () => {
        if (!bgPrompt) {
            toast.error("Prompt background tidak boleh kosong!");
            return;
        }
        setIsGeneratingBg(true);
        const toastId = toast.loading("AI sedang membuat background...");

        try {
            const params = new URLSearchParams({
                prompt: bgPrompt,
                model: 'flux',
                width: '1024',
                height: '768',
                seed: Math.floor(Math.random() * 1000000).toString(),
                referrer: 'ruangriung.my.id',
                enhance: 'true',
                nologo: 'true'
            });

            // Ganti pemanggilan langsung ke API lokal yang aman
            const url = `/api/pollinations/image?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Gagal mengambil gambar dari API (Status: ${response.status})`);
            }

            // Karena respons proksi adalah file biner (gambar), kita perlu mengubahnya menjadi blob/URL
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            handleSettingChange('background', imageUrl);
            toast.success("Background berhasil dibuat!", { id: toastId });

        } catch (error: any) {
            toast.error(`Gagal: ${error.message}`, { id: toastId });
        } finally {
            setIsGeneratingBg(false);
        }
    };

    const applyTemplate = (template: 'modern' | 'classic') => {
        if (template === 'modern') {
            setSettings(prev => ({ ...prev, headerColor1: '#06B6D4', headerColor2: '#0891B2', cardBgColor: '#F9FAFB', textColor: '#1F2937', fontFamily: 'Verdana' }));
        } else if (template === 'classic') {
            setSettings(prev => ({ ...prev, headerColor1: '#1E3A8A', headerColor2: '#1E40AF', cardBgColor: '#EFF6FF', textColor: '#1E3A8A', fontFamily: 'Georgia' }));
        }
        toast.success(`Template ${template} diterapkan!`);
    };

    const handleReset = () => {
        if (window.confirm("Yakin ingin mereset semua pengaturan?")) {
            setSettings(defaultSettings);
            setBgPrompt('abstract blue pattern');
            toast.success("Pengaturan telah direset.");
        }
    };

    const handleSaveDesign = () => {
        try {
            localStorage.setItem('idCardDesign', JSON.stringify(settings));
            toast.success("Desain berhasil disimpan di browser Anda!");
        } catch (error) {
            toast.error("Gagal menyimpan desain.");
        }
    };

    const handleLoadDesign = () => {
        try {
            const savedDesign = localStorage.getItem('idCardDesign');
            if (savedDesign) {
                setSettings(JSON.parse(savedDesign));
                toast.success("Desain berhasil dimuat!");
            } else {
                toast.error("Tidak ada desain yang tersimpan.");
            }
        } catch (error) {
            toast.error("Gagal memuat desain.");
        }
    };

    const hexToRgba = (hex: string, opacity: number) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`;
    };

    const cardClasses = `relative shadow-lg overflow-hidden transition-all duration-300 ${settings.layout === 'horizontal' ? 'w-[336px] h-[210px] flex' : 'w-[210px] h-[336px] flex flex-col'}`;

    const cardStyles: React.CSSProperties = {
        ...(settings.background ? { backgroundImage: `url(${settings.background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: settings.cardBgColor }),
        fontFamily: settings.fontFamily,
    };

    const inputBaseStyle = "w-full p-2 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200";

    return (
        <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
            <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <Link
                            href="/"
                            className="glass-button px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400"
                        >
                            <ArrowLeft size={16} />
                            <span>Beranda</span>
                        </Link>
                        <div className="w-48">
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            ID Card <span className="text-primary-500">Generator</span>
                        </h1>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                            Ciptakan Identitas Akademik Kustom Secara Instan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Settings Panel */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-card p-8 space-y-8">
                                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                                    <div className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                                        <Wand2 size={20} />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Konfigurasi</h2>
                                </div>

                                <div className="space-y-6">
                                    <details className="group space-y-4" open>
                                        <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                                            <span>Desain & Tata Letak</span>
                                            <span className="transition-transform group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="pt-4 space-y-4">
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Template Cepat</label>
                                                <div className="flex gap-3">
                                                    <button onClick={() => applyTemplate('modern')} className="flex-1 py-3 px-4 rounded-xl glass-button text-[10px] font-black uppercase tracking-widest text-slate-500">Modern</button>
                                                    <button onClick={() => applyTemplate('classic')} className="flex-1 py-3 px-4 rounded-xl glass-button text-[10px] font-black uppercase tracking-widest text-slate-500">Klasik</button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Orientasi Kartu</label>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleSettingChange('layout', 'horizontal')} className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${settings.layout === 'horizontal' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'glass-button text-slate-500'}`}><ToggleLeft size={20} /></button>
                                                    <button onClick={() => handleSettingChange('layout', 'vertical')} className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${settings.layout === 'vertical' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'glass-button text-slate-500'}`}><ToggleRight size={20} /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Tipografi</label>
                                                <select value={settings.fontFamily} onChange={e => handleSettingChange('fontFamily', e.target.value)} className="w-full h-12 px-4 rounded-xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/50 outline-none">
                                                    <option value="Arial">Arial</option> 
                                                    <option value="Verdana">Verdana</option> 
                                                    <option value="Georgia">Georgia</option>
                                                    <option value="Times New Roman">Times New Roman</option> 
                                                    <option value="Courier New">Courier New</option>
                                                </select>
                                            </div>
                                        </div>
                                    </details>

                                    <details className="group space-y-4" open>
                                        <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                                            <span>Palet Warna</span>
                                            <span className="transition-transform group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="pt-4 grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teks</label>
                                                <div className="h-10 w-full rounded-xl glass-inset p-1"><input type="color" value={settings.textColor} onChange={e => handleSettingChange('textColor', e.target.value)} className="w-full h-full bg-transparent cursor-pointer rounded-lg border-none" /></div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Latar</label>
                                                <div className="h-10 w-full rounded-xl glass-inset p-1"><input type="color" value={settings.cardBgColor} onChange={e => handleSettingChange('cardBgColor', e.target.value)} className="w-full h-full bg-transparent cursor-pointer rounded-lg border-none" /></div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grad 1</label>
                                                <div className="h-10 w-full rounded-xl glass-inset p-1"><input type="color" value={settings.headerColor1} onChange={e => handleSettingChange('headerColor1', e.target.value)} className="w-full h-full bg-transparent cursor-pointer rounded-lg border-none" /></div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grad 2</label>
                                                <div className="h-10 w-full rounded-xl glass-inset p-1"><input type="color" value={settings.headerColor2} onChange={e => handleSettingChange('headerColor2', e.target.value)} className="w-full h-full bg-transparent cursor-pointer rounded-lg border-none" /></div>
                                            </div>
                                        </div>
                                    </details>

                                    <details className="group space-y-4" open>
                                        <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                                            <span>Data Akademik</span>
                                            <span className="transition-transform group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="pt-4 space-y-4">
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                    <input type="text" placeholder="Nama Lengkap" value={settings.name} onChange={e => handleSettingChange('name', e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none" />
                                                </div>
                                                <div className="relative group">
                                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                    <input type="text" placeholder="NIM / ID Mahasiswa" value={settings.studentId} onChange={e => handleSettingChange('studentId', e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none" />
                                                </div>
                                                <div className="relative group">
                                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                    <input type="text" placeholder="Nama Universitas" value={settings.university} onChange={e => handleSettingChange('university', e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </details>

                                    <details className="group space-y-4">
                                        <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                                            <span>Media & Background</span>
                                            <span className="transition-transform group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="pt-4 space-y-6">
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className="cursor-pointer group">
                                                    <div className="h-24 rounded-2xl glass-inset flex flex-col items-center justify-center gap-2 border border-white/5 group-hover:border-primary-500/30 transition-all">
                                                        <ImageIcon className="text-slate-400 group-hover:text-primary-500" size={24} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Foto Profil</span>
                                                    </div>
                                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'photo')} />
                                                </label>
                                                <label className="cursor-pointer group">
                                                    <div className="h-24 rounded-2xl glass-inset flex flex-col items-center justify-center gap-2 border border-white/5 group-hover:border-primary-500/30 transition-all">
                                                        <Building className="text-slate-400 group-hover:text-primary-500" size={24} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Logo Uni</span>
                                                    </div>
                                                    <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} />
                                                </label>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">AI Background Engine</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="misal: premium glass texture" 
                                                        value={bgPrompt} 
                                                        onChange={e => setBgPrompt(e.target.value)} 
                                                        className="flex-1 h-12 px-4 rounded-xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none" 
                                                    />
                                                    <button 
                                                        onClick={handleGenerateBg} 
                                                        disabled={isGeneratingBg} 
                                                        className="h-12 w-12 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        {isGeneratingBg ? <RefreshCw className="animate-spin" size={20} /> : <Wand2 size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-8 border-t border-white/5">
                                    <button onClick={handleSaveDesign} className="flex flex-col items-center gap-2 p-3 rounded-xl glass-button text-slate-500">
                                        <Save size={18} />
                                        <span className="text-[8px] font-black uppercase">Simpan</span>
                                    </button>
                                    <button onClick={handleLoadDesign} className="flex flex-col items-center gap-2 p-3 rounded-xl glass-button text-slate-500">
                                        <FolderOpen size={18} />
                                        <span className="text-[8px] font-black uppercase">Muat</span>
                                    </button>
                                    <button onClick={handleReset} className="flex flex-col items-center gap-2 p-3 rounded-xl glass-button text-slate-500">
                                        <RefreshCw size={18} />
                                        <span className="text-[8px] font-black uppercase">Reset</span>
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={downloadCard} 
                                className="w-full h-16 rounded-2xl bg-primary-500 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Download size={20} />
                                Unduh Hasil Akhir
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="glass-card !bg-[#030712]/40 min-h-[600px] flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 blur-[120px] rounded-full -ml-32 -mb-32" />
                                
                                <div className="relative transition-all duration-700 group-hover:scale-105" style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                                    <div ref={cardRef} className={cardClasses} style={cardStyles}>
                                        <div className="absolute inset-0 z-0" style={{ backgroundColor: hexToRgba(settings.overlayColor, settings.overlayOpacity) }}></div>
                                        <div className="absolute top-0 left-0 w-full h-1/3" style={{ background: `linear-gradient(to right, ${settings.headerColor1}, ${settings.headerColor2})` }}></div>

                                        <div className="relative z-10 w-full h-full text-center" style={{ color: settings.textColor }}>
                                            {settings.layout === 'vertical' ? (
                                                <div className="flex flex-col h-full justify-around p-2">
                                                    <Draggable bounds="parent" defaultPosition={settings.logoPosition} onStop={(e, data) => handleSettingChange('logoPosition', { x: data.x, y: data.y })} nodeRef={logoRef}>
                                                        <div className="cursor-move" ref={logoRef}>
                                                            {settings.logo && <img src={settings.logo} alt="Logo" className="w-12 h-12 mx-auto object-contain" />}
                                                            <h2 className="font-bold text-[10px] leading-tight uppercase tracking-tight">{settings.university}</h2>
                                                            <p className="text-[8px] font-medium opacity-80">Identity Card</p>
                                                        </div>
                                                    </Draggable>
                                                    <Draggable bounds="parent" defaultPosition={settings.photoPosition} onStop={(e, data) => handleSettingChange('photoPosition', { x: data.x, y: data.y })} nodeRef={photoRef}>
                                                        <div className="cursor-move" ref={photoRef}>
                                                            <div className="w-20 h-24 mx-auto rounded-xl shadow-2xl border-2 border-white/20 overflow-hidden">
                                                                {settings.photo && <img src={settings.photo} alt="Student" className={'w-full h-full object-cover'} />}
                                                            </div>
                                                            <h3 className="font-black text-sm mt-2 leading-tight uppercase tracking-tight">{settings.name}</h3>
                                                            <p className="text-[10px] font-bold opacity-90">{settings.studentId}</p>
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-primary-500 mt-1">{settings.major}</p>
                                                        </div>
                                                    </Draggable>
                                                    <div className="text-[8px] w-full pt-2">
                                                        {settings.qrCodeValue && <div className="mx-auto w-fit p-1 bg-white rounded-lg shadow-lg"><QRCode value={settings.qrCodeValue} size={48} bgColor={settings.qrBgColor} fgColor={settings.qrFgColor} /></div>}
                                                        <div className="flex justify-between mt-2 px-2 font-bold opacity-60">
                                                            <span>ISSUE: {settings.issueDate}</span>
                                                            <span>EXP: {settings.expiryDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-row w-full h-full text-[10px] leading-tight items-center">
                                                    <Draggable bounds="parent" defaultPosition={settings.photoPosition} onStop={(e, data) => handleSettingChange('photoPosition', { x: data.x, y: data.y })} nodeRef={photoRef}>
                                                        <div className="w-[118px] flex-shrink-0 p-4 cursor-move" ref={photoRef}>
                                                            <div className="w-20 h-24 rounded-xl shadow-2xl border-2 border-white/20 overflow-hidden">
                                                                {settings.photo && <img src={settings.photo} alt="Student" className="w-full h-full object-cover" />}
                                                            </div>
                                                        </div>
                                                    </Draggable>
                                                    <div className="flex-grow h-full flex flex-col justify-between p-4 text-left">
                                                        <Draggable bounds="parent" defaultPosition={settings.logoPosition} onStop={(e, data) => handleSettingChange('logoPosition', { x: data.x, y: data.y })} nodeRef={logoRef}>
                                                            <div className="flex items-center gap-3 cursor-move" ref={logoRef}>
                                                                {settings.logo && <img src={settings.logo} alt="Logo" className="w-10 h-10 object-contain" />}
                                                                <div className="flex-grow">
                                                                    <h2 className="font-black text-[10px] uppercase tracking-tight leading-snug">{settings.university}</h2>
                                                                    <p className="text-[8px] font-medium opacity-80">Official Student Card</p>
                                                                </div>
                                                            </div>
                                                        </Draggable>
                                                        <div className="leading-snug space-y-0.5">
                                                            <h3 className="font-black text-xs uppercase tracking-tight">{settings.name}</h3>
                                                            <p className="text-[10px] font-bold opacity-90">{settings.studentId}</p>
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-primary-500">{settings.major}</p>
                                                        </div>
                                                        <div className="flex justify-between items-end gap-2">
                                                            <div className="text-[7px] font-bold opacity-60 leading-relaxed uppercase">
                                                                <p>Issued: {settings.issueDate}</p>
                                                                <p>Expiry: {settings.expiryDate}</p>
                                                            </div>
                                                            {settings.qrCodeValue && <div className="p-1 bg-white rounded-lg shadow-lg"><QRCode value={settings.qrCodeValue} size={42} bgColor={settings.qrBgColor} fgColor={settings.qrFgColor} /></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layer Precision</p>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Drag element di dalam preview untuk kustomisasi posisi</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">High Res</span>
                                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdCardGeneratorClient;