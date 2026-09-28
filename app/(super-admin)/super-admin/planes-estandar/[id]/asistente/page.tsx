'use client';

import { use } from 'react';
import { ApiError } from '@/lib/api/client';
import { useAdminStandardPlan } from '@/hooks/useStandardPlans';
import { StandardPlanAsistente } from '@/components/super-admin/StandardPlanAsistente';

export default function SuperAdminStandardPlanAsistentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useAdminStandardPlan(id);

  if (isLoading) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Cargando plan…</p>
    );
  }

  if (error || !data) {
    return (
      <p className="p-8 text-sm text-destructive">
        {error instanceof ApiError && error.status === 404
          ? 'Plan no encontrado o la función está desactivada (FEATURE_STANDARD_PLANS).'
          : 'No se pudo cargar el plan.'}
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <StandardPlanAsistente template={data} />
    </div>
  );
}
