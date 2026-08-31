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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  aplicarCambioFrecuencia,
  aplicarCambioModo,
  aplicarCambioTotalSesiones,
  opcionesSesiones,
  WEEKLY_FREQUENCY_OPTIONS,
} from '@/lib/planificaciones/config-options';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { sesionesDeDiaBase } from '@/lib/planification/asistente-dia';
import { cn } from '@/lib/utils';

interface DiaResumen {
  dia: number;
  ejercicios: number;
}

interface Props {
  planificationId: string;
  config: PlanificationConfig;
  diaActivo: number;
  frecuenciaBloque: number | null;
  diasResumen: DiaResumen[];
  totalSesiones: number;
  onDiaChange: (dia: number) => void;
}

export function AsistenteConfigBar({
  planificationId,
  config,
  diaActivo,
  frecuenciaBloque,
  diasResumen,
  totalSesiones,
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
      toast.success(
        'Configuración actualizada. Si cambiaste de bloque, los ejercicios de cada día se mantienen; los de un día que ya no existe pasan al último día del bloque nuevo.',
      );
    } catch {
      toast.error('No se pudo actualizar la configuración');
      setDraft(config);
    }
  }

  function onModoChange(modo: string) {
    void commit(aplicarCambioModo(draft, modo as ProgressionMode));
  }

  function onFrecuenciaChange(freq: string) {
    void commit(aplicarCambioFrecuencia(draft, Number(freq)));
  }

  function onSesionesChange(total: string) {
    void commit(aplicarCambioTotalSesiones(draft, Number(total)));
  }

  const sesionesDelDia =
    frecuenciaBloque != null
      ? sesionesDeDiaBase(diaActivo, totalSesiones, frecuenciaBloque)
      : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="min-w-[10rem] space-y-1">
          <Label className="text-xs text-muted-foreground">Modo</Label>
          <Select
            value={draft.modoProgresion}
            onValueChange={onModoChange}
            disabled={update.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProgressionMode).map((m) => (
                <SelectItem key={m} value={m}>
                  {PROGRESSION_MODE_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[9rem] space-y-1">
          <Label className="text-xs text-muted-foreground">
            Frecuencia semanal
          </Label>
          <Select
            value={String(draft.frecuenciaSemanal)}
            onValueChange={onFrecuenciaChange}
            disabled={update.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKLY_FREQUENCY_OPTIONS.map((f) => (
                <SelectItem key={f} value={String(f)}>
                  {f} {f === 1 ? 'día' : 'días'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[12rem] space-y-1">
          <Label className="text-xs text-muted-foreground">Sesiones</Label>
          <Select
            value={String(draft.totalSesiones)}
            onValueChange={onSesionesChange}
            disabled={update.isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sesionesOpts.map((o) => (
                <SelectItem key={o.totalSesiones} value={String(o.totalSesiones)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {update.isPending ? (
          <span className="text-xs text-muted-foreground">Actualizando…</span>
        ) : null}
      </div>

      {frecuenciaBloque ? (
        <div
          className="rounded-lg border border-border bg-muted/30 px-3 py-3"
          data-tour="profesor-asistente-dias"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Día que estás editando
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                {etiquetaDia(draft.modoProgresion, diaActivo)}
                {sesionesDelDia.length > 0 ? (
                  <span className="text-muted-foreground">
                    {' '}
                    · sesiones {sesionesDelDia.slice(0, 6).join(', ')}
                    {sesionesDelDia.length > 6 ? '…' : ''}
                  </span>
                ) : null}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Guardá y retomá otro día cuando quieras
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {diasResumen.map(({ dia, ejercicios }) => {
              const activo = dia === diaActivo;
              const listo = ejercicios > 0;
              return (
                <button
                  key={dia}
                  type="button"
                  onClick={() => onDiaChange(dia)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                    activo
                      ? 'border-foreground bg-background text-foreground shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                  )}
                >
                  <span className="block font-medium text-foreground">
                    {etiquetaDia(draft.modoProgresion, dia)}
                  </span>
                  <span className="mt-0.5 block text-[11px]">
                    {listo
                      ? `${ejercicios} ejercicio${ejercicios === 1 ? '' : 's'}`
                      : 'Pendiente'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
