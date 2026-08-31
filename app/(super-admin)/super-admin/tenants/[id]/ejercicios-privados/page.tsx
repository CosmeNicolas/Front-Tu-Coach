import Link from 'next/link';
import { SuperAdminEjerciciosView } from '@/components/ejercicios/SuperAdminEjerciciosView';

export default async function SuperAdminTenantEjerciciosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;

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
          Ejercicios del gimnasio
        </h1>
      </header>
      <SuperAdminEjerciciosView tenantId={tenantId} defaultTab="gimnasio" />
    </div>
  );
}
