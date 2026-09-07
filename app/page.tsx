import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'TuCoach — Plataforma para entrenadores, gimnasios y alumnos',
  description:
    'Creá planificaciones, acompañá alumnos y analizá su progreso. Probá 7 días Premium gratis.',
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

export default function HomePage() {
  return <LandingPage />;
}
