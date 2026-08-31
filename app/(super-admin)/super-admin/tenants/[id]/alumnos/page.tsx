import Link from 'next/link';
import { OwnerAlumnosView } from '@/components/owner/OwnerAlumnosView';

export default async function SuperAdminAlumnosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tenantId } = await params;

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
