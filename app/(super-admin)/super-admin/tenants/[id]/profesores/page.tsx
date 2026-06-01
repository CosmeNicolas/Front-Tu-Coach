'use client';

import Link from 'next/link';
import { use } from 'react';
import { ProfesoresListView } from '@/components/owner/ProfesoresListView';

export default function SuperAdminProfesoresPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = use(params);

  return (
    <div className="space-y-4 p-4 sm:p-8">
      <Link
        href={`/super-admin/tenants/${tenantId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Gimnasio
      </Link>
      <ProfesoresListView
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
