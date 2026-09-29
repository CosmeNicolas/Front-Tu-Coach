import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { JsonLd } from '@/components/seo/JsonLd';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays } from '@/lib/landing/pricing';
import { homeJsonLd, publicMetadata } from '@/lib/seo/site';

export async function generateMetadata(): Promise<Metadata> {
  let trialDays = TRIAL_DAYS;
  try {
    const pricing = await fetchPublicPlatformPricing();
    trialDays = resolveTrialDays(pricing);
  } catch {
    // fallback al valor por defecto
  }

  const description = `Creá planificaciones, acompañá alumnos y analizá su progreso. Probá ${trialDays} días Premium gratis.`;

  return publicMetadata({
    title: 'TuCoach — Plataforma para entrenadores, gimnasios y alumnos',
    description,
    path: '/',
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  let pricing;
  try {
    pricing = await fetchPublicPlatformPricing();
  } catch {
    pricing = undefined;
  }

  const description = `Creá planificaciones, acompañá alumnos y analizá su progreso. Probá ${
    pricing ? resolveTrialDays(pricing) : TRIAL_DAYS
  } días Premium gratis.`;

  return (
    <>
      <JsonLd data={homeJsonLd(description)} />
      <LandingPage pricing={pricing} />
    </>
  );
}
