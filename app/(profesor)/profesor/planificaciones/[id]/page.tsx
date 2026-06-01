'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlanificacionDetalleCard } from '@/components/planificaciones/PlanificacionDetalleCard';
import { GuardarComoPlantillaDialog } from '@/components/plantillas/GuardarComoPlantillaDialog';
import { usePlanification } from '@/hooks/usePlanifications';
import { Button } from '@/components/ui/button';

export default function PlanificacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = usePlanification(id);

  // Si no tiene secciones cargadas, ir directo al wizard
  useEffect(() => {
    if (data && data.secciones.every((s) => s.items.length === 0)) {
      router.replace(`/profesor/planificaciones/${id}/asistente`);
    }
  }, [data, id, router]);

  if (isLoading) return <div className="p-8 text-sm text-muted-foreground">Cargando…</div>;
  if (!data) return <div className="p-8 text-sm text-muted-foreground">Planificación no encontrada</div>;

  return (
    <div className="space-y-4 p-8">
      <div className="flex flex-wrap gap-2">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/profesor/planificaciones/${id}/asistente`}>
            Abrir Asistente de planificación
          </Link>
        </Button>
        {data.secciones.some((s) => s.items.length > 0) ? (
          <GuardarComoPlantillaDialog
            planificationId={id}
            defaultName={data.titulo}
          />
        ) : null}
      </div>
      <PlanificacionDetalleCard planification={data} />
    </div>
  );
}
