'use client';

import Link from 'next/link';
import { use } from 'react';
import { SuperAdminPrivateExercisesView } from '@/components/ejercicios/SuperAdminPrivateExercisesView';

export default function SuperAdminTenantEjerciciosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = use(params);

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <Link
        href={`/super-admin/tenants/${tenantId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Gimnasio
      </Link>
      <header>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          Ejercicios privados del gimnasio
        </h1>
      </header>
      <SuperAdminPrivateExercisesView tenantId={tenantId} />
    </div>
  );
}
