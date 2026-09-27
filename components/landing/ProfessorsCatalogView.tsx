'use client';

import { ApiError } from '@/lib/api/client';
import { usePublicProfessors } from '@/hooks/useProfessorCatalog';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { ProfessorFlipCard } from '@/components/landing/ProfessorFlipCard';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfessorsCatalogView() {
  const { data, error, isLoading } = usePublicProfessors();

  if (isLoading) {
    return (
      <div className={LANDING_CONTAINER}>
        <p className="text-sm text-[#737373]">Cargando profesores…</p>
      </div>
    );
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className={LANDING_CONTAINER}>
        <SectionHeader
          title="Profesores"
          description="El catálogo público todavía no está activado."
        />
      </div>
    );
  }

  if (error || !data?.items?.length) {
    return (
      <div className={LANDING_CONTAINER}>
        <SectionHeader
          title="Profesores"
          description="Todavía no hay profesores publicados. Volvé pronto."
        />
      </div>
    );
  }

  return (
    <div className={LANDING_CONTAINER}>
      <SectionHeader
        label="Encontrá tu coach"
        title="Profesores"
        description="Tocá la tarjeta para ver los datos."
      />
      <div
        className={cn(
          'mt-12 grid justify-items-center gap-6',
          data.items.length === 1
            ? 'mx-auto max-w-sm'
            : data.items.length === 2
              ? 'sm:grid-cols-2'
              : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {data.items.map((prof) => (
          <ProfessorFlipCard key={prof.id} prof={prof} />
        ))}
      </div>
      <p className="mt-10 flex items-center justify-center gap-2 text-xs text-[#737373]">
        <Users className="size-3.5" aria-hidden />
        {data.total} profesor{data.total === 1 ? '' : 'es'} disponible
        {data.total === 1 ? '' : 's'}
      </p>
    </div>
  );
}
