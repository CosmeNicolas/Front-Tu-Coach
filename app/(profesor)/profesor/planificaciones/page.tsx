'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PlanificacionTable } from '@/components/planificaciones/PlanificacionTable';
import { Button } from '@/components/ui/button';
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
import {
  useArchivePlanification,
  useDeletePlanification,
  usePlanifications,
} from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';

export default function PlanificacionesPage() {
  const { data, isLoading } = usePlanifications();
  const archiveMutation = useArchivePlanification();
  const deleteMutation = useDeletePlanification();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');

  async function handleArchive(id: string) {
    try {
      await archiveMutation.mutateAsync(id);
      toast.success('Planificación archivada');
    } catch (err) {
      toast.error('No se pudo archivar', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  function requestDelete(id: string) {
    const plan = data?.items.find((p) => p.id === id);
    setDeleteId(id);
    setDeleteTitle(plan?.titulo ?? 'esta planificación');
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Planificación eliminada');
      setDeleteId(null);
    } catch (err) {
      toast.error('No se pudo eliminar', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Planificaciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Planificaciones base asociadas a alumnos
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/profesor/planificaciones/nueva">
            Nueva planificación
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <PlanificacionTable
          items={data?.items ?? []}
          onArchive={handleArchive}
          onDelete={requestDelete}
        />
      )}

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar planificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{deleteTitle}&quot;. Esta acción no se puede
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
