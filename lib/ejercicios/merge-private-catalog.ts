import {
  EjercicioCatalogo,
  nombreVisible,
} from '@/lib/ejercicios/catalogo';
import { CATALOGO_GRUPOS, normGrupo, TAB_GRUPO_IDS } from '@/lib/ejercicios/grupos-musculares';
import { WizardPrivateExerciseItem } from '@/types/private-exercise';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export function privateWizardToCatalogo(
  item: WizardPrivateExerciseItem,
): EjercicioCatalogo {
  return {
    grupo: item.grupo,
    nombre: item.nombre,
    nombre_español: item.nombre_español || item.nombre,
    gif: item.gif,
    series: item.series ?? '',
    descripcion: item.descripcion ?? '',
    source: 'private',
    privateId: item.privateId,
    mediaType: item.mediaType,
  };
}

export function filtrarPrivadosParaWizard(
  items: WizardPrivateExerciseItem[],
  input: { tabId: string; query?: string; grupoId?: string | null; limit?: number },
): EjercicioCatalogo[] {
  const q = norm((input.query ?? '').trim());
  const limit = input.limit ?? 48;

  let filtered = items.map(privateWizardToCatalogo);

  if (q) {
    filtered = filtered.filter((e) => {
      const nombre = nombreVisible(e);
      return (
        norm(nombre).includes(q) ||
        norm(e.descripcion ?? '').includes(q) ||
        norm(e.grupo ?? '').includes(q)
      );
    });
  } else if (input.grupoId) {
    const def = CATALOGO_GRUPOS.find((g) => g.id === input.grupoId);
    if (def) {
      filtered = filtered.filter(
        (e) => normGrupo(e.grupo ?? '') === def.norm,
      );
    }
  } else {
    const grupoIds = TAB_GRUPO_IDS[input.tabId];
    if (grupoIds?.length) {
      const norms = new Set(
        grupoIds
          .map((id) => CATALOGO_GRUPOS.find((g) => g.id === id)?.norm)
          .filter(Boolean),
      );
      filtered = filtered.filter((e) => norms.has(normGrupo(e.grupo ?? '')));
    }
  }

  return filtered.slice(0, limit);
}

export function mergeCatalogoConPrivados(
  estaticos: EjercicioCatalogo[],
  privados: EjercicioCatalogo[],
): EjercicioCatalogo[] {
  const privateKeys = new Set(privados.map(catalogoMergeKey));
  const rest = estaticos.filter((e) => !privateKeys.has(catalogoMergeKey(e)));
  return [...privados, ...rest];
}

function catalogoMergeKey(e: EjercicioCatalogo): string {
  return `${norm(nombreVisible(e))}::${normGrupo(e.grupo ?? '')}`;
}
