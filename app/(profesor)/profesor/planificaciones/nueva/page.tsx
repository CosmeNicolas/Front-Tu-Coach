'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';
import { PlanificacionForm } from '@/components/planificaciones/PlanificacionForm';
import { useCreatePlanification } from '@/hooks/usePlanifications';

function NuevaPlanificacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alumnoId = searchParams.get('alumnoId') ?? undefined;
  const fromPlanId = searchParams.get('fromPlanId') ?? undefined;
  const origenParam = searchParams.get('origen');
  const initialOrigen =
    origenParam === 'anterior' || fromPlanId
      ? ('anterior' as const)
      : undefined;
  const createMutation = useCreatePlanification();

  return (
    <PlanificacionForm
      initialAlumnoId={alumnoId}
      initialFromPlanId={fromPlanId}
      initialOrigen={initialOrigen}
      submitLabel="Crear planificación"
      onSubmit={async (payload) => {
        const plan = await createMutation.mutateAsync(payload);
        const planId = plan?.id?.trim();
        if (!planId) {
          toast.error('La planificación se creó pero no recibimos el ID.');
          router.push('/profesor/planificaciones');
          return;
        }
        // Navegación completa: evita 404 intermitente de client-side nav en dev.
        window.location.assign(`/profesor/planificaciones/${planId}/asistente`);
      }}
    />
  );
}

export default function NuevaPlanificacionPage() {
  return (
    <div className="p-4 sm:p-8">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Nueva planificación
      </h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
        <NuevaPlanificacionContent />
      </Suspense>
    </div>
  );
}
