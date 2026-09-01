import type { Metadata } from 'next';
import { AppProviders } from '@/lib/providers/app-providers';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { bebasNeue, bodyFont } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'TuCoach',
  description: 'Plataforma SaaS para gimnasios y planificaciones',
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
