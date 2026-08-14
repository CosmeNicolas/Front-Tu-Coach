'use client';

import { PLANIFICATION_LIMITS } from '@/types/planification-limits';
import { PlanificationItem, TipoItem } from '@/types/planification';
import { ProgresionAvanzadaFuerza } from './ProgresionAvanzadaFuerza';

interface Props {
  draft: PlanificationItem;
  setParam: (k: keyof PlanificationItem['parametros'], v: number) => void;
  setProg: (
    k: keyof NonNullable<PlanificationItem['progresion']>,
    v: number,
  ) => void;
  setParametros: (p: PlanificationItem['parametros']) => void;
  setNotas: (n: string) => void;
}

export function CardEjercicioEdicion({
  draft,
  setParam,
  setProg,
  setParametros,
  setNotas,
}: Props) {
  const f = PLANIFICATION_LIMITS.fuerza;
  const iso = PLANIFICATION_LIMITS.isometrico;

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
      {draft.tipoItem === TipoItem.FUERZA ? (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Num label="Series" value={draft.parametros.series} onChange={(v) => setParam('series', v)} min={f.series.min} max={f.series.max} />
            <Num label="Reps" value={draft.parametros.reps} onChange={(v) => setParam('reps', v)} min={f.reps.min} max={f.reps.max} />
            <Num label="Peso" value={draft.parametros.peso} onChange={(v) => setParam('peso', v)} min={f.peso.min} max={f.peso.max} step={0.5} />
            <Num label="+ Peso" value={draft.progresion?.incrementoPeso} onChange={(v) => setProg('incrementoPeso', v)} min={0} max={f.incrementoPeso.max} step={0.5} />
            <Num label="+ Reps" value={draft.progresion?.incrementoReps} onChange={(v) => setProg('incrementoReps', v)} min={0} max={f.incrementoReps.max} />
            <Num label="Descanso" value={draft.parametros.descanso} onChange={(v) => setParam('descanso', v)} min={0} max={600} />
          </div>
          <ProgresionAvanzadaFuerza parametros={draft.parametros} onChange={setParametros} />
        </>
      ) : null}
      {draft.tipoItem === TipoItem.ISOMETRICO ? (
        <div className="grid grid-cols-3 gap-2">
          <Num label="Series" value={draft.parametros.series} onChange={(v) => setParam('series', v)} min={iso.series.min} max={iso.series.max} />
          <Num label="Segundos" value={draft.parametros.segundos} onChange={(v) => setParam('segundos', v)} min={iso.segundosIniciales.min} max={iso.segundosIniciales.max} />
          <Num label="+ Seg" value={draft.progresion?.incrementoSegundos} onChange={(v) => setProg('incrementoSegundos', v)} min={0} max={iso.incrementoSegundos.max} />
        </div>
      ) : null}
      <label className="block text-xs">
        <span className="font-medium">Notas</span>
        <input
          type="text"
          value={draft.notas ?? ''}
          onChange={(e) => setNotas(e.target.value)}
          className="mt-0.5 w-full rounded border border-input bg-card px-2 py-1"
        />
      </label>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="text-xs">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step ?? 1}
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-0.5 w-full rounded border border-input bg-card px-1.5 py-1"
      />
    </label>
  );
}
