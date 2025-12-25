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
                model: 'flux',
                width: '500',
                height: '300',
                seed: Date.now().toString(),
                referrer: 'ruangriung.my.id',
                enhance: 'true',
                nologo: 'true'
            });

            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(bgPrompt)}?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Gagal mengambil gambar dari API (Status: ${response.status})`);
            }

            handleSettingChange('background', response.url);
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
        <div className="container mx-auto px-4 py-8">
            {/* --- UI PENGATURAN (TIDAK ADA PERUBAHAN) --- */}
            <div className="mb-8 flex justify-between items-center w-full max-w-lg mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
                >
                    <ArrowLeft size={18} />
                    <span>Beranda</span>
                </Link>
                <div className="w-36">
                    <ThemeToggle />
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">ID Card Mahasiswa Generator</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Pengaturan Kartu</h2>

                    <div className="space-y-4">
                        <details className="space-y-2 p-2 border dark:border-gray-700 rounded-md" open>
                            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">Desain & Tata Letak</summary>
                            <div className="pt-2">
                                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Template</label>
                                <div className="flex gap-2">
                                    <button onClick={() => applyTemplate('modern')} className="flex-1 p-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Modern</button>
                                    <button onClick={() => applyTemplate('classic')} className="flex-1 p-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Klasik</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Layout</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleSettingChange('layout', 'horizontal')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${settings.layout === 'horizontal' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><ToggleLeft size={20} /></button>
                                    <button onClick={() => handleSettingChange('layout', 'vertical')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${settings.layout === 'vertical' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}><ToggleRight size={20} /></button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Jenis Font</label>
                                <select value={settings.fontFamily} onChange={e => handleSettingChange('fontFamily', e.target.value)} className={inputBaseStyle}>
                                    <option>Arial</option> <option>Verdana</option> <option>Georgia</option>
                                    <option>Times New Roman</option> <option>Courier New</option>
                                </select>
                            </div>
                        </details>

                        <details className="space-y-2 p-2 border dark:border-gray-700 rounded-md" open>
                            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">Warna & Tampilan</summary>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="relative" title="Warna Teks"><Type size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.textColor} onChange={e => handleSettingChange('textColor', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                                <div className="relative" title="Warna Latar Kartu"><Palette size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.cardBgColor} onChange={e => handleSettingChange('cardBgColor', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                                <div className="relative" title="Gradien Atas 1"><Paintbrush size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.headerColor1} onChange={e => handleSettingChange('headerColor1', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                                <div className="relative" title="Gradien Atas 2"><Paintbrush size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.headerColor2} onChange={e => handleSettingChange('headerColor2', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                                <div className="relative" title="Warna Latar QR"><QrCode size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.qrBgColor} onChange={e => handleSettingChange('qrBgColor', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                                <div className="relative" title="Warna QR Code"><QrCode size={20} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" /><input type="color" value={settings.qrFgColor} onChange={e => handleSettingChange('qrFgColor', e.target.value)} className="w-full pl-8 pr-1 py-1 h-10 bg-white dark:bg-gray-900 border rounded-md" /></div>
                            </div>
                            <div className="mt-2">
                                <label className="flex items-center gap-2 text-sm font-medium mb-1 text-gray-600 dark:text-gray-300"><Layers size={16} /> Opacity Overlay: {Math.round(settings.overlayOpacity * 100)}%</label>
                                <input type="range" min="0" max="1" step="0.1" value={settings.overlayOpacity} onChange={e => handleSettingChange('overlayOpacity', parseFloat(e.target.value))} className="w-full" />
                            </div>
                        </details>

                        <details className="space-y-4 p-2 border dark:border-gray-700 rounded-md" open>
                            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">Data Mahasiswa</summary>
                            <input type="text" placeholder="Nama Lengkap" value={settings.name} onChange={e => handleSettingChange('name', e.target.value)} className={inputBaseStyle} />
                            <input type="text" placeholder="NIM" value={settings.studentId} onChange={e => handleSettingChange('studentId', e.target.value)} className={inputBaseStyle} />
                            <input type="text" placeholder="Jurusan" value={settings.major} onChange={e => handleSettingChange('major', e.target.value)} className={inputBaseStyle} />
                            <input type="text" placeholder="Universitas" value={settings.university} onChange={e => handleSettingChange('university', e.target.value)} className={inputBaseStyle} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" title="Tgl Terbit" value={settings.issueDate} onChange={e => handleSettingChange('issueDate', e.target.value)} className={inputBaseStyle} />
                                <input type="date" title="Tgl Kadaluwarsa" value={settings.expiryDate} onChange={e => handleSettingChange('expiryDate', e.target.value)} className={inputBaseStyle} />
                            </div>
                        </details>

                        <details className="space-y-2 p-2 border dark:border-gray-700 rounded-md">
                            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">QR Code</summary>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300"><input type="radio" name="qrType" value="dynamic" checked={settings.qrCodeContentType === 'dynamic'} onChange={e => handleSettingChange('qrCodeContentType', e.target.value)} /> Dinamis</label>
                                <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300"><input type="radio" name="qrType" value="manual" checked={settings.qrCodeContentType === 'manual'} onChange={e => handleSettingChange('qrCodeContentType', e.target.value)} /> Manual</label>
                            </div>
                            {settings.qrCodeContentType === 'manual' && (
                                <div className="relative mt-2">
                                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="https://..." value={settings.qrCodeValue} onChange={e => handleSettingChange('qrCodeValue', e.target.value)} className={`${inputBaseStyle} pl-8`} />
                                </div>
                            )}
                        </details>

                        <details className="p-2 border dark:border-gray-700 rounded-md" open>
                            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">Gambar</summary>
                            <div className="space-y-2 mt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <label className="w-full cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-center py-2 px-2 rounded-md"><ImageIcon size={16} className="inline-block mr-1" /> Foto <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'photo')} /></label>
                                    <label className="w-full cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-center py-2 px-2 rounded-md"><Building size={16} className="inline-block mr-1" /> Logo <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} /></label>
                                    <label className="w-full cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-center py-2 px-2 rounded-md"><FileText size={16} className="inline-block mr-1" /> Unggah BG <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'background')} /></label>
                                </div>
                                <div className="pt-2">
                                    <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Generate Background AI</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="misal: abstract blue pattern" value={bgPrompt} onChange={e => setBgPrompt(e.target.value)} className={`${inputBaseStyle} flex-grow`} />
                                        <button onClick={handleGenerateBg} disabled={isGeneratingBg} className="p-2 bg-purple-500 text-white rounded-md disabled:bg-gray-400">
                                            {isGeneratingBg ? <RefreshCw className="animate-spin" /> : <Wand2 />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <div className="flex flex-wrap gap-2 pt-4">
                            <button onClick={handleSaveDesign} className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"><Save size={16} /> Simpan</button>
                            <button onClick={handleLoadDesign} className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"><FolderOpen size={16} /> Muat</button>
                            <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"><RefreshCw size={16} /> Reset</button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button onClick={downloadCard} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md">
                            <Download size={20} /> Unduh Kartu (.png)
                        </button>
                    </div>
                </div>

                {/* --- Card Preview --- */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-900 p-6 rounded-lg min-h-[550px]">
                    <div style={{ transform: 'scale(1.25)', transformOrigin: 'center' }}>
                        <div ref={cardRef} className={cardClasses} style={cardStyles}>
                            <div className="absolute inset-0 z-0" style={{ backgroundColor: hexToRgba(settings.overlayColor, settings.overlayOpacity) }}></div>
                            <div className="absolute top-0 left-0 w-full h-1/3" style={{ background: `linear-gradient(to right, ${settings.headerColor1}, ${settings.headerColor2})` }}></div>

                            <div className="relative z-10 w-full h-full text-center" style={{ color: settings.textColor }}>
                                {settings.layout === 'vertical' ? (
                                    <div className="flex flex-col h-full justify-around p-2">
                                        <Draggable bounds="parent" defaultPosition={settings.logoPosition} onStop={(e, data) => handleSettingChange('logoPosition', { x: data.x, y: data.y })} nodeRef={logoRef}>
                                            <div className="cursor-move" ref={logoRef}>
                                                {settings.logo && <img src={settings.logo} alt="Logo" className="w-12 h-12 mx-auto object-contain" />}
                                                <h2 className="font-bold text-sm leading-tight">{settings.university}</h2>
                                                <p className="text-[10px]">Kartu Tanda Mahasiswa</p>
                                            </div>
                                        </Draggable>
                                        <Draggable bounds="parent" defaultPosition={settings.photoPosition} onStop={(e, data) => handleSettingChange('photoPosition', { x: data.x, y: data.y })} nodeRef={photoRef}>
                                            <div className="cursor-move" ref={photoRef}>
                                                <div className="w-20 h-24 mx-auto rounded-md shadow-md overflow-hidden">
                                                    {settings.photo && <img src={settings.photo} alt="Student" className={'w-full h-full object-cover'} />}
                                                </div>
                                                <h3 className="font-bold text-lg mt-1 leading-tight">{settings.name}</h3>
                                                <p className="text-xs">{settings.studentId}</p>
                                                <p className="text-xs font-semibold">{settings.major}</p>
                                            </div>
                                        </Draggable>
                                        <div className="text-[9px] w-full">
                                            {settings.qrCodeValue && <div className="mx-auto w-fit p-1 bg-white rounded-md"><QRCode value={settings.qrCodeValue} size={56} bgColor={settings.qrBgColor} fgColor={settings.qrFgColor} /></div>}
                                            <div className="flex justify-between mt-1 px-1">
                                                <span>Terbit: {settings.issueDate}</span>
                                                <span>Berlaku: {settings.expiryDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-row w-full h-full text-[10px] leading-tight items-center">
                                        <Draggable bounds="parent" defaultPosition={settings.photoPosition} onStop={(e, data) => handleSettingChange('photoPosition', { x: data.x, y: data.y })} nodeRef={photoRef}>
                                            <div className="w-[118px] flex-shrink-0 p-2 cursor-move" ref={photoRef}>
                                                <div className="w-20 h-24 rounded-md shadow-md overflow-hidden">
                                                    {settings.photo && <img src={settings.photo} alt="Student" className="w-full h-full object-cover" />}
                                                </div>
                                            </div>
                                        </Draggable>
                                        <div className="flex-grow h-full flex flex-col justify-between p-2 text-left">
                                            <Draggable bounds="parent" defaultPosition={settings.logoPosition} onStop={(e, data) => handleSettingChange('logoPosition', { x: data.x, y: data.y })} nodeRef={logoRef}>
                                                <div className="flex items-center gap-2 cursor-move" ref={logoRef}>
                                                    {settings.logo && <img src={settings.logo} alt="Logo" className="w-8 h-8 object-contain" />}
                                                    <div className="flex-grow">
                                                        <h2 className="font-bold text-xs leading-snug">{settings.university}</h2>
                                                        <p className="text-[9px]">Kartu Tanda Mahasiswa</p>
                                                    </div>
                                                </div>
                                            </Draggable>
                                            <div className="text-xs leading-snug">
                                                <h3 className="font-bold text-sm mb-0.5">{settings.name}</h3>
                                                <p>{settings.studentId}</p>
                                                <p className="font-semibold">{settings.major}</p>
                                            </div>
                                            <div className="flex justify-between items-end gap-2">
                                                <div className="text-[8px]">
                                                    <p>Tgl Terbit: {settings.issueDate}</p>
                                                    <p>Masa Berlaku: {settings.expiryDate}</p>
                                                </div>
                                                {settings.qrCodeValue && <div className="p-1 bg-white rounded-md"><QRCode value={settings.qrCodeValue} size={48} bgColor={settings.qrBgColor} fgColor={settings.qrFgColor} /></div>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdCardGeneratorClient;