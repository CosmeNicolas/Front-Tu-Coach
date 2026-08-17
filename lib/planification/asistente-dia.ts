import {
  BLOQUE_MODE_FREQUENCY,
  PlanificationSection,
  ProgressionMode,
} from '@/types/planification';
import {
  countItemsEnSeccion,
  filterItemsPorDia,
} from '@/lib/planification/section-items';

const DIA_STORAGE_PREFIX = 'tucoach-asistente-dia:';

export function frecuenciaBloqueFromModo(
  modo: ProgressionMode,
): number | null {
  return BLOQUE_MODE_FREQUENCY[modo] ?? null;
}

/** Normaliza diaBase (API puede mandar number | string). */
export function normalizeDiaBase(
  value: number | string | null | undefined,
  fallback = 1,
): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.trunc(n);
}

export function loadDiaActivo(
  planificationId: string,
  maxDias: number | null,
): number {
  if (!maxDias || maxDias < 1) return 1;
  try {
    const raw = localStorage.getItem(`${DIA_STORAGE_PREFIX}${planificationId}`);
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= maxDias) return n;
  } catch {
    /* ignore */
  }
  return 1;
}

export function saveDiaActivo(
  planificationId: string,
  dia: number,
): void {
  try {
    localStorage.setItem(
      `${DIA_STORAGE_PREFIX}${planificationId}`,
      String(dia),
    );
  } catch {
    /* ignore */
  }
}

export function clampDiaActivo(dia: number, maxDias: number | null): number {
  if (!maxDias) return 1;
  if (!Number.isFinite(dia) || dia < 1) return 1;
  if (dia > maxDias) return maxDias;
  return Math.trunc(dia);
}

/** Sesiones globales que corresponden a un día base (1-based). */
export function sesionesDeDiaBase(
  diaBase: number,
  totalSesiones: number,
  cantidadBloques: number,
): number[] {
  if (cantidadBloques < 1 || diaBase < 1 || diaBase > cantidadBloques) {
    return [];
  }
  const out: number[] = [];
  for (let n = diaBase; n <= totalSesiones; n += cantidadBloques) {
    out.push(n);
  }
  return out;
}

export function resumenDiasBloque(
  secciones: PlanificationSection[],
  frecuenciaBloque: number,
): Array<{ dia: number; ejercicios: number }> {
  return Array.from({ length: frecuenciaBloque }, (_, i) => {
    const dia = i + 1;
    const ejercicios = secciones.reduce((acc, sec) => {
      const items = filterItemsPorDia(sec.items, frecuenciaBloque, dia);
      return acc + countItemsEnSeccion(items);
    }, 0);
    return { dia, ejercicios };
  });
}
