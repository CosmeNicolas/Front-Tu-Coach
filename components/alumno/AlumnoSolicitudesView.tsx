'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useCancelCoachRelationship,
  useEndCoachRelationship,
  useMyCoachRelationships,
  useSetChatPermission,
  useSetViewHistoryPermission,
} from '@/hooks/useCoachRelationships';
import type { CoachRelationship } from '@/lib/api/coach-relationships';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function statusLabel(status: CoachRelationship['status']) {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'accepted':
      return 'Vinculado';
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

export function AlumnoSolicitudesView() {
  const { data, isLoading, error } = useMyCoachRelationships();
  const cancel = useCancelCoachRelationship();
  const end = useEndCoachRelationship();
  const setHistory = useSetViewHistoryPermission();
  const setChat = useSetChatPermission();

  async function run(action: () => Promise<unknown>, ok: string) {
    try {
      await action();
      toast.success(ok);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No se pudo completar');
    }
  }

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando vínculos…</p>
    );
  }

  if (error) {
    return (
      <div className="space-y-2 p-6">
        <h1 className="text-xl font-semibold">Mis coaches</h1>
        <p className="text-sm text-destructive">
          {error instanceof ApiError && error.status === 404
            ? 'Los vínculos con profesores todavía no están activados.'
            : 'No se pudieron cargar tus vínculos.'}
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Mis coaches</h1>
        <p className="text-sm text-muted-foreground">
          Solicitudes y vínculos con profesores del catálogo.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/profesores">Buscar un profesor</Link>
        </Button>
      </header>

      {!items.length ? (
        <p className="text-sm text-muted-foreground">
          Todavía no pediste vínculo con ningún profesor.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      {item.profesorNombre ?? 'Profesor'}
                    </p>
                    <Badge className="mt-2" variant="secondary">
                      {statusLabel(item.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.professorSlug ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/profesores/${item.professorSlug}`}>
                          Ver perfil
                        </Link>
                      </Button>
                    ) : null}
                    {item.status === 'pending' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cancel.isPending}
                        onClick={() =>
                          void run(
                            () => cancel.mutateAsync(item.id),
                            'Solicitud cancelada',
                          )
                        }
                      >
                        Cancelar
                      </Button>
                    ) : null}
                    {item.status === 'accepted' ? (
                      <>
                        {item.permissions.chat ? (
                          <Button asChild size="sm" variant="secondary">
                            <Link
                              href={`/alumno/solicitudes/${item.id}/chat`}
                            >
                              Chat
                            </Link>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={end.isPending}
                          onClick={() =>
                            void run(
                              () => end.mutateAsync(item.id),
                              'Vínculo finalizado',
                            )
                          }
                        >
                          Finalizar
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>

                {item.status === 'accepted' ? (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-3 py-3">
                      <div className="space-y-1">
                        <Label htmlFor={`view-history-${item.id}`}>
                          Compartir historial
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Permite que este profesor vea tus planificaciones y
                          progreso previos (solo lectura).
                        </p>
                      </div>
                      <Switch
                        id={`view-history-${item.id}`}
                        checked={item.permissions.viewHistory}
                        disabled={setHistory.isPending}
                        onCheckedChange={(checked) =>
                          void run(
                            () =>
                              setHistory.mutateAsync({
                                id: item.id,
                                viewHistory: checked,
                              }),
                            checked
                              ? 'Historial compartido'
                              : 'Historial oculto',
                          )
                        }
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-3 py-3">
                      <div className="space-y-1">
                        <Label htmlFor={`chat-${item.id}`}>Habilitar chat</Label>
                        <p className="text-xs text-muted-foreground">
                          Permite escribirse mensajes con este profesor.
                        </p>
                      </div>
                      <Switch
                        id={`chat-${item.id}`}
                        checked={item.permissions.chat}
                        disabled={setChat.isPending}
                        onCheckedChange={(checked) =>
                          void run(
                            () =>
                              setChat.mutateAsync({
                                id: item.id,
                                chat: checked,
                              }),
                            checked ? 'Chat habilitado' : 'Chat deshabilitado',
                          )
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
