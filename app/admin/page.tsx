// ruangriung/ruangriung-generator-app/app/admin/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/lib/prompts';
import toast from 'react-hot-toast';
import { Home, Send, Lightbulb, RotateCcw, ArrowLeft, ArrowRight, X, Info, LayoutTemplate, LinkIcon, User, Calendar, Tag, WrenchIcon, Image as ImageIcon, Text, MessageSquareOff, NotebookText, HelpCircle, Mail, Hash, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { authors } from '@/lib/authors/authors';
import dynamic from 'next/dynamic'; // Import dynamic
import { Editor } from '@tinymce/tinymce-react';

// Dynamic import untuk Editor dengan SSR dinonaktifkan
const DynamicEditor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
    ssr: false, // PENTING: Jangan render di sisi server
    loading: () => <p>Memuat editor...</p>, // Fallback saat editor belum dimuat
});

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
    { title: "1. Judul Prompt", description: "Berikan judul yang jelas dan menarik untuk prompt Anda. Judul ini akan terlihat oleh semua pengguna.", icon: <Text size={24} className="text-purple-500" /> },
    { title: "2. Slug (URL Unik)", description: "Ini adalah bagian dari URL unik untuk halaman detail prompt Anda. Gunakan huruf kecil, angka, dan tanda hubung (-) saja. Contoh: `desain-poster-keren`.", icon: <LinkIcon size={24} className="text-green-500" /> },
    { title: "3. Penulis", description: "Nama Anda atau nama kontributor lain sebagai penulis prompt ini. Pilih dari daftar dropdown.", icon: <User size={24} className="text-yellow-500" /> },
    { title: "4. Tanggal Publikasi", description: "Tanggal prompt ini dipublikasikan. Anda bisa memilih tanggal saat ini atau tanggal di masa lalu/depan.", icon: <Calendar size={24} className="text-red-500" /> },
    { title: "5. Kategori", description: "Kategori utama prompt Anda. Pisahkan dengan koma jika ada beberapa. Contoh: `Gambar, Seni Digital, Mode`.", icon: <Tag size={24} className="text-indigo-500" /> },
    { title: "6. Alat yang Digunakan", description: "Sebutkan alat atau model AI yang direkomendasikan atau digunakan. Pisahkan dengan koma. Contoh: `Midjourney V6, DALL-E 3, Gemini`.", icon: <WrenchIcon size={24} className="text-teal-500" /> }, // WrenchIcon
    {
        title: "7. URL Thumbnail",
        description: `URL gambar yang akan menjadi thumbnail (pratinjau) untuk prompt ini di daftar. Gambar harus dapat diakses publik.
        Contoh layanan untuk mengunggah dan mendapatkan URL gambar:
        - <strong>Imgur</strong>: Unggah gambar, lalu cari 'Direct Link' atau 'Direct Image Link' (URL akan berakhiran .jpg, .png, dll.).
        - <strong>ImgBB</strong>: Unggah gambar, lalu pilih 'Direct Link'.
        - <strong>Flickr</strong>: Unggah foto, buka foto, klik ikon panah 'Share', lalu pilih ukuran yang diinginkan dan salin 'Direct link'.
        - Anda juga bisa menggunakan gambar yang sudah ada di folder 'public' aplikasi Anda, contoh: \`/v1/img/showcase-1.webp\`.`,
        icon: <ImageIcon size={24} className="text-orange-500" />
    },
    { title: "8. Deskripsi Singkat", description: "Deskripsi singkat (maksimal 2-3 kalimat) yang akan muncul di daftar prompt. Buatlah ringkas dan menarik.", icon: <LayoutTemplate size={24} className="text-pink-500" /> },
    { title: "9. Isi Prompt Lengkap", description: "Ini adalah prompt utama yang akan disalin pengguna. Tuliskan instruksi sejelas dan sedetail mungkin untuk hasil terbaik. Sertakan parameter spesifik AI jika ada.", icon: <NotebookText size={24} className="text-gray-500" /> },
    { title: "10. Prompt Negatif (Opsional)", description: "Kata kunci atau konsep yang ingin Anda hindari dalam hasil AI. Pisahkan dengan koma.", icon: <MessageSquareOff size={24} className="text-cyan-500" /> },
    { title: "11. Catatan (Opsional)", description: "Berikan tips tambahan, saran, atau informasi berguna lainnya untuk pengguna yang ingin mengadaptasi prompt ini.", icon: <Info size={24} className="text-lime-500" /> },
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

    // --- State baru untuk Link Generator Thumbnail ---
    const [promptInput, setPromptInput] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    // -------------------------------------------------

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory] = useState<string>('');

    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [customTools, setCustomTools] = useState<string>('');

    const editorRef = useRef<any>(null);

    // Perbaikan: Inisialisasi tinymceInit sebagai null/objek kosong yang aman
    const [tinymceInit, setTinymceInit] = useState<any | null>(null);

    // --- State baru untuk Hydration (mounted) ---
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Komponen telah terpasang di sisi klien
        // Ini hanya akan berjalan di sisi klien setelah komponen terpasang
        if (typeof window !== 'undefined') {
            setTinymceInit({
                height: 300,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                    'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
                content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default',
            });
        }
    }, []); // Array dependensi kosong agar hanya dijalankan sekali setelah mount

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content: string, editor: any) => {
        setFormData(prev => ({ ...prev, fullPrompt: content }));
    };

    const handleMultiSelectChange = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (state.includes(item)) {
            setState(state.filter(i => i !== item));
        } else {
            setState([...state, item]);
        }
    };

    const handleResetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setSelectedCategories([]);
        setCustomCategory('');
        setSelectedTools([]);
        setCustomTools('');
        if (editorRef.current) {
            editorRef.current.setContent('');
        }
        setPromptInput(''); // Reset prompt input generator
        setThumbnailUrl(''); // Reset thumbnail URL generator
        setCopySuccess(''); // Reset copy success message
        toast.success("Formulir telah direset!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fullPromptContent = editorRef.current ? editorRef.current.getContent() : formData.fullPrompt;
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

            const dataToSend: Prompt = {
                ...formData,
                slug: cleanSlug,
                category: finalCategories.join(', '),
                toolsUsed: finalTools,
                fullPrompt: fullPromptContent,
                date: new Date(formData.date).toISOString(),
                negativePrompt: formData.negativePrompt?.trim() === '' ? null : formData.negativePrompt,
                notes: formData.notes?.trim() === '' ? null : formData.notes,
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

            const response = await fetch('/api/delete-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: requesterEmail,
                    slug: promptSlugToDelete,
                    reason: deletionReason,
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
        }
    };

    // --- Fungsi baru untuk Link Generator Thumbnail ---
    const generateThumbnailLink = () => {
        if (!promptInput.trim()) {
            toast.error('Mohon masukkan prompt terlebih dahulu untuk menghasilkan link.');
            return;
        }

        const encodedPrompt = encodeURIComponent(promptInput.trim());
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=gptimage&nologo=true`;
        setThumbnailUrl(url);
        setCopySuccess(''); // Reset status salin
        toast.success('Link thumbnail berhasil dihasilkan!');
    };

    const copyToClipboard = () => {
        if (thumbnailUrl) {
            navigator.clipboard.writeText(thumbnailUrl).then(() => {
                setCopySuccess('Link berhasil disalin!');
                toast.success('Link disalin ke clipboard!');
            }).catch(err => {
                setCopySuccess('Gagal menyalin link.');
                toast.error('Gagal menyalin link.');
                console.error('Failed to copy: ', err);
            });
        }
    };
    // -------------------------------------------------


    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
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
                            setCurrentTutorialStep(0);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <Lightbulb size={20} />
                        <span>Tutorial Pengisian</span>
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
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Contoh: `judul-prompt-keren` (gunakan huruf kecil, pisahkan dengan tanda hubung, tanpa karakter khusus)</p>
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
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                            {PREDEFINED_CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleMultiSelectChange(category, selectedCategories, setSelectedCategories)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        selectedCategories.includes(category)
                                            ? 'bg-purple-600 text-white shadow-neumorphic-button-inset dark:shadow-dark-neumorphic-button-inset'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Atau tambahkan kategori kustom:</p>
                        <input
                            type="text"
                            id="customCategory"
                            name="customCategory"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Kategori kustom (pisahkan dengan koma)"
                        />
                    </div>
                    <div>
                        <label htmlFor="tools" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alat yang Digunakan</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                            {PREDEFINED_TOOLS.map(tool => (
                                <button
                                    key={tool}
                                    type="button"
                                    onClick={() => handleMultiSelectChange(tool, selectedTools, setSelectedTools)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        selectedTools.includes(tool)
                                            ? 'bg-purple-600 text-white shadow-neumorphic-button-inset dark:shadow-dark-neumorphic-button-inset'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {tool}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Atau tambahkan alat kustom:</p>
                        <input
                            type="text"
                            id="customTools"
                            name="customTools"
                            value={customTools}
                            onChange={(e) => setCustomTools(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Alat kustom (pisahkan dengan koma)"
                        />
                    </div>

                    {/* --- Bagian Generator Link Thumbnail Baru --- */}
                    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-gray-50 dark:bg-gray-850">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                            <ImageIcon size={20} className="text-blue-500" /> Generator Link Thumbnail Otomatis
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
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            onClick={generateThumbnailLink}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 font-bold"
                        >
                            Hasilkan Link Thumbnail
                        </button>

                        {thumbnailUrl && (
                            <div className="mt-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900">
                                <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-white">Link Thumbnail Dihasilkan:</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={thumbnailUrl}
                                        className="flex-grow p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 text-sm"
                                        onClick={(e) => (e.target as HTMLInputElement).select()} // Memilih semua teks saat diklik
                                    />
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-800 text-sm font-medium"
                                    >
                                        Salin Link
                                    </button>
                                </div>
                                {copySuccess && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{copySuccess}</p>}
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                                    Anda dapat menyalin link di atas dan menempelkannya ke kolom "URL Thumbnail" di bawah.
                                </p>
                            </div>
                        )}

                        {/* Opsional: Pratinjau gambar yang dihasilkan */}
                        {thumbnailUrl && (
                            <div className="mt-4">
                                <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-white">Pratinjau Gambar:</h3>
                                <img
                                    src={thumbnailUrl}
                                    alt="Generated Thumbnail Preview"
                                    className="max-w-full h-auto rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        )}
                    </div>
                    {/* --- Akhir Bagian Generator Link Thumbnail Baru --- */}

                    <div>
                        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Thumbnail</label>
                        <input
                            type="text"
                            id="thumbnailUrl"
                            name="thumbnailUrl"
                            value={formData.thumbnailUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Gunakan URL gambar yang dapat diakses publik, seperti dari GitHub atau Google Drive.<br />
                            <span className="font-semibold">Cara mendapatkan URL gambar:</span><br />
                            <span className="block mb-1">
                                <strong>GitHub</strong>: <br />
                                1. Unggah gambar ke repositori GitHub Anda.<br />
                                2. Buka gambar di GitHub, klik tombol "Download" atau "Raw", lalu salin URL yang muncul di browser.
                            </span>
                            <span className="block mb-1">
                                <strong>Google Drive</strong>: <br />
                                1. Unggah gambar ke Google Drive.<br />
                                2. Klik kanan gambar, pilih "Bagikan" atau "Share", pastikan akses diatur ke "Siapa saja dengan tautan" atau "Anyone with the link".<br />
                                3. Salin tautan yang diberikan dan ubah formatnya untuk akses langsung: Ganti `view?usp=sharing` dengan `uc?export=download` atau `thumbnail?id=FILE_ID` (ganti `FILE_ID` dengan ID dari tautan yang Anda salin).
                             </span>
                            Anda juga bisa menggunakan gambar yang sudah ada di folder <code>public</code> aplikasi Anda, contoh: <code>/v1/img/showcase-1.webp</code>.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Singkat</label>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="fullPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Isi Prompt Lengkap</label>
                        {/* Implementasi TinyMCE Editor dengan dynamic import dan inisialisasi yang aman */}
                        {mounted && tinymceInit ? (
                            <DynamicEditor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue={formData.fullPrompt}
                                onEditorChange={handleEditorChange}
                                init={tinymceInit}
                            />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Memuat editor...</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt Negatif (Opsional)</label>
                        <textarea
                            id="negativePrompt"
                            name="negativePrompt"
                            value={formData.negativePrompt || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan (Opsional)</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menambahkan...' : (
                            <>
                                <Send size={20} />
                                <span>Tambahkan Prompt</span>
                            </>
                        )}
                    </button>
                    {/* Tombol Bantuan (Hapus Prompt) dipindahkan ke bawah tombol submit */}
                    <button
                        type="button"
                        onClick={() => setShowDeleteRequestModal(true)}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-red-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                    >
                        <HelpCircle size={20} />
                        <span>Bantuan (Hapus Prompt)</span>
                    </button>
                </form>

                {/* Modal Tutorial */}
                {showTutorialModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
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
                                <p className="mb-4 text-base">Selamat datang di panduan pengisian prompt! Ikuti langkah-langkah ini untuk membuat prompt AI yang efektif dan menarik.</p>

                                {TUTORIAL_STEPS.map((step, index) => (
                                    <div key={index} style={{ display: index === currentTutorialStep ? 'block' : 'none' }} className="space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                            {step.icon} {step.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }}></p>
                                    </div>
                                ))}

                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setCurrentTutorialStep(prev => Math.max(0, prev - 1))}
                                        disabled={currentTutorialStep === 0}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                                    >
                                        <ArrowLeft size={16} /> Sebelumnya
                                    </button>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                        Langkah {currentTutorialStep + 1} dari {TUTORIAL_STEPS.length}
                                    </span>
                                    <button
                                        onClick={() => setCurrentTutorialStep(prev => Math.min(TUTORIAL_STEPS.length - 1, prev + 1))}
                                        disabled={currentTutorialStep === TUTORIAL_STEPS.length - 1}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Selanjutnya <ArrowRight size={16} />
                                    </button>
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => setShowTutorialModal(false)}
                                        className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Permintaan Hapus */}
                {showDeleteRequestModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic max-w-md w-full relative">
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
            </div>
        </main>
    );
}