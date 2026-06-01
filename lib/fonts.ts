import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';

/** Títulos y marca — archivo local de branding */
export const bebasNeue = localFont({
  src: '../public/branding/BebasNeue-Regular.ttf',
  variable: '--font-bebas-neue',
  weight: '400',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

/**
 * Cuerpo, formularios y tablas — Google Fonts.
 * Alternativas que combinan bien con Bebas Neue:
 * - Source Sans 3 (https://fonts.google.com/specimen/Source+Sans+3)
 * - Inter (https://fonts.google.com/specimen/Inter)
 * - Work Sans (https://fonts.google.com/specimen/Work+Sans)
 */
export const bodyFont = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
