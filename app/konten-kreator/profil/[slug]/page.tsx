import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { Creator } from '../../creators';
import { creatorSlugs, getCreatorBySlug } from '../../creators';
import { socialPlatforms } from '../../social-platforms';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = 'https://ruangriung.my.id';

const buildImageUrl = (creator: Creator) => {
  if (creator.imageUrl.startsWith('http://') || creator.imageUrl.startsWith('https://')) {
    return creator.imageUrl;
  }

  return `${siteUrl}${creator.imageUrl}`;
};

export const generateStaticParams = () => {
  return creatorSlugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    return {
      title: 'Profil kreator tidak ditemukan - RuangRiung',
      description:
        'Profil kreator yang Anda cari tidak ditemukan. Kembali ke direktori untuk menjelajahi kreator lainnya.',
    };
  }

  const title = `${creator.name} - Profil Kreator RuangRiung`;
  const description = creator.bio || creator.description;
  const url = `${siteUrl}/konten-kreator/profil/${creator.slug}`;
  const image = buildImageUrl(creator);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'RuangRiung',
      images: [
        {
          url: image,
          alt: `Foto profil ${creator.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: image,
          alt: `Foto profil ${creator.name}`,
        },
      ],
    },
  };
};

const getCreatorOrThrow = (slug: string) => {
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  return creator;
};

const renderParagraphs = (text: string) => {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const CreatorProfilePage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const creator = getCreatorOrThrow(slug);
  const availableSocials = socialPlatforms.filter((platform) => creator.socials[platform.key]);

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
      <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-6xl space-y-12">
          <Link
            href="/konten-kreator"
            className="glass-button px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400 w-max"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Direktori
          </Link>

          <div className="flex flex-col gap-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20 w-max">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profil Kreator Terverifikasi</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
              {/* Sidebar Profil */}
              <aside className="glass-card p-8 sm:p-10 h-max sticky top-32">
                <div className="relative aspect-[4/5] w-full mb-8 group">
                  <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-3xl" />
                  <div className="relative h-full w-full rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl">
                    <Image
                      src={creator.imageUrl}
                      alt={creator.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{creator.name}</h1>
                    <div className="inline-block px-3 py-1 rounded-lg bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                      {creator.role}
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "{creator.description}"
                    </p>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      <div className="h-8 w-8 rounded-xl bg-slate-500/5 flex items-center justify-center text-primary-500">
                        <MapPin size={16} />
                      </div>
                      <span>{creator.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      <div className="h-8 w-8 rounded-xl bg-slate-500/5 flex items-center justify-center text-primary-500">
                        <Sparkles size={16} />
                      </div>
                      <span>{creator.availability}</span>
                    </div>
                  </div>

                  {availableSocials.length > 0 && (
                    <div className="pt-8 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Social Connect</p>
                      <div className="grid grid-cols-2 gap-3">
                        {availableSocials.map((platform) => {
                          const url = creator.socials[platform.key];
                          const Icon = platform.icon;
                          if (!url) return null;
                          return (
                            <a
                              key={platform.key}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl glass-button text-slate-600 dark:text-slate-400 transition-all group"
                            >
                              <Icon size={16} className="transition-transform group-hover:scale-110" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{platform.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Bidang Keahlian</p>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-4 py-2 rounded-xl bg-primary-500/5 border border-primary-500/10 text-[9px] font-black uppercase tracking-wider text-primary-500"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Konten Utama */}
              <div className="space-y-10">
                <section className="glass-card p-10 sm:p-12">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">
                    Tentang <span className="text-primary-500">{creator.name.split(' ')[0]}</span>
                  </h2>
                  <div className="space-y-6 text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {renderParagraphs(creator.bio).map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                <section className="glass-card p-10 sm:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">Highlight Kolaborasi</h2>
                  <div className="grid gap-4">
                    {creator.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-6 p-6 rounded-2xl bg-slate-500/5 border border-white/5 group transition-all hover:bg-primary-500/5"
                      >
                        <div className="h-10 w-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <span className="text-base font-bold text-slate-700 dark:text-slate-200">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="glass-card p-10 sm:p-12">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">Portofolio & Proyek</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {creator.portfolio.map((item, idx) => (
                      <div
                        key={idx}
                        className="glass-card !bg-white/5 p-8 border-white/5 hover:border-primary-500/30 transition-all group flex flex-col h-full"
                      >
                        <div className="flex-1 mb-8">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 px-6 rounded-xl bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-max"
                          >
                            Explore Project <ExternalLink size={14} />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 text-slate-400">
                            <Sparkles size={14} className="text-primary-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Featured Initiative</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatorProfilePage;
