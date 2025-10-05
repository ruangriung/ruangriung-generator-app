import { creators } from '@/content/creators';
import { getAllPrompts } from '@/lib/prompts';
import { getStores } from '@/lib/umkm';
import type { DashboardSnapshot, PublishedResource } from './types';

const toPromptResource = (prompt: Awaited<ReturnType<typeof getAllPrompts>>[number]): PublishedResource => ({
  id: `prompt-${prompt.id}`,
  type: 'prompt',
  title: prompt.title,
  url: `/kumpulan-prompt/${prompt.slug}`,
  status: 'published',
  owner: prompt.author,
  updatedAt: prompt.date ? new Date(prompt.date).toISOString() : undefined,
  tags: prompt.tags,
});

const toCreatorResource = (creator: typeof creators[number]): PublishedResource => ({
  id: `profile-${creator.slug}`,
  type: 'profile',
  title: creator.name,
  url: `/konten-kreator/profil/${creator.slug}`,
  status: 'published',
  owner: creator.name,
  tags: creator.specialties,
});

const toStoreResource = (store: Awaited<ReturnType<typeof getStores>>[number]): PublishedResource => ({
  id: `umkm-${store.id}`,
  type: 'umkm',
  title: store.name,
  url: `/umkm/${store.id}`,
  status: 'published',
  owner: store.location,
  tags: [store.category],
});

export const loadDashboardSnapshot = async (): Promise<DashboardSnapshot> => {
  const [prompts, stores] = await Promise.all([getAllPrompts(), getStores()]);
  const creatorList = creators;

  const promptResources = prompts.slice(0, 12).map(toPromptResource);
  const creatorResources = creatorList.map(toCreatorResource);
  const storeResources = stores.map(toStoreResource);

  const publishedResources = [...promptResources, ...creatorResources, ...storeResources].sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }

    if (a.updatedAt) {
      return -1;
    }

    if (b.updatedAt) {
      return 1;
    }

    return a.title.localeCompare(b.title, 'id-ID', { sensitivity: 'base' });
  });

  return {
    summary: {
      promptsPublished: prompts.length,
      profilesPublished: creatorList.length,
      umkmPublished: stores.length,
    },
    publishedResources,
  } satisfies DashboardSnapshot;
};
