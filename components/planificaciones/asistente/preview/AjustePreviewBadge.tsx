'use client';

import { MaterializedItem } from '@/types/planification';

interface Props {
  item: MaterializedItem;
  sessionNum: number;
}

export function AjustePreviewBadge({ item, sessionNum }: Props) {
  const desde = item.ajusteDesdeSesion;
  if (!desde || desde <= 1) return null;

  if (item.esPreAjuste) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
        Antes del ajuste · sesiones 1–{desde - 1}
      </span>
    );
  }

  if (sessionNum >= desde) {
    const cambioNombre =
      item.ejercicioAnterior &&
      item.ejercicioAnterior.trim() !== item.ejercicio.trim();
    return (
      <span
        className={`inline-flex flex-wrap items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground`}
      >
        <span>Desde sesión {desde}</span>
        {sessionNum === desde ? (
          <span className="rounded bg-accent px-1">inicio del cambio</span>
        ) : null}
        {cambioNombre ? (
          <span className="font-normal">
            · {item.ejercicioAnterior} → {item.ejercicio}
          </span>
        ) : null}
      </span>
    );
  }

  return null;
}

export function AjustePreviewHint({ item }: { item: MaterializedItem }) {
  if (!item.esPreAjuste || !item.ajusteDesdeSesion) return null;
  return (
    <p className="mt-1 text-[10px] text-muted-foreground">
      El alumno verá{' '}
      <span className="font-medium text-foreground">{item.ejercicio}</span> hasta
      la sesión {item.ajusteDesdeSesion - 1}.
    </p>
  );
}
