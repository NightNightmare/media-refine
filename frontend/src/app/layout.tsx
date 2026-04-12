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
  description: "A ferramenta definitiva para otimização de media com IA.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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
      suppressHydrationWarning // Essencial para ignorar atributos injetados no HTML
    >
      <body 
        className="min-h-screen w-screen overflow-x-hidden bg-[#fafafa] flex flex-col"
        suppressHydrationWarning={true} // Bloqueia avisos causados por extensões no body
      >
        {/* Navbar e Footer com suppressHydrationWarning interno se necessário */}
        <Navbar />

        {/* Adicionamos o suppressHydrationWarning aqui porque o erro 
          mostra que as extensões estão a injetar atributos nas divs 
          principais do conteúdo.
        */}
        <main 
          className="flex-1 flex flex-col" 
          suppressHydrationWarning={true}
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}