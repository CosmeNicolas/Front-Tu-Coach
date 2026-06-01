'use client';

import { useEffect, useState } from 'react';
import {
  PlanificationConfig,
  ProgressionMode,
  PROGRESSION_MODE_LABELS,
} from '@/types/planification';
import {
  aplicarCambioFrecuencia,
  aplicarCambioModo,
  aplicarCambioSemanas,
  descripcionProgresion,
  PLAN_WEEK_OPTIONS,
  WEEKLY_FREQUENCY_OPTIONS,
} from '@/lib/planificaciones/config-options';

interface PlanificacionConfigFieldsProps {
  value: PlanificationConfig;
  onChange: (config: PlanificationConfig) => void;
}

const selectCls =
  'rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground';

export function PlanificacionConfigFields({
  value,
  onChange,
}: PlanificacionConfigFieldsProps) {
  const [config, setConfig] = useState(value);

  useEffect(() => {
    setConfig(value);
  }, [value]);

  function commit(next: PlanificationConfig) {
    setConfig(next);
    onChange(next);
  }

  function onModoChange(modo: ProgressionMode) {
    commit(aplicarCambioModo(config, modo));
  }

  function onFrecuenciaChange(freq: number) {
    commit(aplicarCambioFrecuencia(config, freq));
  }

  function onSemanasChange(semanas: number) {
    commit(aplicarCambioSemanas(config, semanas));
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Modo de progresión</span>
        <select
          value={config.modoProgresion}
          onChange={(e) => onModoChange(e.target.value as ProgressionMode)}
          className={selectCls}
        >
          {Object.values(ProgressionMode).map((mode) => (
            <option key={mode} value={mode}>
              {PROGRESSION_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Semanas del plan</span>
          <select
            value={config.semanasDelPlan}
            onChange={(e) => onSemanasChange(Number(e.target.value))}
            className={selectCls}
          >
            {PLAN_WEEK_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} {s === 1 ? 'semana' : 'semanas'}
                {s === 4 ? ' (mes)' : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Frecuencia semanal</span>
          <select
            value={config.frecuenciaSemanal}
            onChange={(e) => onFrecuenciaChange(Number(e.target.value))}
            className={selectCls}
          >
            {WEEKLY_FREQUENCY_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f} {f === 1 ? 'día' : 'días'} por semana
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
        <p>
          <strong className="text-foreground">Total sesiones:</strong>{' '}
          {config.totalSesiones}
        </p>
        <p className="mt-1 text-muted-foreground">
          {config.frecuenciaSemanal} días/semana × {config.semanasDelPlan} semana
          {config.semanasDelPlan > 1 ? 's' : ''} = {config.totalSesiones} sesiones
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {descripcionProgresion(config)}
        </p>
      </div>
    </div>
  );
}
