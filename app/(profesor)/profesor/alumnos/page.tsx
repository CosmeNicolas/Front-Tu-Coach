'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { AlumnoTable } from '@/components/alumnos/AlumnoTable';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useProfessorCoachInbox } from '@/hooks/useCoachRelationships';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AlumnosPage() {
  const { data, isLoading } = useClients();
  const linked = useProfessorCoachInbox('accepted');
  const deleteMutation = useDeleteClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteLabel = useMemo(() => {
    if (!deleteId) return '';
    const client = data?.items.find((c) => c.id === deleteId);
    if (!client) return 'este alumno';
    return `${client.apellido}, ${client.nombre}`;
  }, [data?.items, deleteId]);

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Alumno eliminado');
      setDeleteId(null);
    } catch {
      toast.error('No se pudo eliminar');
    }
  }

  const linkedItems = linked.data?.items ?? [];

  return (
    <div className="space-y-10 p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Alumnos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestioná tus alumnos asignados y los vínculos del catálogo
          </p>
        </div>
        <Button asChild>
          <Link href="/profesor/alumnos/nuevo">Nuevo alumno</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          De tu cuenta
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : (
          <AlumnoTable items={data?.items ?? []} onDelete={setDeleteId} />
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Vinculados del catálogo ({linkedItems.length})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Alumnos que se entrenan por cuenta propia y se vincularon con vos.
            Solo lectura; no son alumnos que cargaste vos en el gimnasio.
          </p>
        </div>

        {linked.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando vínculos…</p>
        ) : linked.error ? (
          <p className="text-sm text-muted-foreground">
            Los vínculos del catálogo no están disponibles.
          </p>
        ) : !linkedItems.length ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Todavía no tenés alumnos vinculados desde el catálogo.
          </p>
        ) : (
          <div className="space-y-3">
            {linkedItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {item.alumnoNombre ?? 'Alumno'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">Vinculado</Badge>
                      {item.permissions.viewHistory ? (
                        <Badge variant="outline">Historial compartido</Badge>
                      ) : (
                        <Badge variant="outline">Sin historial</Badge>
                      )}
                      {item.permissions.chat ? (
                        <Badge variant="outline">Chat habilitado</Badge>
                      ) : (
                        <Badge variant="outline">Sin chat</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.permissions.viewHistory ? (
                      <Button asChild size="sm">
                        <Link
                          href={`/profesor/solicitudes/${item.id}/historial`}
                        >
                          Ver historial
                        </Link>
                      </Button>
                    ) : null}
                    {item.permissions.chat ? (
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/profesor/solicitudes/${item.id}/chat`}>
                          Chat
                        </Link>
                      </Button>
                    ) : (
                      <p className="self-center text-xs text-muted-foreground">
                        El alumno aún no habilitó chat
                      </p>
                    )}
                    {!item.permissions.viewHistory &&
                    !item.permissions.chat ? (
                      <p className="self-center text-xs text-muted-foreground">
                        Sin historial ni chat todavía
                      </p>
                    ) : null}
                    <Button asChild size="sm" variant="outline">
                      <Link href="/profesor/solicitudes">Solicitudes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar alumno?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{deleteLabel}&quot;. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
