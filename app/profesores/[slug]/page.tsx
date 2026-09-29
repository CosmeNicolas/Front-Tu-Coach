import type { Metadata } from 'next';
import { fetchPublicProfessor } from '@/lib/api/professor-catalog';
import { publicMetadata } from '@/lib/seo/site';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ProfessorDetailPageClient } from '@/components/landing/ProfessorDetailView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays } from '@/lib/landing/pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const professor = await fetchPublicProfessor(slug);
    const bio = professor.bio?.trim();
    const place = professor.ubicacion?.trim();
    const description = bio
      ? bio.slice(0, 160)
      : `${professor.displayName} es entrenador en TuCoach${place ? `, ${place}` : ''}. Mirá especialidades y pedí seguimiento.`;
    return publicMetadata({
      title: `${professor.displayName}, entrenador`,
      description,
      path: `/profesores/${professor.slug}`,
      image: professor.fotoUrl,
    });
  } catch {
    return publicMetadata({
      title: 'Perfil de entrenador',
      description: 'Perfil público de un entrenador en TuCoach.',
      path: `/profesores/${slug}`,
      index: false,
    });
  }
}

export default async function ProfesorDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let trialDays = TRIAL_DAYS;
  try {
    const pricing = await fetchPublicPlatformPricing();
    trialDays = resolveTrialDays(pricing);
  } catch {
    // fallback
  }

  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar trialDays={trialDays} />
      <main className="pb-20 pt-28">
        <ProfessorDetailPageClient params={params} />
      </main>
      <LandingFooter />
    </div>
  );
}
