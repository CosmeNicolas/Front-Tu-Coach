'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlumnoTable } from '@/components/alumnos/AlumnoTable';
import { useClients, useDeleteClient } from '@/hooks/useClients';

export default function AlumnosPage() {
  const router = useRouter();
  const { data, isLoading } = useClients();
  const deleteMutation = useDeleteClient();

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este alumno?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Alumno eliminado');
    } catch {
      toast.error('No se pudo eliminar');
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-zinc-900 sm:text-2xl">Alumnos</h1>
          <p className="mt-1 text-sm text-zinc-500">Gestioná tus alumnos asignados</p>
        </div>
        <Link
          href="/profesor/alumnos/nuevo"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo alumno
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-500">Cargando…</p>
      ) : (
        <AlumnoTable items={data?.items ?? []} onDelete={handleDelete} />
      )}
    </div>
  );
}
