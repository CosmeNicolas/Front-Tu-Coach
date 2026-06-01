'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { PlanificacionTable } from '@/components/planificaciones/PlanificacionTable';
import {
  useArchivePlanification,
  useDeletePlanification,
  usePlanifications,
} from '@/hooks/usePlanifications';

export default function PlanificacionesPage() {
  const { data, isLoading } = usePlanifications();
  const archiveMutation = useArchivePlanification();
  const deleteMutation = useDeletePlanification();

  async function handleArchive(id: string) {
    try {
      await archiveMutation.mutateAsync(id);
      toast.success('Planificación archivada');
    } catch {
      toast.error('No se pudo archivar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta planificación?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Planificación eliminada');
    } catch {
      toast.error('No se pudo eliminar');
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Planificaciones</h1>
          <p className="mt-1 text-sm text-zinc-500">Planificaciones base asociadas a alumnos</p>
        </div>
        <Link
          href="/profesor/planificaciones/nueva"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nueva planificación
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-500">Cargando…</p>
      ) : (
        <PlanificacionTable
          items={data?.items ?? []}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
