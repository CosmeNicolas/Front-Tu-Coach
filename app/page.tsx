import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';

export const metadata: Metadata = {
  title: 'TuCoach — Plataforma para entrenadores, gimnasios y alumnos',
  description: `Creá planificaciones, acompañá alumnos y analizá su progreso. Probá ${TRIAL_DAYS} días Premium gratis.`,
  openGraph: {
    title: 'TuCoach',
    description:
      'Planificaciones, seguimiento de alumnos y portal de entrenamiento en una sola plataforma.',
    url: 'https://tucoach.pro',
    siteName: 'TuCoach',
    locale: 'es_AR',
    type: 'website',
  },
};

export default async function HomePage() {
  let pricing;
  try {
    pricing = await fetchPublicPlatformPricing();
  } catch {
    pricing = undefined;
  }

  return <LandingPage pricing={pricing} />;
}
