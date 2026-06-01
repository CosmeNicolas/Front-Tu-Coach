'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  PlanificationConfig,
  PROGRESSION_MODE_LABELS,
  ProgressionMode,
} from '@/types/planification';
import { useUpdatePlanification } from '@/hooks/usePlanifications';
import { Label } from '@/components/ui/label';
import {
  aplicarCambioConfig,
  aplicarCambioFrecuencia,
  aplicarCambioModo,
  aplicarCambioTotalSesiones,
  opcionesSesiones,
  WEEKLY_FREQUENCY_OPTIONS,
} from '@/lib/planificaciones/config-options';
import { etiquetaDia } from '@/lib/planification/preview-progression';

interface Props {
  planificationId: string;
  config: PlanificationConfig;
  diaActivo: number;
  frecuenciaBloque: number | null;
  onDiaChange: (dia: number) => void;
}

const selectCls =
  'h-9 rounded-md border border-primary bg-background px-2 text-sm text-foreground';

export function AsistenteConfigBar({
  planificationId,
  config,
  diaActivo,
  frecuenciaBloque,
  onDiaChange,
}: Props) {
  const update = useUpdatePlanification(planificationId);
  const [draft, setDraft] = useState(config);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const sesionesOpts = opcionesSesiones(draft.frecuenciaSemanal);

  async function commit(next: PlanificationConfig) {
    setDraft(next);
    try {
      await update.mutateAsync({ config: next });
      toast.success('Configuración actualizada');
    } catch {
      toast.error('No se pudo actualizar la configuración');
      setDraft(config);
    }
  }

  function patch(partial: Partial<PlanificationConfig>) {
    void commit(aplicarCambioConfig(draft, partial));
  }

  function onModoChange(modo: ProgressionMode) {
    void commit(aplicarCambioModo(draft, modo));
  }

  function onFrecuenciaChange(freq: number) {
    void commit(aplicarCambioFrecuencia(draft, freq));
  }

  function onSesionesChange(total: number) {
    void commit(aplicarCambioTotalSesiones(draft, total));
  }

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Modo</Label>
        <select
          value={draft.modoProgresion}
          onChange={(e) => onModoChange(e.target.value as ProgressionMode)}
          disabled={update.isPending}
          className={selectCls}
        >
          {Object.values(ProgressionMode).map((m) => (
            <option key={m} value={m}>
              {PROGRESSION_MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Frecuencia semanal</Label>
        <select
          value={draft.frecuenciaSemanal}
          onChange={(e) => onFrecuenciaChange(Number(e.target.value))}
          disabled={update.isPending}
          className={selectCls}
        >
          {WEEKLY_FREQUENCY_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f} {f === 1 ? 'día' : 'días'}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Sesiones</Label>
        <select
          value={draft.totalSesiones}
          onChange={(e) => onSesionesChange(Number(e.target.value))}
          disabled={update.isPending}
          className={selectCls}
        >
          {sesionesOpts.map((o) => (
            <option key={o.totalSesiones} value={o.totalSesiones}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {frecuenciaBloque ? (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Día</Label>
          <select
            value={diaActivo}
            onChange={(e) => onDiaChange(Number(e.target.value))}
            className={`${selectCls} font-semibold text-primary`}
          >
            {Array.from({ length: frecuenciaBloque }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {etiquetaDia(draft.modoProgresion, d)}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {update.isPending ? (
        <span className="text-xs text-muted-foreground">Actualizando…</span>
      ) : null}
    </div>
  );
}
