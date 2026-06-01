/** Grupos musculares del catálogo local (fuente única — no duplicar en tabs). */
export interface GrupoCatalogoDef {
  id: string;
  label: string;
  /** Valor normalizado que aparece en JSON (`grupo`). */
  norm: string;
}

export const CATALOGO_GRUPOS: GrupoCatalogoDef[] = [
  { id: 'pecho', label: 'Pecho', norm: 'pecho' },
  { id: 'espalda', label: 'Espalda', norm: 'espalda' },
  { id: 'hombros', label: 'Hombros', norm: 'hombros' },
  { id: 'biceps', label: 'Bíceps', norm: 'biceps' },
  { id: 'triceps', label: 'Tríceps', norm: 'triceps' },
  { id: 'antebrazo', label: 'Antebrazo', norm: 'antebrazo' },
  { id: 'core', label: 'Core / Abdominales', norm: 'core' },
  { id: 'extensoresespinales', label: 'Lumbares / Extensores', norm: 'extensoresespinales' },
  { id: 'piernas', label: 'Piernas', norm: 'piernas' },
  { id: 'gluteocuadriceps', label: 'Glúteo / Cuádriceps', norm: 'gluteocuadriceps' },
  { id: 'gemelos', label: 'Gemelos / Pantorrillas', norm: 'gemelos' },
  { id: 'trapecio', label: 'Trapecio', norm: 'trapecio' },
  { id: 'fullbody', label: 'Full body / Adaptados', norm: 'fullbody' },
  { id: 'cuello', label: 'Cuello', norm: 'cuello' },
  { id: 'cardio', label: 'Cardio', norm: 'cardio' },
];

/** Tabs del wizard → grupos sugeridos (ids de CATALOGO_GRUPOS). */
export const TAB_GRUPO_IDS: Record<string, string[]> = {
  abdominales: ['core'],
  lumbares: ['extensoresespinales', 'core'],
  piernas: ['piernas', 'gluteocuadriceps'],
  pecho: ['pecho'],
  espalda: ['espalda', 'trapecio'],
  pantorrillas: ['gemelos'],
  biceps: ['biceps', 'antebrazo'],
  hombros: ['hombros'],
  triceps: ['triceps'],
  adaptados: ['fullbody', 'cuello'],
};

export function gruposParaTab(tabId: string): GrupoCatalogoDef[] {
  const ids = TAB_GRUPO_IDS[tabId];
  if (!ids) return CATALOGO_GRUPOS;
  const set = new Set(ids);
  return CATALOGO_GRUPOS.filter((g) => set.has(g.id));
}

export function normGrupo(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '');
}

export function grupoIdDesdeNorm(norm: string): string | undefined {
  return CATALOGO_GRUPOS.find((g) => g.norm === norm)?.id;
}
