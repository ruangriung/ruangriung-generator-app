import type { Creator, CreatorProfile } from './schema';
import arifTirtana from './profiles/arif-tirtana';
import deryLau from './profiles/dery-lau';
import famii from './profiles/famii';
import hus from './profiles/hus';
import kokoAjeeb from './profiles/koko-ajeeb';
import mahidaraRatri from './profiles/mahidara-ratri';
import nadifaFamily from './profiles/nadifa-family';
import nurulSholehahEka from './profiles/nurul-sholehah-eka';
import paijemArdianArip from './profiles/paijem-ardian-arip';
import xenopath from './profiles/xenopath';
import yogiArfianto from './profiles/yogi-arfianto';

const profiles: CreatorProfile[] = [
  kokoAjeeb,
  xenopath,
  yogiArfianto,
  famii,
  deryLau,
  paijemArdianArip,
  mahidaraRatri,
  nadifaFamily,
  nurulSholehahEka,
  arifTirtana,
  hus,
];

const slugify = (value: string) => {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

const assignSlugs = (creators: CreatorProfile[]): Creator[] => {
  const slugCounts = new Map<string, number>();

  return creators.map((creator) => {
    const base = slugify(creator.name) || 'profil';
    const count = slugCounts.get(base) ?? 0;
    const nextCount = count + 1;
    slugCounts.set(base, nextCount);
    const slug = count === 0 ? base : `${base}-${nextCount}`;

    return { ...creator, slug };
  });
};

const creatorsWithSlugs = assignSlugs(profiles);

const creatorMap = new Map<string, Creator>(
  creatorsWithSlugs.map((creator) => [creator.slug, creator]),
);

export const creators = creatorsWithSlugs;

export const getCreatorBySlug = (slug: string) => {
  return creatorMap.get(slug);
};

export const creatorSlugs = creatorsWithSlugs.map((creator) => creator.slug);

export type { Creator, CreatorProfile, PortfolioItem, SocialLinks } from './schema';
export { defineCreator } from './schema';
