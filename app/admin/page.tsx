// app/admin/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/lib/prompts';
import toast from 'react-hot-toast';
import {
    Home, Send, Lightbulb, RotateCcw, X, Info, LayoutTemplate, LinkIcon,
    User, Calendar, Tag, WrenchIcon, Image as ImageIcon, Text, MessageSquareOff,
    NotebookText, HelpCircle, Mail, Hash, MessageSquareText, Maximize
} from 'lucide-react';
import Link from 'next/link';
import { authors } from '@/lib/authors/authors';
import ImageModal from '../../components/ImageModal';
import Accordion from '../../components/Accordion';
import TextareaModal from '../../components/TextareaModal';
import { Turnstile } from '@marsidev/react-turnstile';
import { AdBanner } from '@/components/AdBanner';


type NewPromptForm = Omit<Prompt, 'id'>;

const INITIAL_FORM_DATA: NewPromptForm = {
    slug: '',
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    toolsUsed: [],
    thumbnailUrl: '',
    shortDescription: '',
    fullPrompt: '',
    negativePrompt: undefined,
    notes: undefined,
};

const TUTORIAL_STEPS = [
    { title: "Selamat Datang di Panduan Prompt!", description: "Ikuti panduan langkah demi langkah ini untuk membuat prompt AI yang efektif dan menarik. Pastikan setiap kolom diisi dengan benar untuk hasil terbaik.", icon: <Lightbulb size={24} className="text-blue-500" /> },
    { title: "1. Judul Prompt", description: "Berikan judul yang jelas dan menarik untuk prompt Anda. Judul ini akan terlihat oleh semua pengguna. Contoh: `Prompt Gambar Pemandangan Fantasi`.", icon: <Text size={24} className="text-purple-500" /> },
    { title: "2. Slug (URL Unik)", description: "Ini adalah bagian dari URL unik untuk halaman detail prompt Anda. Gunakan huruf kecil, angka, dan tanda hubung (-) saja. Contoh: `pemandangan-fantasi-gunung`.", icon: <LinkIcon size={24} className="text-green-500" /> },
    { title: "3. Penulis", description: "Nama Anda atau nama kontributor lain sebagai penulis prompt ini. Pilih dari daftar dropdown atau masukkan nama penulis kustom.", icon: <User size={24} className="text-yellow-500" /> },
    { title: "4. Tanggal Publikasi", description: "Tanggal prompt ini dipublikasikan. Anda bisa memilih tanggal saat ini atau tanggal di masa lalu/depan.", icon: <Calendar size={24} className="text-red-500" /> },
    { title: "5. Kategori", description: "Kategori utama prompt Anda. Anda dapat memilih dari kategori yang sudah ada atau menambahkan kategori kustom, pisahkan dengan koma jika ada beberapa. Contoh: `Gambar, Seni Digital, Mode`.", icon: <Tag size={24} className="text-indigo-500" /> },
    { title: "6. Alat yang Digunakan", description: "Sebutkan alat atau model AI yang direkomendasikan atau digunakan. Anda dapat memilih dari alat yang sudah ada atau menambahkan alat kustom, pisahkan dengan koma jika ada beberapa. Contoh: `Midjourney V6, DALL-E 3, Gemini`.", icon: <WrenchIcon size={24} className="text-teal-500" /> },
    {
        title: "7. URL Thumbnail",
        description: `URL gambar yang akan menjadi thumbnail (pratinjau) untuk prompt ini di daftar. Gambar harus dapat diakses publik.
        Gunakan <strong>Generator Link Thumbnail Otomatis</strong> atau <strong>Unggah Gambar Langsung</strong> di bawah ini untuk kemudahan. Atau, jika Anda memiliki URL dari sumber lain (seperti Imgur, Flickr, atau file publik Anda), tempelkan langsung ke kolom input.`,
        icon: <ImageIcon size={24} className="text-orange-500" />
    },
    { title: "8. Deskripsi Singkat", description: "Deskripsi singkat (maksimal 2-3 kalimat) yang akan muncul di daftar prompt. Buatlah ringkas dan menarik. Contoh: `Gambar pemandangan indah dengan gunung salju di bawah cahaya matahari terbit.`", icon: <LayoutTemplate size={24} className="text-pink-500" /> },
    { title: "9. Isi Prompt Lengkap", description: "Ini adalah prompt utama yang akan disalin pengguna. Tuliskan instruksi sejelas dan sedetail mungkin untuk hasil terbaik. Sertakan parameter spesifik AI jika ada.", icon: <NotebookText size={24} className="text-gray-500" /> },
    { title: "10. Prompt Negatif (Opsional)", description: "Kata kunci atau konsep yang ingin Anda hindari dalam hasil AI. Pisahkan dengan koma. Contoh: `buruk, jelek, distorsi`.", icon: <MessageSquareOff size={24} className="text-cyan-500" /> },
    { title: "11. Catatan (Opsional)", description: "Berikan tips tambahan, saran, atau informasi berguna lainnya untuk pengguna yang ingin mengadaptasi prompt ini. Contoh: `Gunakan parameter --ar 16:9 untuk rasio aspek widescreen.`", icon: <Info size={24} className="text-lime-500" /> },
    { title: "Selesai!", description: "Anda telah menyelesaikan panduan pengisian prompt. Klik 'Tutup' untuk kembali ke formulir dan mulai berkontribusi!", icon: <Lightbulb size={24} className="text-blue-500" /> }
];

