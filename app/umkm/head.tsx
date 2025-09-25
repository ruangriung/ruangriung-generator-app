export default function Head() {
  const title = 'Etalase UMKM Inspiratif | Ruang Riung';
  const description =
    'Jelajahi UMKM pilihan Ruang Riung lengkap dengan detail produk, foto, dan kontak WhatsApp untuk langsung terhubung dengan pelaku usaha lokal.';
  const url = 'https://www.ruangriung.id/umkm';
  const image = 'https://www.ruangriung.id/og-umkm.jpg';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="UMKM, usaha mikro kecil menengah, produk lokal, bisnis Indonesia, katalog UMKM"
      />
      <meta name="robots" content="index,follow" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
