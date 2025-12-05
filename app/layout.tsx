import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReBook Sri Lanka - Help Flood-Affected Students",
  description: "Connect students who lost their stationery in floods with generous donors",
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/logo.png' },
  },
  openGraph: {
    title: "ReBook Sri Lanka - Help Flood-Affected Students",
    description: "Connect students who lost their stationery in floods with generous donors",
    images: [{ url: 'https://i.ibb.co/N6Z9KHSm/logo.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "ReBook Sri Lanka - Help Flood-Affected Students",
    description: "Connect students who lost their stationery in floods with generous donors",
    images: ['https://i.ibb.co/N6Z9KHSm/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
