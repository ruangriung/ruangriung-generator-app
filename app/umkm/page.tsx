import { UmkmDirectory } from './_components/UmkmDirectory';
import { getStores } from '@/lib/umkm';

export default async function UmkmPage() {
  const stores = await getStores();
  const categories = Array.from(new Set(stores.map((store) => store.category))).sort((a, b) =>
    a.localeCompare(b, 'id-ID', { sensitivity: 'base' }),
  );

  return <UmkmDirectory stores={stores} categories={categories} />;
}
