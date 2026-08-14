'use client';

import { useState } from 'react';
import { ParametrosItem } from '@/types/planification';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';

interface Props {
  parametros: ParametrosItem;
  onChange: (parametros: ParametrosItem) => void;
}

export function ProgresionAvanzadaFuerza({ parametros, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const f = PLANIFICATION_LIMITS.fuerza;
  const seriesMin = parametros.series ?? f.series.min;
  const repsMin = parametros.reps ?? f.reps.min;

  function setMax(campo: 'seriesMax' | 'repsMax', raw: number) {
    const min = campo === 'seriesMax' ? seriesMin : repsMin;
    const maxGlobal = campo === 'seriesMax' ? f.series.max : f.reps.max;
    const valor = Math.min(Math.max(raw, min), maxGlobal);
    onChange({ ...parametros, [campo]: valor });
  }

  return (
    <div className="mt-2 rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
      >
        <span>⚙️ Configuración avanzada de progresión</span>
        <span className="text-xs text-muted-foreground">{open ? '▲' : '▼'}</span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
          <p className="text-xs text-muted-foreground">
            Las series y reps del bloque superior son el punto de partida (mínimos).
            La progresión sube primero <strong>repeticiones</strong>, luego{' '}
            <strong>series</strong> y por último <strong>peso</strong>, hasta los
            topes que definas acá.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Info label="Series mín." value={seriesMin} />
            <Campo
              label="Series máx."
              value={parametros.seriesMax}
              min={seriesMin}
              max={f.series.max}
              onChange={(v) => setMax('seriesMax', v)}
            />
            <Info label="Reps mín." value={repsMin} />
            <Campo
              label="Reps máx."
              value={parametros.repsMax}
              min={repsMin}
              max={f.reps.max}
              onChange={(v) => setMax('repsMax', v)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <div className="mt-0.5 rounded border border-border bg-muted/40 px-1.5 py-1.5 text-foreground">
        {value}
      </div>
    </div>
  );
}

function Campo({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-xs">
      <span className="font-medium text-foreground">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="mt-0.5 w-full rounded border border-primary/30 bg-card px-1.5 py-1.5"
      />
    </label>
  );
}
