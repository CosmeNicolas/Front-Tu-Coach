'use client';

import { useState } from 'react';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';
import {
  PlanificationConfig,
  PlanificationItem,
  TIPO_ITEM_LABELS,
  TipoItem,
} from '@/types/planification';
import { btnOutline, btnPrimary, CEMD } from './constants';
import { defaultItem } from './CardEjercicio';
import { MiniTablaProgresion } from './MiniTablaProgresion';
import { EjercicioAvatar } from './EjercicioAvatar';
import { EjercicioMediaPreview } from '@/components/ejercicios/EjercicioMediaPreview';
import { inferMediaType } from '@/lib/ejercicios/media-type';
import { EjercicioCatalogo } from '@/lib/ejercicios/catalogo';
import { ProgresionAvanzadaFuerza } from './ProgresionAvanzadaFuerza';
import {
  ajustarRangosTrasCambioMin,
  rangosProgresionDefecto,
} from '@/lib/planification/fuerza-rangos';

const PRESETS = [
  { label: 'Conservador', series: 3, reps: 8, peso: 15, incPeso: 2.5, incReps: 2 },
  { label: 'Moderado', series: 3, reps: 10, peso: 20, incPeso: 2.5, incReps: 2 },
  { label: 'Intensivo', series: 4, reps: 12, peso: 25, incPeso: 5, incReps: 2 },
  { label: 'Fuerza', series: 4, reps: 6, peso: 30, incPeso: 5, incReps: 1 },
];

interface EjercicioBase {
  nombre: string;
  gif?: string;
  descripcion?: string;
  mediaType?: EjercicioCatalogo['mediaType'];
  isIsometrico?: boolean;
}

interface Props {
  config: PlanificationConfig;
  diaActivo: number;
  frecuenciaBloque: number | null;
  ejercicioBase?: EjercicioBase;
  onAgregar: (item: PlanificationItem) => void;
  onCancelar: () => void;
}

