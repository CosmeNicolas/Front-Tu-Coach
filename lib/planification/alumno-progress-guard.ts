import {
  PlanificationItemSingle,
  PlanificationProgress,
  PlanificationSection,
} from '@/types/planification';
import { isGroupItem } from '@/lib/planification/section-items';

export function hasAlumnoSessionProgress(
  progreso?: PlanificationProgress | null,
): boolean {
  return (progreso?.completadas?.length ?? 0) > 0;
}

export function ultimaSesionCompletadaAlumno(
  progreso?: PlanificationProgress | null,
): number {
  const nums = progreso?.completadas ?? [];
  if (!nums.length) return 0;
  return Math.max(...nums);
}

/** Ajuste permitido solo después de la última sesión que el alumno ya cerró. */
export function minFromSessionTrasProgreso(
  progreso?: PlanificationProgress | null,
): number {
  const ultima = ultimaSesionCompletadaAlumno(progreso);
  return ultima > 0 ? ultima + 1 : 1;
}

export function filtrarSesionesAjusteTrasProgreso(
  sesionesValidas: number[],
  progreso?: PlanificationProgress | null,
): number[] {
  const min = minFromSessionTrasProgreso(progreso);
  return sesionesValidas.filter((n) => n >= min);
}

/**
 * Sesión mínima para aplicar un ajuste (nuevo o re-aplicado).
 * Permite avanzar el corte cuando el alumno ya completó sesiones bajo el ajuste previo.
 */
export function minFromSessionParaAjuste(
  progreso?: PlanificationProgress | null,
  ajusteDesdeSesion?: number,
): number {
  const minProgress = minFromSessionTrasProgreso(progreso);
  if (ajusteDesdeSesion === undefined) return minProgress;

  const ultima = ultimaSesionCompletadaAlumno(progreso);
  if (ultima >= ajusteDesdeSesion) {
    return Math.max(minProgress, ultima + 1);
  }
  return Math.max(minProgress, ajusteDesdeSesion);
}

export function filtrarSesionesAjuste(
  sesionesValidas: number[],
  progreso?: PlanificationProgress | null,
  ajusteDesdeSesion?: number,
): number[] {
  const min = minFromSessionParaAjuste(progreso, ajusteDesdeSesion);
  return sesionesValidas.filter((n) => n >= min);
}

export function canInlineEditPlanItem(
  progreso?: PlanificationProgress | null,
): boolean {
  return !hasAlumnoSessionProgress(progreso);
}

export function canRemovePlanItem(
  progreso?: PlanificationProgress | null,
): boolean {
  return !hasAlumnoSessionProgress(progreso);
}

function walkSingles(
  secciones: PlanificationSection[],
  fn: (item: PlanificationItemSingle) => void,
) {
  for (const sec of secciones) {
    for (const entry of sec.items) {
      if (isGroupItem(entry)) {
        entry.items.forEach(fn);
      } else {
        fn(entry);
      }
    }
  }
}

function trainingFingerprint(item: PlanificationItemSingle): string {
  return JSON.stringify({
    ejercicio: item.ejercicio,
    tipoItem: item.tipoItem,
    unidadTrabajo: item.unidadTrabajo,
    parametros: item.parametros,
    progresion: item.progresion,
    gif: item.gif ?? null,
    notas: item.notas ?? null,
    diaBase: item.diaBase ?? null,
  });
}

/** Map itemId → fingerprint de entrenamiento (sin metadata de ajuste). */
export function mapItemTrainingFingerprints(
  secciones: PlanificationSection[],
): Map<string, string> {
  const map = new Map<string, string>();
  walkSingles(secciones, (item) => {
    map.set(item.id, trainingFingerprint(item));
  });
  return map;
}

export function collectRemovedItemIds(
  before: PlanificationSection[],
  after: PlanificationSection[],
): string[] {
  const beforeIds = new Set<string>();
  const afterIds = new Set<string>();
  walkSingles(before, (item) => beforeIds.add(item.id));
  walkSingles(after, (item) => afterIds.add(item.id));
  return [...beforeIds].filter((id) => !afterIds.has(id));
}

export function findRetroactiveItemChanges(
  before: PlanificationSection[],
  after: PlanificationSection[],
): string[] {
  const beforeMap = mapItemTrainingFingerprints(before);
  const afterMap = mapItemTrainingFingerprints(after);
  const changed: string[] = [];
  for (const [id, fp] of beforeMap) {
    if (!afterMap.has(id)) continue;
    if (afterMap.get(id) !== fp) changed.push(id);
  }
  return changed;
}
