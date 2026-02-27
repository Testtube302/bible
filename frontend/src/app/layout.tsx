import type { Metadata, Viewport } from 'next';
import { Inter, Lora } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Scripture — Interactive Bible',
  description: 'A Scripture-first interactive Bible platform',
  manifest: '/bible/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Scripture',
  },
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/bible/icons/icon-192x192.png" />
      </head>
      <body className="bg-dark-bg text-dark-text min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
