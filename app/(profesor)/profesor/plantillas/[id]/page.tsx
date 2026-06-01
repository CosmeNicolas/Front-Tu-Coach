'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlanification } from '@/hooks/usePlanifications';
import { ClonarPlantillaDialog } from '@/components/plantillas/ClonarPlantillaDialog';
import { Button } from '@/components/ui/button';
import {
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
} from '@/lib/plantillas/template-categories';
import {
  PROGRESSION_MODE_LABELS,
  Planification,
} from '@/types/planification';

function TemplateDetalle({ planification }: { planification: Planification }) {
  const totalItems = planification.secciones.reduce(
    (acc, s) => acc + s.items.length,
    0,
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Plantilla
            </p>
            {planification.categoriaPlantilla ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {TEMPLATE_CATEGORY_LABELS[
                  planification.categoriaPlantilla as TemplateCategory
                ] ?? planification.categoriaPlantilla}
              </span>
            ) : null}
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            {planification.nombrePlantilla ?? planification.titulo}
          </h1>
          {planification.descripcionPlantilla ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {planification.descripcionPlantilla}
            </p>
          ) : null}
          <p className="mt-1 text-sm text-muted-foreground">
            v{planification.contentVersion} · {planification.secciones.length}{' '}
            secciones
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link
              href={`/profesor/planificaciones/${planification.id}/asistente`}
            >
              Editar en asistente
            </Link>
          </Button>
          <ClonarPlantillaDialog template={planification} />
        </div>
      </div>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Modo
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {PROGRESSION_MODE_LABELS[planification.config.modoProgresion]}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Sesiones
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {planification.config.totalSesiones}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Semanas
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {planification.config.semanasDelPlan}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Ítems
          </dt>
          <dd className="mt-1 text-sm text-foreground">{totalItems}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function PlantillaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = usePlanification(id);

  useEffect(() => {
    if (data && !data.esPlantilla) {
      router.replace(`/profesor/planificaciones/${id}`);
    }
    if (data && data.secciones.every((s) => s.items.length === 0)) {
      router.replace(`/profesor/planificaciones/${id}/asistente`);
    }
  }, [data, id, router]);

  if (isLoading) {
    return <p className="p-4 sm:p-8 text-sm text-muted-foreground">Cargando…</p>;
  }

  if (!data || !data.esPlantilla) {
    return (
      <p className="p-4 sm:p-8 text-sm text-muted-foreground">Plantilla no encontrada</p>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-8">
      <Link
        href="/profesor/plantillas"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Plantillas
      </Link>
      <TemplateDetalle planification={data} />
    </div>
  );
}
