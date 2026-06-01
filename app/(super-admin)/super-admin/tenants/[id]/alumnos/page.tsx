'use client';

import Link from 'next/link';
import { use } from 'react';
import { OwnerAlumnosView } from '@/components/owner/OwnerAlumnosView';

export default function SuperAdminAlumnosPage({
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
      <OwnerAlumnosView
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
