'use client';

import Link from 'next/link';
import { ExternalLink, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTenants } from '@/hooks/useGymAdmin';
import { useSuspendTenant } from '@/hooks/useTenantsAdmin';
import { TenantStatus } from '@/types/admin';
import { TenantSummary } from '@/types/gym-admin';
import { ApiError } from '@/lib/api/client';
import { NuevoGimnasioDialog } from '@/components/super-admin/NuevoGimnasioDialog';
import { EditarGimnasioDialog } from '@/components/super-admin/EditarGimnasioDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function TenantEstadoBadge({ estado }: { estado: string }) {
  const isActive = estado === TenantStatus.ACTIVE;
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={isActive ? '' : 'bg-muted text-muted-foreground'}
    >
      {isActive ? 'Activo' : 'Suspendido'}
    </Badge>
  );
}

function SuspenderGimnasioButton({ tenant }: { tenant: TenantSummary }) {
  const suspend = useSuspendTenant();

  if (tenant.estado === TenantStatus.SUSPENDED) {
    return null;
  }

  async function handleSuspend() {
    try {
      await suspend.mutateAsync(tenant.id);
      toast.success('Gimnasio suspendido');
    } catch (err) {
      toast.error('No se pudo suspender', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
          Suspender
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Suspender {tenant.nombre}?</AlertDialogTitle>
          <AlertDialogDescription>
            Los usuarios del gimnasio no podrán operar hasta que lo reactives editando
            el estado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={suspend.isPending}
            onClick={() => void handleSuspend()}
          >
            {suspend.isPending ? 'Suspendiendo…' : 'Suspender'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function SuperAdminTenantsPage() {
  const { data: tenants, isLoading, error } = useTenants();

  if (isLoading) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Cargando gimnasios…</p>
    );
  }

  if (error) {
    return (
      <p className="p-8 text-sm text-destructive">
        No se pudieron cargar los gimnasios.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gimnasios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Alta, edición y acceso a profesores por gimnasio
          </p>
        </div>
        <NuevoGimnasioDialog />
      </header>

      {!tenants?.length ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Todavía no hay gimnasios registrados.
          </p>
          <div className="mt-4 flex justify-center">
            <NuevoGimnasioDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((t) => (
            <Card key={t.id} className="flex flex-col border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{t.nombre}</CardTitle>
                  <TenantEstadoBadge estado={t.estado} />
                </div>
                <p className="text-sm text-muted-foreground">/{t.slug}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pb-4">
                <p className="text-xs text-muted-foreground">
                  ID: {t.id.slice(-8)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/super-admin/tenants/${t.id}`}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Ver
                    </Link>
                  </Button>
                  <EditarGimnasioDialog tenant={t} />
                  <SuspenderGimnasioButton tenant={t} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
