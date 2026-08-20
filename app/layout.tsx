import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title="adamdar — Кеңсе ойыны";
  const description="Әріптестерге арналған сұрақтар, сәйкестіктер және ортақ статистикасы бар жеңіл ойын.";
  return { title, description, icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}, openGraph:{title,description}, twitter:{card:"summary",title,description} };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

