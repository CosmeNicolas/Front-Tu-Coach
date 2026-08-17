import {
  PlanificationSection,
  PlanificationSectionItem,
  TipoSeccion,
} from '@/types/planification';
import {
  countItemsEnSeccion,
  generateItemId,
  isGroupItem,
  isSingleItem,
} from '@/lib/planification/section-items';
import { MAX_EJERCICIOS_POR_SECCION } from '@/components/planificaciones/asistente/constants';

function normName(value: string): string {
  return value.trim().toLowerCase();
}

function itemSignature(item: PlanificationSectionItem): string {
  if (isGroupItem(item)) {
    const names = item.items
      .map((s) => normName(s.ejercicio))
      .sort()
      .join('+');
    const dia = item.diaBase ?? item.items[0]?.diaBase ?? '';
    return `g:${dia}:${names}`;
  }
  const single = item;
  return `s:${single.diaBase ?? ''}:${normName(single.ejercicio)}`;
}

function cloneItemWithNewIds(
  item: PlanificationSectionItem,
): PlanificationSectionItem {
  if (isGroupItem(item)) {
    return {
      ...item,
      id: generateItemId(),
      items: item.items.map((sub) => ({
        ...sub,
        id: generateItemId(),
        kind: 'single' as const,
      })),
    };
  }
  return {
    ...item,
    id: generateItemId(),
    kind: 'single',
  };
}

export interface MergeImportResult {
  section: PlanificationSection;
  added: number;
  skippedDuplicates: number;
  skippedLimit: number;
}

/**
 * Mergea ítems importados en una sección del asistente.
 * - Calentamiento / vuelta a la calma: reemplaza si hay items.
 * - Principal: append evitando duplicados (mismo nombre + diaBase) y respetando el tope.
 */
export function mergeImportedItemsIntoSection(
  current: PlanificationSection,
  incoming: PlanificationSectionItem[],
): MergeImportResult {
  const clonedIncoming = incoming.map(cloneItemWithNewIds);

  if (clonedIncoming.length === 0) {
    return {
      section: current,
      added: 0,
      skippedDuplicates: 0,
      skippedLimit: 0,
    };
  }

  const isFija =
    current.tipoSeccion === TipoSeccion.CALENTAMIENTO ||
    current.tipoSeccion === TipoSeccion.VUELTA_CALMA;

  if (isFija) {
    return {
      section: { ...current, items: clonedIncoming },
      added: countItemsEnSeccion(clonedIncoming),
      skippedDuplicates: 0,
      skippedLimit: 0,
    };
  }

  const existingKeys = new Set(current.items.map(itemSignature));
  const nextItems = [...current.items];
  let added = 0;
  let skippedDuplicates = 0;
  let skippedLimit = 0;

  for (const item of clonedIncoming) {
    const key = itemSignature(item);
    if (existingKeys.has(key)) {
      skippedDuplicates += 1;
      continue;
    }

    const addCount = isGroupItem(item)
      ? item.items.length
      : isSingleItem(item)
        ? 1
        : 0;
    if (countItemsEnSeccion(nextItems) + addCount > MAX_EJERCICIOS_POR_SECCION) {
      skippedLimit += 1;
      continue;
    }

    nextItems.push(item);
    existingKeys.add(key);
    added += addCount;
  }

  return {
    section: { ...current, items: nextItems },
    added,
    skippedDuplicates,
    skippedLimit,
  };
}
