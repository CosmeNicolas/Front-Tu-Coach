import {
  EjercicioCatalogo,
  esIsometrico,
  filtrarCatalogo,
  nombreVisible,
} from '@/lib/ejercicios/catalogo';
import {
  grupoIdDesdeNorm,
  normGrupo,
} from '@/lib/ejercicios/grupos-musculares';
import {
  PlanificationItemSingle,
  PlanificationSectionItem,
  TipoItem,
} from '@/types/planification';
import { isGroupItem, isSingleItem } from '@/lib/planification/section-items';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

export function collectExerciseNames(
  items: PlanificationSectionItem[],
): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (isGroupItem(item)) {
      for (const sub of item.items) out.push(sub.ejercicio);
    } else if (isSingleItem(item)) {
      out.push(item.ejercicio);
    }
  }
  return out;
}

function findCatalogMatch(
  ejercicioNombre: string,
  pool: EjercicioCatalogo[],
): EjercicioCatalogo | null {
  const key = norm(ejercicioNombre);
  if (!key) return null;
  return (
    pool.find((e) => norm(nombreVisible(e)) === key) ??
    pool.find((e) => norm(nombreVisible(e)).includes(key)) ??
    pool.find((e) => key.includes(norm(nombreVisible(e)))) ??
    null
  );
}

/**
 * Sugiere alternativas del mismo grupo muscular (o del tab).
 * Prioriza ejercicios que no estén en `excludeNames` (ya en sección / plan anterior).
 */
export function sugerirAlternativasEjercicio(input: {
  ejercicioNombre: string;
  tabId: string;
  /** Catálogo ya mergeado (global + privados) del tab. */
  catalogo: EjercicioCatalogo[];
  excludeNames?: string[];
  limit?: number;
}): EjercicioCatalogo[] {
  const limit = input.limit ?? 5;
  const exclude = new Set(
    (input.excludeNames ?? []).map(norm).filter(Boolean),
  );
  exclude.add(norm(input.ejercicioNombre));

  const pool =
    input.catalogo.length > 0
      ? input.catalogo
      : filtrarCatalogo({ tabId: input.tabId, limit: 80 });

  const match = findCatalogMatch(input.ejercicioNombre, pool);
  const grupoId = match
    ? grupoIdDesdeNorm(normGrupo(match.grupo ?? ''))
    : undefined;

  let candidates = grupoId
    ? pool.filter((e) => {
        const id = grupoIdDesdeNorm(normGrupo(e.grupo ?? ''));
        return id === grupoId;
      })
    : [...pool];

  const wantIso = esIsometrico(input.ejercicioNombre);
  candidates = candidates.filter((e) => {
    const name = nombreVisible(e);
    if (exclude.has(norm(name))) return false;
    return esIsometrico(name) === wantIso;
  });

  // Preferir nombres que no estaban en el plan anterior (exclude ya los saca),
  // y dar un poco de variedad estable por hash del nombre original.
  const seed = norm(input.ejercicioNombre);
  candidates.sort((a, b) => {
    const na = norm(nombreVisible(a));
    const nb = norm(nombreVisible(b));
    const score = (n: string) =>
      (n.length + seed.length) % 7 - Math.abs(n.charCodeAt(0) - (seed.charCodeAt(0) || 0));
    return score(na) - score(nb) || na.localeCompare(nb);
  });

  return candidates.slice(0, limit);
}

/**
 * Reemplaza nombre/GIF del ítem conservando carga (series/reps/peso) y progresión.
 * Si el sugerido es isométrico y el ítem era fuerza (o viceversa), mantiene params
 * del original para no romper la planilla; el profe puede retocar después.
 */
export function aplicarSugerenciaConservandoCarga(
  item: PlanificationItemSingle,
  sugerido: EjercicioCatalogo,
): PlanificationItemSingle {
  const nombre = nombreVisible(sugerido);
  const iso = esIsometrico(nombre);

  return {
    ...item,
    ejercicio: nombre,
    gif: sugerido.gif ?? null,
    tipoItem: iso ? TipoItem.ISOMETRICO : item.tipoItem,
    // Conservamos params/progresión/diaBase/unidad del import (última carga).
  };
}

export function buildTabCatalog(
  tabId: string,
  privados: EjercicioCatalogo[] = [],
  limit = 80,
): EjercicioCatalogo[] {
  const globales = filtrarCatalogo({ tabId, limit });
  const seen = new Set(globales.map((e) => norm(nombreVisible(e))));
  const extra = privados.filter((e) => {
    const key = norm(nombreVisible(e));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...extra, ...globales].slice(0, limit);
}
