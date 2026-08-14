'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { useMaterializedPlanification } from '@/hooks/usePlanifications';
import { PlanificationConfig } from '@/types/planification';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { normalizeDiaBase } from '@/lib/planification/asistente-dia';
import { Badge } from '@/components/ui/badge';
import { CEMD, selectCemd } from './constants';
import { SesionPreviewCard } from './preview/SesionPreviewCard';

interface Props {
  planificationId: string;
  config: PlanificationConfig;
  needsSave: boolean;
  diaActivo: number;
  frecuenciaBloque: number | null;
  onDiaChange: (dia: number) => void;
}

export function PreviewPanel({
  planificationId,
  config,
  needsSave,
  diaActivo,
  frecuenciaBloque,
  onDiaChange,
}: Props) {
  /** null = todas; si no, sigue al día del asistente */
  const [verTodas, setVerTodas] = useState(false);
  const { data, isLoading, error, dataUpdatedAt } =
    useMaterializedPlanification(planificationId);

  useEffect(() => {
    // Al cambiar el día desde la barra, salimos de "Todas"
    setVerTodas(false);
  }, [diaActivo]);

  const filtroDia =
    frecuenciaBloque && !verTodas ? normalizeDiaBase(diaActivo) : null;

  const sesionesFiltradas = useMemo(() => {
    if (!data) return [];
    if (filtroDia == null) return data.sesiones;
    return data.sesiones.filter(
      (s) => normalizeDiaBase(s.diaBase) === filtroDia,
    );
  }, [data, filtroDia]);

  if (needsSave) {
    return (
      <section className="rounded-xl border border-border bg-muted p-6 text-sm text-muted-foreground">
        Guardá los cambios antes de ver la vista previa con las sesiones
        materializadas del servidor.
      </section>
    );
  }

  if (isLoading) {
    return (
      <p className={`text-sm ${CEMD.primaryClass}`}>Cargando sesiones materializadas…</p>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-rose-600">Error al cargar la vista previa.</p>
    );
  }

  const sesionesVacias =
    filtroDia != null &&
    sesionesFiltradas.every((s) =>
      s.secciones.every((sec) => (sec.items?.length ?? 0) === 0),
    );

  return (
    <section className={`rounded-xl border ${CEMD.borderClass} bg-card p-4 sm:p-6`}>
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Eye className={`size-5 ${CEMD.primaryClass}`} />
            <h2 className={`text-lg font-semibold ${CEMD.primaryClass}`}>
              Vista previa — como verá el alumno
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.totalSesiones} sesiones · fuente{' '}
            <code className="rounded bg-muted px-1 text-xs">GET /materialized</code>
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline" className="font-mono text-xs">
              contentVersion: {data.contentVersion}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              sync{' '}
              {new Date(dataUpdatedAt).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        </div>

        {frecuenciaBloque ? (
          <label className="flex w-full min-w-0 flex-col gap-2 text-sm sm:flex-row sm:items-center">
            <span className="shrink-0 font-medium">Ver día base:</span>
            <select
              value={verTodas ? '' : String(normalizeDiaBase(diaActivo))}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  setVerTodas(true);
                  return;
                }
                setVerTodas(false);
                onDiaChange(Number(v));
              }}
              className={`${selectCemd} w-full min-w-0 sm:max-w-[200px]`}
            >
              <option value="">Todas las sesiones</option>
              {Array.from({ length: frecuenciaBloque }, (_, i) => i + 1).map(
                (d) => (
                  <option key={d} value={d}>
                    {etiquetaDia(config.modoProgresion, d)}
                  </option>
                ),
              )}
            </select>
          </label>
        ) : null}
      </header>

      {sesionesFiltradas.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay sesiones para el filtro seleccionado.
        </p>
      ) : sesionesVacias ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
          {filtroDia
            ? `${etiquetaDia(config.modoProgresion, filtroDia)} todavía no tiene ejercicios cargados. Volvé al asistente, elegí ese día en la barra y cargá las secciones. Podés guardar y continuar después.`
            : 'No hay ejercicios en estas sesiones.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sesionesFiltradas.map((sesion) => (
            <SesionPreviewCard
              key={sesion.numero}
              sesion={sesion}
              config={config}
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-center text-[10px] text-muted-foreground">
        Mostrando {sesionesFiltradas.length} de {data.totalSesiones} sesiones
        {filtroDia
          ? ` · ${etiquetaDia(config.modoProgresion, filtroDia)}`
          : ''}
      </p>
    </section>
  );
}
