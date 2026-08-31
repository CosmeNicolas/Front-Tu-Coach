import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ProfesoresListView } from '@/components/owner/ProfesoresListView';
import { NuevoProfesorDialog } from '@/components/super-admin/NuevoProfesorDialog';
import { Button } from '@/components/ui/button';

export default async function SuperAdminTenantProfesoresPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
          <Link href={`/super-admin/tenants/${tenantId}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver al gimnasio
          </Link>
        </Button>
        <NuevoProfesorDialog defaultTenantId={tenantId} />
      </div>
      <ProfesoresListView
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
