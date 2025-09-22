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
  params: {
    slug: string;
  };
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

export const generateMetadata = ({ params }: PageProps): Metadata => {
  const creator = getCreatorBySlug(params.slug);

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

const CreatorProfilePage = ({ params }: PageProps) => {
  const creator = getCreatorOrThrow(params.slug);
  const availableSocials = socialPlatforms.filter((platform) => creator.socials[platform.key]);

  return (
    <main className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl space-y-10">
          <Link
            href="/konten-kreator"
            className="inline-flex w-max items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:hover:bg-purple-900/60"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Direktori
          </Link>

          <div className="flex flex-col gap-8">
            <span className="inline-flex w-max items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-200">
              <Sparkles className="h-4 w-4" />
              Profil Kreator RuangRiung
            </span>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
              <aside className="h-max rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl shadow-purple-100/50 dark:border-purple-900 dark:bg-gray-900/70 dark:shadow-black/30">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-purple-100 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/40">
                  <Image
                    src={creator.imageUrl}
                    alt={`Foto profil ${creator.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{creator.name}</h1>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">{creator.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{creator.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-purple-500 dark:text-purple-300" />
                      <span>{creator.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-purple-500 dark:text-purple-300" />
                      <span>{creator.availability}</span>
                    </div>
                  </div>

                  {availableSocials.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Kanal Aktif
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {availableSocials.map((platform) => {
                          const url = creator.socials[platform.key];
                          const Icon = platform.icon;

                          if (!url) {
                            return null;
                          }

                          return (
                            <a
                              key={platform.key}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:border-purple-700 dark:hover:bg-purple-900/60 dark:hover:text-purple-100"
                            >
                              <Icon className="h-4 w-4" />
                              {platform.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Fokus Utama
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {creator.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/60 dark:text-purple-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="space-y-8">
                <section className="rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-lg shadow-purple-100/60 dark:border-purple-900 dark:bg-gray-900/70 dark:shadow-black/30">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tentang {creator.name}</h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {renderParagraphs(creator.bio).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-lg shadow-purple-100/60 dark:border-purple-900 dark:bg-gray-900/70 dark:shadow-black/30">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Highlight Kolaborasi</h2>
                  <ul className="mt-5 space-y-3">
                    {creator.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 rounded-2xl bg-purple-50/60 p-4 text-sm text-gray-700 dark:bg-purple-900/20 dark:text-gray-200"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-purple-600 dark:text-purple-300" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-lg shadow-purple-100/60 dark:border-purple-900 dark:bg-gray-900/70 dark:shadow-black/30">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Portofolio &amp; Inisiatif</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {creator.portfolio.map((item) => (
                      <div
                        key={item.title}
                        className="flex h-full flex-col justify-between rounded-2xl border border-purple-200 bg-white/95 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg dark:border-purple-800 dark:bg-gray-950/60 dark:hover:border-purple-700"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex w-max items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200"
                          >
                            Kunjungi sumber
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="mt-4 inline-flex w-max items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            <Sparkles className="h-3.5 w-3.5 text-purple-500 dark:text-purple-300" />
                            Inisiatif komunitas
                          </span>
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