export function FormularioRapido({
  config,
  diaActivo,
  frecuenciaBloque,
  ejercicioBase,
  onAgregar,
  onCancelar,
}: Props) {
  const tipoInicial = ejercicioBase?.isIsometrico
    ? TipoItem.ISOMETRICO
    : TipoItem.FUERZA;

  const [tipo, setTipo] = useState<TipoItem>(tipoInicial);
  const [draft, setDraft] = useState<PlanificationItem>(() => {
    const base = defaultItem(tipoInicial, frecuenciaBloque ? diaActivo : undefined);
    if (!ejercicioBase) return base;
    return {
      ...base,
      ejercicio: ejercicioBase.nombre,
      gif: ejercicioBase.gif ?? null,
      tipoItem: tipoInicial,
    };
  });

  function changeTipo(t: TipoItem) {
    setTipo(t);
    setDraft((d) => ({
      ...defaultItem(t, frecuenciaBloque ? diaActivo : undefined),
      ejercicio: d.ejercicio,
      gif: d.gif,
    }));
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    const rangos = rangosProgresionDefecto(p.series, p.reps);
    setDraft((d) => ({
      ...d,
      parametros: {
        ...d.parametros,
        series: p.series,
        reps: p.reps,
        peso: p.peso,
        ...rangos,
      },
      progresion: { incrementoPeso: p.incPeso, incrementoReps: p.incReps },
    }));
  }

  function submit() {
    if (!draft.ejercicio.trim()) return;
    onAgregar({
      ...draft,
      diaBase: frecuenciaBloque ? diaActivo : undefined,
    });
  }

  const f = PLANIFICATION_LIMITS.fuerza;

  return (
    <div className={`rounded-xl border-2 border-primary bg-primary/5 p-4 shadow-sm`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <EjercicioAvatar
            gif={draft.gif}
            nombre={draft.ejercicio}
            mediaType={ejercicioBase?.mediaType}
            size="lg"
            roundedFull
          />
          <div>
            <h3 className={`font-bold ${CEMD.primaryClass}`}>
              {draft.ejercicio || 'Nuevo ejercicio'}
            </h3>
            <p className="text-xs text-zinc-500">Configurá carga y progresión</p>
            {ejercicioBase?.descripcion ? (
              <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500">
                {ejercicioBase.descripcion}
              </p>
            ) : null}
          </div>
        </div>
        <button type="button" onClick={onCancelar} className="text-zinc-400 hover:text-zinc-600">
          ✕
        </button>
      </div>

      {ejercicioBase?.gif ? (
        <div className="mb-4 flex justify-center">
          <EjercicioMediaPreview
            src={ejercicioBase.gif}
            alt={ejercicioBase.nombre}
            mediaType={ejercicioBase.mediaType}
            mode={
              ['youtube', 'mp4', 'webm'].includes(
                inferMediaType(ejercicioBase.gif, ejercicioBase.mediaType),
              )
                ? 'embed'
                : 'thumbnail'
            }
            containerClassName="w-full max-w-xs sm:max-w-sm"
          />
        </div>
      ) : null}

      {!ejercicioBase ? (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="font-medium">Nombre</span>
            <input
              type="text"
              value={draft.ejercicio}
              onChange={(e) => setDraft({ ...draft, ejercicio: e.target.value })}
              placeholder="Ej. Press de banco"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="font-medium">Tipo</span>
            <select
              value={tipo}
              onChange={(e) => changeTipo(e.target.value as TipoItem)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            >
              {[TipoItem.FUERZA, TipoItem.ISOMETRICO, TipoItem.MOVILIDAD].map((t) => (
                <option key={t} value={t}>
                  {TIPO_ITEM_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {tipo === TipoItem.FUERZA ? (
        <>
          <div className="mb-2 flex flex-wrap gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-full border border-primary/40 bg-white px-2 py-0.5 text-[10px] hover:bg-primary/10"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <Campo label="Series" value={draft.parametros.series} min={f.series.min} max={f.series.max}
              onChange={(v) => setDraft({ ...draft, parametros: ajustarRangosTrasCambioMin(draft.parametros, 'series', v) })} />
            <Campo label="Reps" value={draft.parametros.reps} min={f.reps.min} max={f.reps.max}
              onChange={(v) => setDraft({ ...draft, parametros: ajustarRangosTrasCambioMin(draft.parametros, 'reps', v) })} />
            <Campo label="Peso (kg)" value={draft.parametros.peso} min={f.peso.min} max={f.peso.max} step={0.5}
              onChange={(v) => setDraft({ ...draft, parametros: { ...draft.parametros, peso: v } })} />
            <Campo label="Inc. peso" value={draft.progresion?.incrementoPeso} min={0} max={f.incrementoPeso.max} step={0.5}
              onChange={(v) => setDraft({ ...draft, progresion: { ...draft.progresion, incrementoPeso: v } })} />
            <Campo label="Inc. reps" value={draft.progresion?.incrementoReps} min={0} max={f.incrementoReps.max}
              onChange={(v) => setDraft({ ...draft, progresion: { ...draft.progresion, incrementoReps: v } })} />
            <Campo label="Descanso" value={draft.parametros.descanso} min={0} max={600}
              onChange={(v) => setDraft({ ...draft, parametros: { ...draft.parametros, descanso: v } })} />
          </div>
          <ProgresionAvanzadaFuerza
            parametros={draft.parametros}
            onChange={(parametros) => setDraft({ ...draft, parametros })}
          />
        </>
      ) : null}

      {tipo === TipoItem.ISOMETRICO ? (
        <div className="grid grid-cols-3 gap-2">
          <Campo label="Series" value={draft.parametros.series} min={1} max={10}
            onChange={(v) => setDraft({ ...draft, parametros: { ...draft.parametros, series: v } })} />
          <Campo label="Segundos" value={draft.parametros.segundos} min={5} max={120}
            onChange={(v) => setDraft({ ...draft, parametros: { ...draft.parametros, segundos: v } })} />
          <Campo label="Inc. seg" value={draft.progresion?.incrementoSegundos} min={0} max={30}
            onChange={(v) => setDraft({ ...draft, progresion: { ...draft.progresion, incrementoSegundos: v } })} />
        </div>
      ) : null}

      <label className="mt-3 block text-sm">
        <span className="font-medium">Notas</span>
        <input
          type="text"
          value={draft.notas ?? ''}
          onChange={(e) => setDraft({ ...draft, notas: e.target.value || null })}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2"
          placeholder="Opcional — visible para el cliente"
        />
      </label>

      {draft.ejercicio.trim() ? (
        <MiniTablaProgresion item={draft} config={config} />
      ) : null}

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={onCancelar} className={btnOutline}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!draft.ejercicio.trim()}
          className={btnPrimary}
        >
          Agregar ejercicio
        </button>
      </div>
    </div>
  );
}

function Campo({
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
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step ?? 1}
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-0.5 w-full rounded border border-primary/30 bg-white px-1.5 py-1.5"
      />
    </label>
  );
}
