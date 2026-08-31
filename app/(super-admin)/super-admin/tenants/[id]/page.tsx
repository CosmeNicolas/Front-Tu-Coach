'use client';

import Link from 'next/link';
import { use } from 'react';
import { ChevronLeft } from 'lucide-react';
import { GymDashboardView } from '@/components/owner/GymDashboardView';
import { Button } from '@/components/ui/button';

export default function SuperAdminTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = use(params);

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href="/super-admin/tenants">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver a gimnasios
        </Link>
      </Button>
      <GymDashboardView
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
        canManagePlan
      />
    </div>
  );
}
