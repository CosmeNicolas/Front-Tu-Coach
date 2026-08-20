'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OPCIONES_CARDIO } from '@/lib/ejercicios/catalogo-cardio';
import { resolveGifUrl } from '@/lib/ejercicios/gif-url';
import { diaBaseDeItem, ensureSingleItem, isSingleItem } from '@/lib/planification/section-items';
import { normalizeDiaBase } from '@/lib/planification/asistente-dia';
import {
  itemAfectaSesionCompletada,
} from '@/lib/planification/alumno-progress-guard';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';
import {
  Planification,
  PlanificationItemSingle,
  PlanificationProgress,
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
import { AjusteBadge } from './AjusteAntesDespues';
import { PanelAjusteEjercicio } from './PanelAjusteEjercicio';
import { Button } from '@/components/ui/button';

interface Props {
  tipoSeccion: TipoSeccion.CALENTAMIENTO | TipoSeccion.VUELTA_CALMA;
  seccion?: PlanificationSection;
  config: import('@/types/planification').PlanificationConfig;
  diaActivo: number;
  frecuenciaBloque: number | null;
  progresoAlumno?: PlanificationProgress;
  planificationId?: string;
  contentVersion?: number;
  onChange: (sec: PlanificationSection) => void;
  onAdjusted?: (planification: Planification) => void;
}

export function SelectorCardioGrid({
  tipoSeccion,
  seccion,
  config,
  diaActivo,
  frecuenciaBloque,
  progresoAlumno,
  planificationId,
  contentVersion,
  onChange,
  onAdjusted,
}: Props) {
  const [ajusteAbierto, setAjusteAbierto] = useState(false);
  const limits =
    tipoSeccion === TipoSeccion.CALENTAMIENTO
      ? PLANIFICATION_LIMITS.calentamiento
      : PLANIFICATION_LIMITS.vueltaCalma;

  const dia = normalizeDiaBase(diaActivo);
  const rawItem = frecuenciaBloque
    ? seccion?.items.find(
      (it) =>
        isSingleItem(it) && (diaBaseDeItem(it) ?? 1) === dia,
    )
    : seccion?.items[0];
  const item = rawItem && isSingleItem(rawItem) ? rawItem : undefined;
  const editBlocked = Boolean(
    item &&
    progresoAlumno &&
    itemAfectaSesionCompletada(item, progresoAlumno.completadas ?? [], config),
  );
  const canAdjust = Boolean(
    item && planificationId && contentVersion !== undefined && onAdjusted,
  );
  const [selId, setSelId] = useState(
    () => OPCIONES_CARDIO.find((o) => o.nombre === item?.ejercicio)?.id ?? '',
  );
  const [minutos, setMinutos] = useState(item?.parametros.minutos ?? 10);
  const [incremento, setIncremento] = useState(
    item?.progresion?.incrementoMinutos ?? 2,
  );
  const [notas, setNotas] = useState(item?.notas ?? '');

  useEffect(() => {
    const nextDia = normalizeDiaBase(diaActivo);
    const nextRaw = frecuenciaBloque
      ? seccion?.items.find(
        (it) =>
          isSingleItem(it) && (diaBaseDeItem(it) ?? 1) === nextDia,
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

  function buildItem(id: string, min: number, inc: number, note: string): {
    section: PlanificationSection;
    item: PlanificationItemSingle;
  } | null {
    const op = OPCIONES_CARDIO.find((o) => o.id === id);
    if (!op) return null;

    const newItem = ensureSingleItem({
      id: item?.id,
      ejercicio: op.nombre,
      tipoItem: TipoItem.AEROBICO,
      unidadTrabajo: UnidadTrabajo.MIN,
      parametros: { minutos: min },
      progresion: { incrementoMinutos: inc },
      gif: op.imagen ? resolveGifUrl(op.imagen) : null,
      notas: note.trim() || null,
      ...(frecuenciaBloque ? { diaBase: dia } : {}),
    });

    const existing = seccion?.items ?? [];
    const rest = frecuenciaBloque
      ? existing.filter((it) => (diaBaseDeItem(it) ?? 1) !== dia)
      : [];

    return {
      item: newItem,
      section: {
        tipoSeccion,
        titulo,
        orden: esEntrada ? -1 : 999,
        items: frecuenciaBloque ? [...rest, newItem] : [newItem],
      },
    };
  }

  function commit(id: string, min: number, inc: number, note: string) {
    if (editBlocked) {
      toast.error('Este día ya tiene sesiones completadas', {
        description: 'Usá ⚡ Ajuste desde sesión "X" para cambiar entrada en calor o vuelta a la calma.',
      });
      return;
    }
    const built = buildItem(id, min, inc, note);
    if (built) onChange(built.section);
  }

  function pick(id: string) {
    if (editBlocked) {
      toast.error('Este día ya tiene sesiones completadas', {
        description: 'Usá ⚡ Ajuste desde sesión "X" para elegir otro ejercicio aeróbico.',
      });
      return;
    }
    setSelId(id);
    commit(id, minutos, incremento, notas);
  }

  const draftItem: PlanificationItemSingle | undefined = selId
    ? (buildItem(selId, minutos, incremento, notas)?.item ?? item)
    : item;

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={`text-lg font-bold sm:text-xl ${CEMD.primaryClass}`}>
            {emoji} {titulo}
          </h2>
          <p className="text-sm text-muted-foreground">
            Tope: {limits.topeMinutos} min por sesión
            {frecuenciaBloque
              ? ` · ${etiquetaDia(config.modoProgresion, diaActivo)}`
              : ''}
          </p>
          {item?.ajuste ? (
            <div className="mt-2">
              <AjusteBadge item={item} />
            </div>
          ) : null}
        </div>
        {canAdjust ? (
          <Button
            type="button"
            variant={editBlocked ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAjusteAbierto(true)}
          >
            ⚡ Ajuste desde sesión "X"
          </Button>
        ) : null}
      </header>

      {editBlocked ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          El alumno ya entrenó sesiones de este día. La grilla está en solo lectura;
          usá <strong>⚡ Ajuste desde sesión "X"</strong> para cambiar el ejercicio, minutos
          o incremento desde una sesión futura sin alterar lo ya hecho.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Minutos iniciales</span>
          <select
            value={minutos}
            disabled={editBlocked}
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
            disabled={editBlocked}
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
            disabled={editBlocked}
            onClick={() => pick(op.id)}
            className={
              editBlocked
                ? 'flex flex-col items-center rounded-lg border border-input bg-muted/40 p-4 opacity-60'
                : selId === op.id
                  ? 'flex flex-col items-center rounded-lg border-2 border-primary bg-primary/10 p-4 transition'
                  : 'flex flex-col items-center rounded-lg border border-input bg-card p-4 transition hover:border-primary'
            }
          >
            <EjercicioAvatar
              gif={op.imagen}
              nombre={op.nombre}
              size="lg"
              roundedFull
            />
            <span className="mt-2 block text-center text-sm font-medium text-foreground">
              {op.nombre}
            </span>
            {op.descripcion ? (
              <span className="mt-0.5 block text-center text-[10px] text-muted-foreground">
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
            disabled={editBlocked}
            onChange={(e) => setNotas(e.target.value)}
            onBlur={() => commit(selId, minutos, incremento, notas)}
            placeholder={
              esEntrada
                ? 'Ej: Hacelo suave, buscá entrar en calor sin fatigarte.'
                : 'Ej: Terminá suave, respirá y bajá pulsaciones.'
            }
            className="min-h-[88px] w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm"
            maxLength={220}
          />
        </div>
      ) : null}

      {draftItem ? (
        <>
          <p className="text-sm text-muted-foreground">
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

      {ajusteAbierto && item && planificationId && contentVersion !== undefined && onAdjusted ? (
        <PanelAjusteEjercicio
          planificationId={planificationId}
          contentVersion={contentVersion}
          catalogTabId={tipoSeccion === TipoSeccion.CALENTAMIENTO ? 'calentamiento' : 'vuelta_calma'}
          progresoAlumno={progresoAlumno}
          item={item}
          config={config}
          cardioTipoSeccion={tipoSeccion}
          onClose={() => setAjusteAbierto(false)}
          onApplied={onAdjusted}
        />
      ) : null}
    </section>
  );
}
