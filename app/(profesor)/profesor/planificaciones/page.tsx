'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PlanificacionTable } from '@/components/planificaciones/PlanificacionTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  useUnarchivePlanification,
} from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';

const PAGE_SIZE = 15;

export default function PlanificacionesPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const { data, isLoading } = usePlanifications({
    search: debounced || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const archiveMutation = useArchivePlanification();
  const unarchiveMutation = useUnarchivePlanification();
  const deleteMutation = useDeletePlanification();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [unarchiveId, setUnarchiveId] = useState<string | null>(null);
  const [unarchiveTitle, setUnarchiveTitle] = useState('');
  const [unarchiveAlumno, setUnarchiveAlumno] = useState('');

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

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

  function requestUnarchive(id: string) {
    const plan = data?.items.find((p) => p.id === id);
    setUnarchiveId(id);
    setUnarchiveTitle(plan?.titulo ?? 'esta planificación');
    setUnarchiveAlumno(plan?.alumnoNombre ?? 'el alumno');
  }

  async function confirmUnarchive() {
    if (!unarchiveId) return;
    try {
      await unarchiveMutation.mutateAsync(unarchiveId);
      toast.success('Planificación desarchivada', {
        description: `Ahora es la Actual de ${unarchiveAlumno}.`,
      });
      setUnarchiveId(null);
    } catch (err) {
      toast.error('No se pudo desarchivar', {
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
            La etiqueta Actual es la que el alumno está usando ahora. Las demás
            quedan archivadas; podés desarchivarlas para volver a dárselas.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/profesor/planificaciones/nueva">
            Nueva planificación
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por planificación o alumno…"
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <>
          <PlanificacionTable
            items={data?.items ?? []}
            onArchive={handleArchive}
            onUnarchive={requestUnarchive}
            onDelete={requestDelete}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {total === 0
                ? 'Sin resultados'
                : `Mostrando ${from}–${to} de ${total}`}
            </p>
            {totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <span className="text-sm text-foreground">
                  Página {page} de {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Siguiente
                </Button>
              </div>
            ) : null}
          </div>
        </>
      )}

      <AlertDialog
        open={Boolean(unarchiveId)}
        onOpenChange={(open) => !open && setUnarchiveId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desarchivar planificación?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{unarchiveTitle}&quot; vuelve a ser la Actual de{' '}
              {unarchiveAlumno}. Si ya tiene una Actual, esa se archiva. El
              alumno verá este plan (con su progreso anterior) la próxima vez
              que entre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unarchiveMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={unarchiveMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                void confirmUnarchive();
              }}
            >
              {unarchiveMutation.isPending ? 'Desarchivando…' : 'Desarchivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
