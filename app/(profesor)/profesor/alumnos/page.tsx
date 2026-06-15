'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { AlumnoTable } from '@/components/alumnos/AlumnoTable';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';

export default function AlumnosPage() {
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
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Alumnos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestioná tus alumnos asignados</p>
        </div>
        <Button asChild>
          <Link href="/profesor/alumnos/nuevo">Nuevo alumno</Link>
        </Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <AlumnoTable items={data?.items ?? []} onDelete={handleDelete} />
      )}
    </div>
  );
}
