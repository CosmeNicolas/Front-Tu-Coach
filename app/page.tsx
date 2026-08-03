import type { Metadata } from 'next';
/* import { LandingPage } from '@/components/landing/LandingPage'; */

import {redirect} from 'next/navigation';

export const metadata: Metadata = {
  title: 'TuCoach — Plataforma para entrenadores y alumnos',
  description:
    'Creá planificaciones personalizadas, acompañá a tus alumnos y analizá su progreso desde una sola plataforma.',
  openGraph: {
    title: 'TuCoach — Plataforma para entrenadores y alumnos',
    description:
      'Planificaciones, seguimiento y métricas para entrenadores, alumnos y gimnasios.',
  },
};

/* export default function HomePage() {
  return <LandingPage />;
} */

  export default function HomePage() {
    redirect('/login');
}