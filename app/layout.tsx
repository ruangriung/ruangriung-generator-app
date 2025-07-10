import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Pastikan baris ini ada

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruangriung AI Generator",
  description: "Transform your imagination into stunning visuals with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light-bg`}>{children}</body>
    </html>
  );
}