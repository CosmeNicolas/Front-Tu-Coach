'use client';

import { ApiError } from '@/lib/api/client';
import { usePublicProfessors } from '@/hooks/useProfessorCatalog';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { LandingButton } from '@/components/landing/LandingButton';
import { ProfessorFlipCard } from '@/components/landing/ProfessorFlipCard';
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
} from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

export function ProfessorsCatalogSection() {
  const { data, error, isLoading } = usePublicProfessors();

  if (isLoading) return null;
  if (error instanceof ApiError && error.status === 404) return null;
  if (error || !data?.items?.length) return null;

  const items = data.items.slice(0, 3);

  return (
    <section className="border-t border-white/5 py-20 sm:py-24">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <SectionHeader
            label="Coaches"
            title="Profesores"
            description="Tocá la tarjeta para darla vuelta y ver los datos."
          />
        </ScrollReveal>
        <StaggerGrid
          className={cn(
            'mt-12 grid justify-items-center gap-6',
            items.length === 1
              ? 'mx-auto max-w-sm'
              : items.length === 2
                ? 'sm:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {items.map((prof) => (
            <StaggerItem key={prof.id}>
              <ProfessorFlipCard prof={prof} />
            </StaggerItem>
          ))}
        </StaggerGrid>
        <div className="mt-10 flex justify-center">
          <LandingButton href="/profesores" variant="secondary">
            Ver todos los profesores
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
