import {
  BLOQUE_MODE_FREQUENCY,
  ProgressionMode,
} from '@/types/planification';

export function cantidadDeBloques(modo: ProgressionMode): number | null {
  return BLOQUE_MODE_FREQUENCY[modo] ?? null;
}

export function bloqueDelDia(nroSesion: number, cantidadBloques: number): number {
  return ((nroSesion - 1) % cantidadBloques) + 1;
}

export function semanaDelPlan(
  nroSesion: number,
  frecuenciaSemanal: number,
): number {
  const freq = Math.max(1, frecuenciaSemanal);
  return Math.floor((nroSesion - 1) / freq) + 1;
}

export function dayIndexInWeek(
  nroSesion: number,
  frecuenciaSemanal: number,
): number {
  const freq = Math.max(1, frecuenciaSemanal);
  return ((nroSesion - 1) % freq) + 1;
}

export function cicloProgresionBloque(
  nroSesion: number,
  cantidadBloques: number,
): number {
  return Math.floor((nroSesion - 1) / cantidadBloques);
}
