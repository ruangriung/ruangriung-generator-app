import type { SocialKey } from '@/app/konten-kreator/social-platforms';

export type SocialLinks = Partial<Record<SocialKey, string>>;

export type PortfolioItem = {
  title: string;
  description: string;
  link?: string;
};

export type CreatorProfile = {
  name: string;
  role: string;
  description: string;
  bio: string;
  availability: string;
  location: string;
  imageUrl: string;
  specialties: string[];
  socials: SocialLinks;
  highlights: string[];
  portfolio: PortfolioItem[];
};

export type Creator = CreatorProfile & { slug: string };

export const defineCreator = (creator: CreatorProfile) => creator;
