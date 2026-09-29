import type { Metadata, Viewport } from 'next';
import { AppProviders } from '@/lib/providers/app-providers';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { bebasNeue, bodyFont } from '@/lib/fonts';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo/site';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#171717',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TuCoach — Planificaciones y seguimiento para entrenadores',
    template: '%s | TuCoach',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  category: 'fitness',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'TuCoach — Planificaciones y seguimiento para entrenadores',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/branding/LGO600PX.png',
        width: 600,
        height: 600,
        alt: 'TuCoach',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'TuCoach — Planificaciones y seguimiento para entrenadores',
    description: SITE_DESCRIPTION,
    images: ['/branding/LGO600PX.png'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/branding/LGO600PX.png', type: 'image/png' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'TuCoach',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans flex min-h-full flex-col bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
