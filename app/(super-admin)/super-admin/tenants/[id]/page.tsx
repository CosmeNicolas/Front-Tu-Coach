'use client';

import Link from 'next/link';
import { use } from 'react';
import { GymDashboardView } from '@/components/owner/GymDashboardView';

export default function SuperAdminTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = use(params);

  return (
    <div className="space-y-4 p-4 sm:p-8">
      <Link
        href="/super-admin/tenants"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Gimnasios
      </Link>
      <GymDashboardView
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
