'use client';

import { useEffect, useState } from 'react';
import { OPCIONES_CARDIO } from '@/lib/ejercicios/catalogo-cardio';
import { resolveGifUrl } from '@/lib/ejercicios/gif-url';
import { ensureSingleItem, isSingleItem, diaBaseDeItem } from '@/lib/planification/section-items';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';
import {
  PlanificationSection,
  TipoItem,
  TipoSeccion,
  UnidadTrabajo,
} from '@/types/planification';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import {
  CEMD,
  OPCIONES_INCREMENTO_MIN,
  OPCIONES_MINUTOS,
  selectCemd,
} from './constants';
import { EjercicioAvatar } from './EjercicioAvatar';
import { MiniTablaProgresion } from './MiniTablaProgresion';

interface Props {
  tipoSeccion: TipoSeccion.CALENTAMIENTO | TipoSeccion.VUELTA_CALMA;
  seccion?: PlanificationSection;
  config: import('@/types/planification').PlanificationConfig;
  diaActivo: number;
  frecuenciaBloque: number | null;
  onChange: (sec: PlanificationSection) => void;
}

export function SelectorCardioGrid({
  tipoSeccion,
  seccion,
  config,
  diaActivo,
  frecuenciaBloque,
  onChange,
}: Props) {
  const limits =
    tipoSeccion === TipoSeccion.CALENTAMIENTO
      ? PLANIFICATION_LIMITS.calentamiento
      : PLANIFICATION_LIMITS.vueltaCalma;

  const rawItem = frecuenciaBloque
    ? seccion?.items.find(
        (it) => isSingleItem(it) && (diaBaseDeItem(it) ?? 1) === diaActivo,
      )
    : seccion?.items[0];
  const item = rawItem && isSingleItem(rawItem) ? rawItem : undefined;
  const [selId, setSelId] = useState(
    () => OPCIONES_CARDIO.find((o) => o.nombre === item?.ejercicio)?.id ?? '',
  );
  const [minutos, setMinutos] = useState(item?.parametros.minutos ?? 10);
  const [incremento, setIncremento] = useState(
    item?.progresion?.incrementoMinutos ?? 2,
  );
  const [notas, setNotas] = useState(item?.notas ?? '');

  useEffect(() => {
    const nextRaw = frecuenciaBloque
      ? seccion?.items.find(
          (it) => isSingleItem(it) && (diaBaseDeItem(it) ?? 1) === diaActivo,
        )
      : seccion?.items[0];
    const nextItem =
      nextRaw && isSingleItem(nextRaw) ? nextRaw : undefined;
    setSelId(
      OPCIONES_CARDIO.find((o) => o.nombre === nextItem?.ejercicio)?.id ?? '',
    );
    setMinutos(nextItem?.parametros.minutos ?? 10);
    setIncremento(nextItem?.progresion?.incrementoMinutos ?? 2);
    setNotas(nextItem?.notas ?? '');
  }, [seccion, diaActivo, frecuenciaBloque]);

  const titulo =
    tipoSeccion === TipoSeccion.CALENTAMIENTO
      ? 'Entrada en calor'
      : 'Vuelta a la calma';
  const emoji = tipoSeccion === TipoSeccion.CALENTAMIENTO ? '🔥' : '🧘';
  const esEntrada = tipoSeccion === TipoSeccion.CALENTAMIENTO;

  function buildItem(id: string, min: number, inc: number, note: string) {
    const op = OPCIONES_CARDIO.find((o) => o.id === id);
    if (!op) return null;

    const newItem = ensureSingleItem({
      ejercicio: op.nombre,
      tipoItem: TipoItem.AEROBICO,
      unidadTrabajo: UnidadTrabajo.MIN,
      parametros: { minutos: min },
      progresion: { incrementoMinutos: inc },
      gif: op.imagen ? resolveGifUrl(op.imagen) : null,
      notas: note.trim() || null,
      ...(frecuenciaBloque ? { diaBase: diaActivo } : {}),
    });

    const existing = seccion?.items ?? [];
    const rest = frecuenciaBloque
      ? existing.filter((it) => (diaBaseDeItem(it) ?? 1) !== diaActivo)
      : [];

    return {
      tipoSeccion,
      titulo,
      orden: esEntrada ? -1 : 999,
      items: frecuenciaBloque ? [...rest, newItem] : [newItem],
    } satisfies PlanificationSection;
  }

  function commit(id: string, min: number, inc: number, note: string) {
    const sec = buildItem(id, min, inc, note);
    if (sec) onChange(sec);
  }

  function pick(id: string) {
    setSelId(id);
    commit(id, minutos, incremento, notas);
  }

  const draftItem = selId
    ? buildItem(selId, minutos, incremento, notas)?.items[0]
    : item;

  return (
    <section className="space-y-4">
      <header>
        <h2 className={`text-lg font-bold sm:text-xl ${CEMD.primaryClass}`}>
          {emoji} {titulo}
        </h2>
        <p className="text-sm text-zinc-500">
          Tope: {limits.topeMinutos} min por sesión
          {frecuenciaBloque
            ? ` · ${etiquetaDia(config.modoProgresion, diaActivo)}`
            : ''}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Minutos iniciales</span>
          <select
            value={minutos}
            onChange={(e) => {
              const m = Number(e.target.value);
              setMinutos(m);
              if (selId) commit(selId, m, incremento, notas);
            }}
            className={`w-full ${selectCemd} py-2`}
          >
            {OPCIONES_MINUTOS.filter((m) => m <= limits.minutosIniciales.max).map(
              (m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ),
            )}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Incremento (min)</span>
          <select
            value={incremento}
            onChange={(e) => {
              const inc = Number(e.target.value);
              setIncremento(inc);
              if (selId) commit(selId, minutos, inc, notas);
            }}
            className={`w-full ${selectCemd} py-2`}
          >
            {OPCIONES_INCREMENTO_MIN.map((m) => (
              <option key={m} value={m}>
                {m === 0 ? 'Sin incremento' : `+${m} min`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {OPCIONES_CARDIO.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => pick(op.id)}
            className={
              selId === op.id
                ? 'flex flex-col items-center rounded-lg border-2 border-primary bg-primary/10 p-4 transition'
                : 'flex flex-col items-center rounded-lg border border-zinc-300 bg-white p-4 transition hover:border-primary'
            }
          >
            <EjercicioAvatar
              gif={op.imagen}
              nombre={op.nombre}
              size="lg"
              roundedFull
            />
            <span className="mt-2 block text-center text-sm font-medium text-zinc-800">
              {op.nombre}
            </span>
            {op.descripcion ? (
              <span className="mt-0.5 block text-center text-[10px] text-zinc-500">
                {op.descripcion}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {selId ? (
        <div className="space-y-2 rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3">
          <label className="text-sm font-medium">
            Comentario para vista cliente
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            onBlur={() => commit(selId, minutos, incremento, notas)}
            placeholder={
              esEntrada
                ? 'Ej: Hacelo suave, buscá entrar en calor sin fatigarte.'
                : 'Ej: Terminá suave, respirá y bajá pulsaciones.'
            }
            className="min-h-[88px] w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            maxLength={220}
          />
        </div>
      ) : null}

      {draftItem ? (
        <>
          <p className="text-sm text-zinc-600">
            Configurado: <strong className={CEMD.primaryClass}>{draftItem.ejercicio}</strong>{' '}
            · {draftItem.parametros.minutos} min
            {draftItem.progresion?.incrementoMinutos
              ? ` (+${draftItem.progresion.incrementoMinutos} min/sesión)`
              : ''}
          </p>
          <MiniTablaProgresion item={draftItem} config={config} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Seleccioná un ejercicio aeróbico de la grilla.
        </p>
      )}
    </section>
  );
}
