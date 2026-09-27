import { ProfesorAlumnosView } from '@/components/owner/ProfesorAlumnosView';

export default async function SuperAdminProfesorAlumnosPage({
  params,
}: {
  params: Promise<{ id: string; profesorId: string }>;
}) {
  const { id: tenantId, profesorId } = await params;

  return (
    <div className="p-4 sm:p-8">
      <ProfesorAlumnosView
        profesorId={profesorId}
        tenantId={tenantId}
        basePath={`/super-admin/tenants/${tenantId}`}
      />
    </div>
  );
}
