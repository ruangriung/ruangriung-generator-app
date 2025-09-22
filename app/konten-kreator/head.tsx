const title = 'Direktori Konten Kreator RuangRiung - Kenal Admin & Kontributor';
const description =
  'Kenali para admin dan kontributor RuangRiung yang menjaga komunitas tetap hangat, berbagi inspirasi, serta siap diajak kolaborasi.';
const url = 'https://ruangriung.my.id/konten-kreator';
const imageUrl = 'https://ruangriung.my.id/og-image/og-image-rr.png';
const imageAlt = 'Banner Direktori Konten Kreator RuangRiung';

export default function Head() {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="RuangRiung, konten kreator, komunitas kreator, admin ruangriung, kontributor ruangriung"
      />
      <link rel="canonical" href={url} />

      <meta property="og:locale" content="id_ID" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="RuangRiung" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </>
  );
}
