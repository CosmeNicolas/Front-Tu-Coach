'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PlanificacionForm } from '@/components/planificaciones/PlanificacionForm';
import { useCreatePlanification } from '@/hooks/usePlanifications';

function NuevaPlanificacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alumnoId = searchParams.get('alumnoId') ?? undefined;
  const createMutation = useCreatePlanification();

  return (
    <PlanificacionForm
      initialAlumnoId={alumnoId}
      submitLabel="Crear planificación"
      onSubmit={async (payload) => {
        const plan = await createMutation.mutateAsync(payload);
        router.push(`/profesor/planificaciones/${plan.id}/asistente`);
      }}
    />
  );
}

export default function NuevaPlanificacionPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Nueva planificación</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <NuevaPlanificacionContent />
      </Suspense>
    </div>
  );
}
