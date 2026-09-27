'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useAcceptCoachRelationship,
  useEndCoachRelationship,
  useProfessorCoachInbox,
  useRejectCoachRelationship,
} from '@/hooks/useCoachRelationships';
import type { CoachRelationship } from '@/lib/api/coach-relationships';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function statusLabel(status: CoachRelationship['status']) {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'accepted':
      return 'Aceptado';
    case 'rejected':
      return 'Rechazado';
    case 'ended':
      return 'Finalizado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

function RelationshipRow({ item }: { item: CoachRelationship }) {
  const accept = useAcceptCoachRelationship();
  const reject = useRejectCoachRelationship();
  const end = useEndCoachRelationship();

  async function run(
    action: () => Promise<unknown>,
    okMsg: string,
  ) {
    try {
      await action();
      toast.success(okMsg);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo completar');
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">
            {item.alumnoNombre ?? 'Alumno'}
          </p>
          <p className="text-xs text-muted-foreground">
            Solicitado{' '}
            {new Date(item.requestedAt).toLocaleDateString('es-AR')}
          </p>
          <Badge className="mt-2" variant="secondary">
            {statusLabel(item.status)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.status === 'pending' ? (
            <>
              <Button
                size="sm"
                disabled={accept.isPending}
                onClick={() =>
                  void run(() => accept.mutateAsync(item.id), 'Solicitud aceptada')
                }
              >
                Aceptar
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={reject.isPending}
                onClick={() =>
                  void run(() => reject.mutateAsync(item.id), 'Solicitud rechazada')
                }
              >
                Rechazar
              </Button>
            </>
          ) : null}
          {item.status === 'accepted' ? (
            <>
              {item.permissions.viewHistory ? (
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/profesor/solicitudes/${item.id}/historial`}>
                    Ver historial
                  </Link>
                </Button>
              ) : (
                <p className="self-center text-xs text-muted-foreground">
                  Sin acceso al historial
                </p>
              )}
              {item.permissions.chat ? (
                <Button asChild size="sm">
                  <Link href={`/profesor/solicitudes/${item.id}/chat`}>
                    Chat
                  </Link>
                </Button>
              ) : (
                <p className="self-center text-xs text-muted-foreground">
                  Sin chat
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={end.isPending}
                onClick={() =>
                  void run(() => end.mutateAsync(item.id), 'Vínculo finalizado')
                }
              >
                Finalizar
              </Button>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfesorSolicitudesView() {
  const pending = useProfessorCoachInbox('pending');
  const accepted = useProfessorCoachInbox('accepted');

  if (pending.isLoading || accepted.isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando solicitudes…</p>
    );
  }

  if (pending.error || accepted.error) {
    return (
      <div className="space-y-2 p-6">
        <h1 className="text-xl font-semibold">Solicitudes</h1>
        <p className="text-sm text-destructive">
          {pending.error instanceof ApiError && pending.error.status === 404
            ? 'Los vínculos con alumnos todavía no están activados.'
            : 'No se pudieron cargar las solicitudes.'}
        </p>
      </div>
    );
  }

  const pendingItems = pending.data?.items ?? [];
  const acceptedItems = accepted.data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold">Solicitudes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alumnos que quieren vincularse con vos desde el catálogo.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pendientes ({pendingItems.length})
        </h2>
        {pendingItems.length ? (
          pendingItems.map((item) => (
            <RelationshipRow key={item.id} item={item} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No hay pendientes.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Activos ({acceptedItems.length})
        </h2>
        {acceptedItems.length ? (
          acceptedItems.map((item) => (
            <RelationshipRow key={item.id} item={item} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Todavía no hay vínculos activos.</p>
        )}
      </section>
    </div>
  );
}
