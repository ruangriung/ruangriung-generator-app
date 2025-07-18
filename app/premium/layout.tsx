// Lokasi: app/premium/layout.tsx

// Layout ini hanya perlu meneruskan children (konten halaman)
// ke layout root (app/layout.tsx) yang akan menampilkannya.
export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}