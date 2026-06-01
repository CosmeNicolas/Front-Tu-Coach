'use client';

import Link from 'next/link';
import { use } from 'react';
import { ProfesorAlumnosView } from '@/components/owner/ProfesorAlumnosView';

export default function SuperAdminProfesorAlumnosPage({
  params,
}: {
  params: Promise<{ id: string; profesorId: string }>;
}) {
  const { id: tenantId, profesorId } = use(params);

  return (
    <div className="space-y-4 p-4 sm:p-8">
      <Link
        href={`/super-admin/tenants/${tenantId}/profesores`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Profesores
      </Link>
      <ProfesorAlumnosView
        profesorId={profesorId}
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
