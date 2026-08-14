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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlanificacionConfigFieldsProps {
  value: PlanificationConfig;
  onChange: (config: PlanificationConfig) => void;
}

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

  function onModoChange(modo: string) {
    commit(aplicarCambioModo(config, modo as ProgressionMode));
  }

  function onFrecuenciaChange(freq: string) {
    commit(aplicarCambioFrecuencia(config, Number(freq)));
  }

  function onSemanasChange(semanas: string) {
    commit(aplicarCambioSemanas(config, Number(semanas)));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label>Modo de progresión</Label>
        <Select value={config.modoProgresion} onValueChange={onModoChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ProgressionMode).map((mode) => (
              <SelectItem key={mode} value={mode}>
                {PROGRESSION_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Semanas del plan</Label>
          <Select
            value={String(config.semanasDelPlan)}
            onValueChange={onSemanasChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAN_WEEK_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s} {s === 1 ? 'semana' : 'semanas'}
                  {s === 4 ? ' (mes)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Frecuencia semanal</Label>
          <Select
            value={String(config.frecuenciaSemanal)}
            onValueChange={onFrecuenciaChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKLY_FREQUENCY_OPTIONS.map((f) => (
                <SelectItem key={f} value={String(f)}>
                  {f} {f === 1 ? 'día' : 'días'} por semana
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
        <p>
          <strong className="text-foreground">Total sesiones:</strong>{' '}
          {config.totalSesiones}
        </p>
        <p className="mt-1 text-muted-foreground">
          {config.frecuenciaSemanal} días/semana × {config.semanasDelPlan}{' '}
          semana{config.semanasDelPlan > 1 ? 's' : ''} = {config.totalSesiones}{' '}
          sesiones
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {descripcionProgresion(config)}
        </p>
      </div>
    </div>
  );
}
