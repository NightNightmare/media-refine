import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaRefine Pro | Otimização Inteligente",
  description: "Desenvolvido por [Nome da Tua Empresa]",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen w-screen overflow-x-hidden bg-[#fafafa] flex flex-col">
        {/* Navbar fixa no topo */}
        <Navbar />

        {/* O main cresce para empurrar o footer para baixo */}
        <main className="flex-1 flex flex-col" suppressHydrationWarning={true}>
          {children}
        </main>

        {/* Rodapé no final da estrutura */}
        <Footer />
      </body>
    </html>
  );
}