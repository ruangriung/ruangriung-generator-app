import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPrompts, getPromptBySlug } from '../../../lib/prompts';
import PromptDetailClient from './PromptDetailClient';

const OG_IMAGE_URL = 'https://www.ruangriung.my.id/assets/ruangriung.png';
const MAX_DESCRIPTION_LENGTH = 160;

const createDescription = (content: string, title: string): string => {
  const plainText = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\*_#>~]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!plainText) {
    return `${title} - Koleksi prompt AI dari RuangRiung.`;
  }

  if (plainText.length <= MAX_DESCRIPTION_LENGTH) {
    return plainText;
  }

  return `${plainText.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
};

const toIsoString = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    return {};
  }

  const description = createDescription(prompt.promptContent, prompt.title);
  const canonicalUrl = `https://www.ruangriung.my.id/kumpulan-prompt/${prompt.slug}`;
  const publishedTime = toIsoString(prompt.date);
  const keywords = Array.from(
    new Set([
      prompt.title,
      prompt.tool,
      ...prompt.tags,
    ].filter((keyword): keyword is string => Boolean(keyword && keyword.trim()))),
  );

  return {
    title: `${prompt.title} - Kumpulan Prompt - RuangRiung`,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: prompt.title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'RuangRiung',
      ...(publishedTime ? { publishedTime } : {}),
      authors: [prompt.author],
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: prompt.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}

export const revalidate = 0;

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompts = await getAllPrompts();
  const prompt = prompts.find(currentPrompt => currentPrompt.slug === slug);

  if (!prompt) {
    notFound();
  }

  return <PromptDetailClient prompt={prompt} prompts={prompts} />;
}
