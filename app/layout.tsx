import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["cyrillic", "latin"],
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
        className={`${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

