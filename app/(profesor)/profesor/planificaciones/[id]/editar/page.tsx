'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** La edición de ejercicios vive en el Asistente (wizard CEMD), no en un form suelto. */
export default function EditarPlanificacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/profesor/planificaciones/${id}/asistente`);
  }, [id, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8">
      <p className="text-sm text-muted-foreground">Abriendo asistente de planificación…</p>
    </div>
  );
}
