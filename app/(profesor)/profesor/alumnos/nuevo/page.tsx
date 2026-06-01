'use client';

import { useRouter } from 'next/navigation';
import { AlumnoForm } from '@/components/alumnos/AlumnoForm';
import { useCreateClient } from '@/hooks/useClients';

export default function NuevoAlumnoPage() {
  const router = useRouter();
  const createMutation = useCreateClient();

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Nuevo alumno</h1>
      <AlumnoForm
        submitLabel="Crear alumno"
        onSubmit={async (payload) => {
          const client = await createMutation.mutateAsync(payload);
          router.push(`/profesor/alumnos/${client.id}`);
        }}
      />
    </div>
  );
}
