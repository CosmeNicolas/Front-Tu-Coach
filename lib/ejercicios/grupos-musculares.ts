/** Grupos musculares del catálogo local (fuente única — no duplicar en tabs). */
export interface GrupoCatalogoDef {
  id: string;
  label: string;
  /** Valor normalizado que aparece en JSON (`grupo`) y en BD privada (`categoria`). */
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

/** Deportes iniciales — ampliar en futuras iteraciones. */
export const CATALOGO_DEPORTES: GrupoCatalogoDef[] = [
  { id: 'futbol', label: 'Fútbol', norm: 'futbol' },
  { id: 'running', label: 'Running', norm: 'running' },
  { id: 'musculacion', label: 'Musculación', norm: 'musculacion' },
  { id: 'ciclismo', label: 'Ciclismo', norm: 'ciclismo' },
  { id: 'rugby', label: 'Rugby', norm: 'rugby' },
  { id: 'hockey', label: 'Hockey', norm: 'hockey' },
  { id: 'padel', label: 'Pádel', norm: 'padel' },
  { id: 'tenis', label: 'Tenis', norm: 'tenis' },
  { id: 'basquet', label: 'Básquet', norm: 'basquet' },
  { id: 'voley', label: 'Vóley', norm: 'voley' },
  { id: 'natacion', label: 'Natación', norm: 'natacion' },
  { id: 'handball', label: 'Handball', norm: 'handball' },
  { id: 'boxeo', label: 'Boxeo', norm: 'boxeo' },
  { id: 'artesmarciales', label: 'Artes marciales', norm: 'artesmarciales' },
  { id: 'atletismo', label: 'Atletismo', norm: 'atletismo' },
  { id: 'trailrunning', label: 'Trail Running', norm: 'trailrunning' },
  {
    id: 'crosstraining',
    label: 'Cross Training / CrossFit',
    norm: 'crosstraining',
  },
  { id: 'gimnasia', label: 'Gimnasia', norm: 'gimnasia' },
  { id: 'remo', label: 'Remo', norm: 'remo' },
  { id: 'triatlon', label: 'Triatlón', norm: 'triatlon' },
  { id: 'tiroconarco', label: 'Tiro con arco', norm: 'tiroconarco' },
];

export const CATALOGO_CATEGORIAS: GrupoCatalogoDef[] = [
  ...CATALOGO_GRUPOS,
  ...CATALOGO_DEPORTES,
];

/** Tabs del wizard → grupos sugeridos (ids de categoría). */
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
  deportes: CATALOGO_DEPORTES.map((d) => d.id),
};

export function normGrupo(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '');
}

export function findCatalogoCategoriaById(
  id: string,
): GrupoCatalogoDef | undefined {
  return CATALOGO_CATEGORIAS.find((g) => g.id === id);
}

export function findCatalogoCategoriaByNorm(
  norm: string,
): GrupoCatalogoDef | undefined {
  const n = normGrupo(norm);
  return CATALOGO_CATEGORIAS.find((g) => g.norm === n);
}

export function esCategoriaDeporte(categoria: string): boolean {
  const n = normGrupo(categoria);
  return CATALOGO_DEPORTES.some((d) => d.norm === n);
}

export function gruposParaTab(tabId: string): GrupoCatalogoDef[] {
  const ids = TAB_GRUPO_IDS[tabId];
  if (!ids) return CATALOGO_CATEGORIAS;
  const set = new Set(ids);
  return CATALOGO_CATEGORIAS.filter((g) => set.has(g.id));
}

export function grupoIdDesdeNorm(norm: string): string | undefined {
  return findCatalogoCategoriaByNorm(norm)?.id;
}
