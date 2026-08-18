import {
  CATALOGO_CATEGORIAS,
  CATALOGO_DEPORTES,
  CATALOGO_GRUPOS,
  findCatalogoCategoriaById,
  normGrupo,
  TAB_GRUPO_IDS,
} from '@/lib/ejercicios/grupos-musculares';
import antebrazo from './data/ejerciciosAntebrazo.json';
import biceps from './data/ejerciciosBiceps.json';
import cardio from './data/ejerciciosCardio.json';
import core from './data/ejerciciosCore.json';
import cuello from './data/ejerciciosCuello.json';
import espalda from './data/ejerciciosEspalda.json';
import extensores from './data/ejerciciosExtensoresEspinales.json';
import fullbody from './data/ejerciciosFullbody.json';
import gemelos from './data/ejerciciosGemelos.json';
import gluteo from './data/ejercicioGluteoCuadriceps.json';
import hombros from './data/ejerciciosHombros.json';
import pecho from './data/ejerciciosPecho.json';
import piernas from './data/ejercicioPiernas.json';
import trapecio from './data/ejerciciosTrapecio.json';
import triceps from './data/ejercicioTriceps.json';

export interface EjercicioCatalogo {
  grupo: string;
  nombre: string;
  nombre_español: string;
  gif: string;
  series: string;
  descripcion: string;
  /** Origen del ítem en catálogo fusionado */
  source?: 'global' | 'private';
  privateId?: string;
  esGlobal?: boolean;
  mediaType?: 'gif' | 'mp4' | 'webm' | 'image' | 'youtube';
}

const TODOS: EjercicioCatalogo[] = [
  ...(antebrazo as EjercicioCatalogo[]),
  ...(biceps as EjercicioCatalogo[]),
  ...(cardio as EjercicioCatalogo[]),
  ...(core as EjercicioCatalogo[]),
  ...(cuello as EjercicioCatalogo[]),
  ...(espalda as EjercicioCatalogo[]),
  ...(extensores as EjercicioCatalogo[]),
  ...(fullbody as EjercicioCatalogo[]),
  ...(gemelos as EjercicioCatalogo[]),
  ...(gluteo as EjercicioCatalogo[]),
  ...(hombros as EjercicioCatalogo[]),
  ...(pecho as EjercicioCatalogo[]),
  ...(piernas as EjercicioCatalogo[]),
  ...(trapecio as EjercicioCatalogo[]),
  ...(triceps as EjercicioCatalogo[]),
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export function catalogoKey(e: EjercicioCatalogo): string {
  return `${norm(nombreVisible(e))}::${normGrupo(e.grupo ?? '')}::${e.gif}`;
}

export function buscarEjercicios(query: string, limit = 60): EjercicioCatalogo[] {
  const q = norm(query.trim());
  if (!q) return [];
  return TODOS.filter((e) => {
    const nombre = e.nombre_español ?? e.nombre ?? '';
    return (
      norm(nombre).includes(q) ||
      norm(e.descripcion ?? '').includes(q) ||
      norm(e.grupo ?? '').includes(q) ||
      norm(e.nombre ?? '').includes(q)
    );
  }).slice(0, limit);
}

export function esIsometrico(nombre: string): boolean {
  const n = norm(nombre);
  return (
    n.includes('isom') ||
    n.includes('plancha') ||
    n.includes('wall sit') ||
    n.includes('dead hang') ||
    n.includes('puente gluteo') ||
    n.includes('lateral hold')
  );
}

export function nombreVisible(e: EjercicioCatalogo): string {
  return e.nombre_español || e.nombre;
}

export function ejerciciosPorGrupoId(
  grupoId: string,
  limit = 48,
): EjercicioCatalogo[] {
  const def = findCatalogoCategoriaById(grupoId);
  if (!def) return [];
  return TODOS.filter((e) => normGrupo(e.grupo ?? '') === def.norm).slice(
    0,
    limit,
  );
}

export function ejerciciosPorTab(tabId: string, limit = 48): EjercicioCatalogo[] {
  const grupoIds = TAB_GRUPO_IDS[tabId];
  if (!grupoIds?.length) return TODOS.slice(0, limit);
  const norms = new Set(
    grupoIds
      .map((id) => findCatalogoCategoriaById(id)?.norm)
      .filter(Boolean),
  );
  return TODOS.filter((e) => norms.has(normGrupo(e.grupo ?? ''))).slice(
    0,
    limit,
  );
}

export interface FiltrarCatalogoInput {
  tabId: string;
  query?: string;
  grupoId?: string | null;
  limit?: number;
}

export function filtrarCatalogo({
  tabId,
  query = '',
  grupoId = null,
  limit = 48,
}: FiltrarCatalogoInput): EjercicioCatalogo[] {
  const q = query.trim();
  if (q) {
    const found = buscarEjercicios(q, limit);
    if (grupoId) {
      const def = findCatalogoCategoriaById(grupoId);
      if (def) {
        return found.filter((e) => normGrupo(e.grupo ?? '') === def.norm);
      }
    }
    return found;
  }

  if (grupoId) return ejerciciosPorGrupoId(grupoId, limit);
  return ejerciciosPorTab(tabId, limit);
}

/** Total de ejercicios del catálogo base (JSON incluido en la app). */
export function catalogoBaseTotal(): number {
  return TODOS.length;
}

export interface ListarCatalogoBaseInput {
  search?: string;
  categoriaNorm?: string;
  limit?: number;
}

/** Lista ejercicios del catálogo base para exploración (super admin, solo lectura). */
export function listarCatalogoBase({
  search = '',
  categoriaNorm,
  limit = 72,
}: ListarCatalogoBaseInput = {}): EjercicioCatalogo[] {
  let list = TODOS;

  if (categoriaNorm?.trim()) {
    const catNorm = normGrupo(categoriaNorm.trim());
    list = list.filter((e) => normGrupo(e.grupo ?? '') === catNorm);
  }

  const q = search.trim();
  if (q) {
    list = list.filter((e) => {
      const nombre = nombreVisible(e);
      return (
        norm(nombre).includes(norm(q)) ||
        norm(e.descripcion ?? '').includes(norm(q)) ||
        norm(e.grupo ?? '').includes(norm(q)) ||
        norm(e.nombre ?? '').includes(norm(q))
      );
    });
  }

  return list.slice(0, limit).map((e) => ({
    ...e,
    source: 'global' as const,
  }));
}

export { CATALOGO_GRUPOS, CATALOGO_DEPORTES, CATALOGO_CATEGORIAS, TAB_GRUPO_IDS };

export { PLACEHOLDER_EJERCICIO } from '@/lib/ejercicios/gif-url';
