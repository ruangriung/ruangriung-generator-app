// app/premium/layout.tsx

// Di sini, kita hanya merender "children" tanpa membungkusnya
// dengan komponen lain seperti Navbar atau Footer dari layout utama.
export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}