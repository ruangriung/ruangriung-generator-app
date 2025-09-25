import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

import type { Product, Store } from './types';

const storesDirectory = path.join(process.cwd(), 'content/umkm/stores');

type StoreFrontMatter = {
  id?: string;
  name: string;
  category: string;
  location: string;
  whatsappNumber: string;
  tagline: string;
  heroImage: string;
  description?: string;
  highlights?: unknown;
  products?: unknown;
  order?: number | string;
};

type ParsedStore = {
  order: number;
  store: Store;
};

const toString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
};

const normalizeHighlights = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => toString(item))
    .filter((item): item is string => item.length > 0);
};

const normalizeProducts = (value: unknown): Product[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;

        const name = toString(record.name);
        const price = toString(record.price);
        const description = toString(record.description);
        const image = toString(record.image);

        if (!name || !price || !description || !image) {
          return undefined;
        }

        return {
          name,
          price,
          description,
          image,
        } satisfies Product;
      }

      return undefined;
    })
    .filter((product): product is Product => Boolean(product));
};

const parseStoreFile = async (fileName: string): Promise<ParsedStore | undefined> => {
  const fullPath = path.join(storesDirectory, fileName);
  const fileContents = await fs.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontMatter = data as StoreFrontMatter;

  const id = toString(frontMatter.id) || fileName.replace(/\.md$/, '');
  const name = toString(frontMatter.name);
  const category = toString(frontMatter.category);
  const location = toString(frontMatter.location);
  const whatsappNumber = toString(frontMatter.whatsappNumber);
  const tagline = toString(frontMatter.tagline);
  const heroImage = toString(frontMatter.heroImage);
  const description = toString(frontMatter.description) || content.trim();
  const highlights = normalizeHighlights(frontMatter.highlights);
  const products = normalizeProducts(frontMatter.products);

  if (!id || !name || !category || !location || !whatsappNumber || !tagline || !heroImage || !description) {
    return undefined;
  }

  const orderValue = frontMatter.order;
  const order = typeof orderValue === 'number' ? orderValue : Number(orderValue);

  return {
    order: Number.isFinite(order) ? Number(order) : Number.POSITIVE_INFINITY,
    store: {
      id,
      name,
      category,
      location,
      whatsappNumber,
      tagline,
      heroImage,
      description,
      highlights,
      products,
    },
  } satisfies ParsedStore;
};

const loadStoresFromMarkdown = async (): Promise<Store[]> => {
  try {
    const fileNames = await fs.readdir(storesDirectory);
    const parsedStores = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName) => {
          try {
            return await parseStoreFile(fileName);
          } catch (error) {
            console.error(`Gagal membaca berkas UMKM ${fileName}:`, error);
            return undefined;
          }
        }),
    );

    return parsedStores
      .filter((entry): entry is ParsedStore => Boolean(entry))
      .sort((a, b) => {
        if (a.order === b.order) {
          return a.store.name.localeCompare(b.store.name, 'id-ID', { sensitivity: 'base' });
        }

        return a.order - b.order;
      })
      .map((entry) => entry.store);
  } catch (error) {
    console.error('Gagal memuat direktori UMKM:', error);
    return [];
  }
};

export const getStores = cache(async (): Promise<Store[]> => {
  return loadStoresFromMarkdown();
});

export const getStoreById = async (storeId: string): Promise<Store | undefined> => {
  const stores = await getStores();
  return stores.find((store) => store.id === storeId);
};

export const getStoreCategories = async (): Promise<string[]> => {
  const stores = await getStores();
  const categories = new Set(stores.map((store) => store.category));

  return Array.from(categories).sort((a, b) => a.localeCompare(b, 'id-ID', { sensitivity: 'base' }));
};