const PREDEFINED_CATEGORIES = ['Gambar', 'Teks', 'Audio', 'Desain', 'Fantasi', 'Edukasi', 'Video', 'Seni Digital', 'Mode'];
const PREDEFINED_TOOLS = ['DALL-E 3', 'Midjourney', 'Stable Diffusion', 'Gemini', 'ChatGPT', 'Adobe Photoshop', 'RunwayML', 'ElevenLabs', 'Canva AI'];


export default function AdminPromptPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<NewPromptForm>(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(false);

    const [showTutorialModal, setShowTutorialModal] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
    const [requesterEmail, setRequesterEmail] = useState('');
    const [promptSlugToDelete, setPromptSlugToDelete] = useState('');
    const [deletionReason, setDeletionReason] = useState('');
    const [sendingDeleteRequest, setSendingDeleteRequest] = useState(false);

    const [promptInputForGenerator, setPromptInputForGenerator] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
    const [uploadingDirectFile, setUploadingDirectFile] = useState(false);

    const [showZoomModal, setShowZoomModal] = useState(false);
    const [showFullPromptModal, setShowFullPromptModal] = useState(false);

    // State untuk token Turnstile
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory] = useState<string>('');
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [customTools, setCustomTools] = useState<string>('');


    useEffect(() => {
        // Logika lain jika ada yang perlu dijalankan saat mount
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFullPromptTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, fullPrompt: e.target.value }));
    };


    const handleDropdownMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setState(selectedOptions);
    };

    const handleResetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setSelectedCategories([]);
        setCustomCategory('');
        setSelectedTools([]);
        setCustomTools('');
        setPromptInputForGenerator('');
        setCopySuccess('');
        setSelectedUploadFile(null);
        setUploadingDirectFile(false);
        setShowZoomModal(false);
        setShowFullPromptModal(false);
        setTurnstileToken(null); // Reset Turnstile token on form reset
        toast.success("Formulir telah direset!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validasi Turnstile Token
        if (!turnstileToken) {
            toast.error("Mohon selesaikan tantangan keamanan.");
            setLoading(false);
            return;
        }

        try {
            const fullPromptContent = formData.fullPrompt;
            if (!fullPromptContent.trim() || !formData.title.trim() || !formData.author.trim() || !formData.slug.trim()) {
                toast.error("Judul, Penulis, Slug, dan Isi Prompt lengkap wajib diisi.");
                setLoading(false);
                return;
            }

            const cleanSlug = formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            const finalCategories = [...selectedCategories];
            if (customCategory.trim()) {
                customCategory.split(',').map(c => c.trim()).filter(c => c !== '').forEach(c => {
                    if (!finalCategories.includes(c)) finalCategories.push(c);
                });
            }

            const finalTools = [...selectedTools];
            if (customTools.trim()) {
                customTools.split(',').map(t => t.trim()).filter(t => t !== '').forEach(t => {
                    if (!finalTools.includes(t)) finalTools.push(t);
                });
            }

            const dataToSend: Prompt & { turnstileToken?: string | null } = {
                ...formData,
                slug: cleanSlug,
                category: finalCategories.join(', '),
                toolsUsed: finalTools,
                fullPrompt: fullPromptContent,
                date: new Date(formData.date).toISOString(),
                negativePrompt: formData.negativePrompt?.trim() === '' ? null : formData.negativePrompt,
                notes: formData.notes?.trim() === '' ? null : formData.notes,
                turnstileToken: turnstileToken, // Sertakan token Turnstile
            };

            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambahkan prompt.');
            }

            toast.success("Prompt berhasil ditambahkan!");
            handleResetForm();
            router.push('/prompt');
        } catch (error) {
            console.error("Error adding prompt:", error);
            toast.error(`Error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
            setTurnstileToken(null); // Reset token setelah submission
        }
    };

    const handleDeleteRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingDeleteRequest(true);

        try {
            if (!requesterEmail.trim() || !promptSlugToDelete.trim() || !deletionReason.trim()) {
                toast.error("Semua kolom wajib diisi.");
                setSendingDeleteRequest(false);
                return;
            }
            // Jika Anda ingin Turnstile melindungi form ini juga, tambahkan pengecekan token di sini
            // dan sertakan token dalam body permintaan.

            const response = await fetch('/api/delete-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: requesterEmail,
                    slug: promptSlugToDelete,
                    reason: deletionReason,
                    // turnstileToken: turnstileToken, // Sertakan token jika Turnstile juga melindungi form ini
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengirim permintaan hapus.');
            }

            toast.success("Permintaan hapus Anda telah terkirim! Admin akan meninjau permintaan Anda.");
            setShowDeleteRequestModal(false);
            setRequesterEmail('');
            setPromptSlugToDelete('');
            setDeletionReason('');
        } catch (error) {
            console.error("Error sending delete request:", error);
            toast.error(`Error: ${(error as Error).message}`);
        } finally {
            setSendingDeleteRequest(false);
            setTurnstileToken(null); // Reset token setelah submission
        }
    };

    const generateThumbnailLink = () => {
        if (!promptInputForGenerator.trim()) {
            toast.error('Mohon masukkan prompt terlebih dahulu untuk menghasilkan link.');
            return;
        }

        const encodedPrompt = encodeURIComponent(promptInputForGenerator.trim());
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=gptimage&nologo=true`;
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
        setCopySuccess('');
        toast.success('Link thumbnail berhasil dihasilkan dan diterapkan!');
    };

    const copyToClipboard = () => {
        if (formData.thumbnailUrl) {
            navigator.clipboard.writeText(formData.thumbnailUrl).then(() => {
                setCopySuccess('Link berhasil disalin!');
                toast.success('Link disalin ke clipboard!');
            }).catch(err => {
                setCopySuccess('Gagal menyalin link.');
                toast.error('Gagal menyalin link.');
                console.error('Failed to copy: ', err);
            });
        }
    };

    const handleDirectFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedUploadFile(e.target.files?.[0] || null);
        setCopySuccess('');
        setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
    };

    const handleUploadDirectFileToCloudinary = async () => {
        if (!selectedUploadFile) {
            toast.error('Pilih file gambar terlebih dahulu untuk diunggah.');
            return;
        }

        setUploadingDirectFile(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedUploadFile);

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengunggah gambar langsung.');
            }

            const data = await response.json();
            setFormData(prev => ({ ...prev, thumbnailUrl: data.url }));
            toast.success('Gambar berhasil diunggah langsung ke Cloudinary!');
            setSelectedUploadFile(null);
        } catch (error) {
            console.error('Error uploading direct image:', error);
            toast.error(`Gagal mengunggah gambar langsung: ${(error as Error).message}`);
        } finally {
            setUploadingDirectFile(false);
        }
    };


    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-neumorphic">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Tambah Prompt Baru</h1>

                <div className="mb-8 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/prompt"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <Home size={20} />
                        <span>Lihat Semua Prompt</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            setShowTutorialModal(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <Lightbulb size={20} /> {/* Hanya ikon */}
                    </button>
                    <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <RotateCcw size={20} />
                        <span>Isi Prompt Baru</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Prompt</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Contoh: Prompt Gambar Pemandangan Fantasi"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL unik)</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Contoh: pemandangan-fantasi-gunung"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Gunakan huruf kecil, pisahkan dengan tanda hubung, tanpa karakter khusus.</p>
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Penulis</label>
                        <div className="relative mb-2">
                            <select
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-8"
                            >
                                <option value="" disabled>Pilih Penulis dari daftar</option>
                                {authors.map((author) => (
                                    <option key={author.slug} value={author.name}>
                                        {author.name} {author.aka ? `(${author.aka})` : ''}
                                    </option>
                                ))}
                            </select>
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                        <input
                            type="text"
                            id="customAuthor"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Atau masukkan nama penulis kustom di sini"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Publikasi</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date.split('T')[0]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    {/* --- Kategori Dropdown Multi-Pilih --- */}
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                        <select
                            id="categories"
                            name="categories"
                            multiple
                            value={selectedCategories}
                            onChange={(e) => handleDropdownMultiSelectChange(e, setSelectedCategories)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 overflow-y-auto"
                        >
                            {PREDEFINED_CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-1">Pilih satu atau lebih kategori dari daftar. Gunakan Ctrl/Cmd + klik untuk memilih beberapa.</p>
                        <input
                            type="text"
                            id="customCategory"
                            name="customCategory"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Atau tambahkan kategori kustom (pisahkan dengan koma)"
                        />
                    </div>
                    {/* --- Akhir Kategori Dropdown Multi-Pilih --- */}

                    {/* --- Alat yang Digunakan Dropdown Multi-Pilih --- */}
                    <div>
                        <label htmlFor="tools" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alat yang Digunakan</label>
                        <select
                            id="tools"
                            name="tools"
                            multiple
                            value={selectedTools}
                            onChange={(e) => handleDropdownMultiSelectChange(e, setSelectedTools)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 overflow-y-auto"
                        >
                            {PREDEFINED_TOOLS.map(tool => (
                                <option key={tool} value={tool}>
                                    {tool}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-1">Pilih satu atau lebih alat dari daftar. Gunakan Ctrl/Cmd + klik untuk memilih beberapa.</p>
                        <input
                            type="text"
                            id="customTools"
                            name="customTools"
                            value={customTools}
                            onChange={(e) => setCustomTools(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Atau tambahkan alat kustom (pisahkan dengan koma)"
                        />
                    </div>
                    {/* --- Akhir Alat yang Digunakan Dropdown Multi-Pilih --- */}

                    {/* --- Bagian Generator Link Thumbnail Otomatis --- */}
                    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-gray-50 dark:bg-gray-850">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                            <ImageIcon size={20} className="text-blue-500" /> Generator Link Thumbnail Otomatis (dari Pollinations.ai)
                        </h2>
                        <div className="mb-4">
                            <label htmlFor="promptForThumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Masukkan Prompt untuk Thumbnail:
                            </label>
                            <textarea
                                id="promptForThumbnail"
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Contoh: seekor kucing berbulu pelangi, gaya seni lukisan minyak"
                                value={promptInputForGenerator}
                                onChange={(e) => setPromptInputForGenerator(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            onClick={generateThumbnailLink}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 font-bold"
                            disabled={loading || uploadingDirectFile}
                        >
                            Hasilkan Link Thumbnail
                        </button>
                    </div>
                    {/* --- Akhir Bagian Generator Link Thumbnail Otomatis --- */}

                    {/* --- Bagian Unggah Gambar Langsung ke Cloudinary --- */}
                    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-gray-50 dark:bg-gray-850 mt-6">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                            <ImageIcon size={20} className="text-purple-500" /> Unggah Gambar Langsung (ke Cloudinary)
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Unggah file gambar langsung dari komputer Anda ke Cloudinary untuk digunakan sebagai thumbnail.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                type="file"
                                id="directThumbnailUpload"
                                accept="image/*"
                                onChange={handleDirectFileSelect}
                                className="block w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-full file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-purple-50 file:text-purple-700
                                           hover:file:bg-purple-100 dark:file:bg-dark-neumorphic-dark dark:file:text-white dark:hover:file:bg-dark-neumorphic-light
                                           dark:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={handleUploadDirectFileToCloudinary}
                                disabled={!selectedUploadFile || uploadingDirectFile || loading}
                                className="shrink-0 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800 font-bold
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadingDirectFile ? 'Mengunggah...' : 'Unggah File'}
                            </button>
                        </div>
                        {selectedUploadFile && !uploadingDirectFile && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                File yang dipilih: <span className="font-medium">{selectedUploadFile.name}</span>
                            </p>
                        )}
                        {uploadingDirectFile && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Proses unggah...</p>}
                    </div>
                    {/* --- Akhir Bagian Unggah Gambar Langsung ke Cloudinary --- */}


                    {/* Input URL Thumbnail */}
                    <div>
                        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Thumbnail</label>
                        <input
                            type="text"
                            id="thumbnailUrl"
                            name="thumbnailUrl"
                            value={formData.thumbnailUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Tempel URL gambar atau gunakan generator/unggahan di atas"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Gunakan URL gambar yang dapat diakses publik. Kolom ini akan otomatis terisi jika Anda menggunakan generator atau unggah langsung di atas.
                        </p>
                        {copySuccess && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{copySuccess}</p>}
                    </div>
                    {/* Pratinjau Gambar Thumbnail yang Dapat di-zoom (KONSOLIDASI) */}
                    {formData.thumbnailUrl && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-neumorphic-dark rounded-lg shadow-inner flex flex-col items-center">
                            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Pratinjau Thumbnail yang Tersimpan:</h3>
                            <img
                                src={formData.thumbnailUrl}
                                alt="Thumbnail Pratinjau"
                                className="w-32 h-32 object-cover rounded-md shadow-md cursor-pointer
                                           transition-transform duration-200 hover:scale-105"
                                onClick={() => setShowZoomModal(true)}
                            />
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className="mt-3 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-800 text-sm font-medium"
                            >
                                Salin URL Thumbnail
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 break-words mt-2 text-center">
                                Klik gambar untuk memperbesar.
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Deskripsi singkat (maksimal 2-3 kalimat) yang akan muncul di daftar prompt. Contoh: Gambar pemandangan indah dengan gunung salju di bawah cahaya matahari terbit."
                        ></textarea>
                    </div>
                    {/* --- Isi Prompt Lengkap (Textarea dengan tombol buka modal) --- */}
                    <div>
                        <label htmlFor="fullPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Isi Prompt Lengkap</label>
                        <div className="relative">
                            <textarea
                                id="fullPrompt"
                                name="fullPrompt"
                                value={formData.fullPrompt}
                                onChange={handleFullPromptTextareaChange}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto"
                                placeholder="Tuliskan instruksi prompt utama di sini. Tulis sejelas dan sedetail mungkin untuk hasil terbaik. Sertakan parameter spesifik AI jika ada."
                            ></textarea>
                            <button
                                type="button"
                                onClick={() => setShowFullPromptModal(true)}
                                className="absolute top-2 right-2 p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                title="Edit di layar penuh"
                            >
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                    {/* --- Akhir Isi Prompt Lengkap --- */}

                    {/* --- Bagian Prompt Negatif (Kolapsibel) --- */}
                    <Accordion title="Prompt Negatif (Opsional)" className="mt-6">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Kata kunci atau konsep yang ingin Anda hindari dalam hasil AI. Pisahkan dengan koma.</p>
                        <textarea
                            id="negativePrompt"
                            name="negativePrompt"
                            value={formData.negativePrompt || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Contoh: buruk, jelek, distorsi"
                        ></textarea>
                    </Accordion>
                    {/* --- Akhir Bagian Prompt Negatif --- */}

                    {/* --- Bagian Catatan (Kolapsibel) --- */}
                    <Accordion title="Catatan (Opsional)" className="mt-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Berikan tips tambahan, saran, atau informasi berguna lainnya untuk pengguna yang ingin mengadaptasi prompt ini.</p>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Contoh: Gunakan parameter --ar 16:9 untuk rasio aspek widescreen."
                        ></textarea>
                    </Accordion>
                    {/* --- Akhir Bagian Catatan --- */}

                    <button
                        type="submit"
                        disabled={loading || uploadingDirectFile || !turnstileToken}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menambahkan...' : (
                            <>
                                <Send size={20} />
                                <span>Tambahkan Prompt</span>
                            </>
                        )}
                    </button>
                    {/* --- Komponen Turnstile --- */}
                    <div className="flex justify-center mt-4">
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string}
                            onSuccess={setTurnstileToken} // Menggunakan onSuccess
                            onError={() => {
                                setTurnstileToken(null);
                                toast.error("Turnstile error. Mohon coba lagi.");
                            }}
                            onExpire={() => {
                                setTurnstileToken(null);
                                toast.error("Turnstile expired. Mohon selesaikan lagi.");
                            }}
                        />
                    </div>
                    {/* ------------------------- */}
                    <button
                        type="button"
                        onClick={() => setShowDeleteRequestModal(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-red-500 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <HelpCircle size={20} />
                        <span>Minta Penghapusan Prompt</span>
                    </button>
                </form>

                {/* Modal Tutorial (display utuh, tanpa tombol navigasi, gaya non-neumorphic) */}
                {showTutorialModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                            <button
                                onClick={() => setShowTutorialModal(false)}
                                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl font-bold"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Lightbulb size={24} className="text-blue-600" /> Tutorial Pengisian Prompt
                            </h2>
                            <div className="text-gray-700 dark:text-gray-300 space-y-4">
                                {TUTORIAL_STEPS.map((step, index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                            {step.icon} {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }}></p>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowTutorialModal(false)}
                                    className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Permintaan Hapus (gaya non-neumorphic) */}
                {showDeleteRequestModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-2xl shadow-lg max-w-md w-full relative">
                            <button
                                onClick={() => setShowDeleteRequestModal(false)}
                                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-2xl font-bold"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <HelpCircle size={24} className="text-red-600" /> Permintaan Hapus Prompt
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                                Jika Anda ingin prompt yang telah Anda unggah dihapus, mohon isi formulir di bawah ini. Admin akan meninjau permintaan Anda.
                            </p>
                            <form onSubmit={handleDeleteRequestSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="requesterEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Anda</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            id="requesterEmail"
                                            name="requesterEmail"
                                            value={requesterEmail}
                                            onChange={(e) => setRequesterEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="promptSlugToDelete" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug Prompt</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={20} />
                                        <input
                                            type="text"
                                            id="promptSlugToDelete"
                                            name="promptSlugToDelete"
                                            value={promptSlugToDelete}
                                            onChange={(e) => setPromptSlugToDelete(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="slug-prompt-anda"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="deletionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alasan Permintaan Hapus</label>
                                    <div className="relative">
                                        <MessageSquareText className="absolute left-3 top-3 text-gray-400" size={20} />
                                        <textarea
                                            id="deletionReason"
                                            name="deletionReason"
                                            value={deletionReason}
                                            onChange={(e) => setDeletionReason(e.target.value)}
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Contoh: Prompt tidak lagi relevan, ada kesalahan, dll."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingDeleteRequest}
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingDeleteRequest ? 'Mengirim...' : (
                                        <>
                                            <Send size={20} />
                                            <span>Kirim Permintaan</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Zoom Gambar */}
                {formData.thumbnailUrl && (
                    <ImageModal
                        isOpen={showZoomModal}
                        imageUrl={formData.thumbnailUrl}
                        onClose={() => setShowZoomModal(false)}
                    />
                )}
                {/* Modal Full Prompt (TextareaModal) */}
                {showFullPromptModal && (
                    <TextareaModal
                        isOpen={showFullPromptModal}
                        value={formData.fullPrompt}
                        onClose={() => setShowFullPromptModal(false)}
                        onChange={(newValue: string) => setFormData(prev => ({ ...prev, fullPrompt: newValue }))}
                        title="Edit Isi Prompt Lengkap"
                    />
                )}
            </div>
            <div className="w-full max-w-4xl mt-16">
        <AdBanner dataAdSlot="5961316189" />
      </div>
        </main>
    );
}