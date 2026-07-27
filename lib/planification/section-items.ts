import {
  PlanificationItemGroup,
  PlanificationItemSingle,
  PlanificationSection,
  PlanificationSectionItem,
  TipoGrupo,
} from '@/types/planification';

export function generateItemId(): string {
  return crypto.randomUUID();
}

export function isSingleItem(
  item: PlanificationSectionItem,
): item is PlanificationItemSingle {
  return item.kind !== 'group';
}

export function isGroupItem(
  item: PlanificationSectionItem,
): item is PlanificationItemGroup {
  return item.kind === 'group';
}

export function diaBaseDeItem(item: PlanificationSectionItem): number | undefined {
  if (isGroupItem(item)) {
    return item.diaBase ?? item.items[0]?.diaBase;
  }
  return item.diaBase;
}

export function ensureSingleItem(
  partial: Omit<PlanificationItemSingle, 'id' | 'kind'> & { id?: string },
): PlanificationItemSingle {
  return {
    id: partial.id ?? generateItemId(),
    kind: 'single',
    ...partial,
  };
}

export function combinarItems(
  items: PlanificationSectionItem[],
  selectedIds: string[],
): PlanificationSectionItem[] {
  if (selectedIds.length !== 2 && selectedIds.length !== 3) {
    throw new Error('Seleccioná 2 o 3 ejercicios para combinar');
  }

  const indices: number[] = [];
  const singles: PlanificationItemSingle[] = [];

  for (const id of selectedIds) {
    const idx = items.findIndex(
      (it) => isSingleItem(it) && it.id === id,
    );
    if (idx === -1) throw new Error('Solo podés combinar ejercicios sueltos');
    const item = items[idx];
    if (!isSingleItem(item)) throw new Error('Ítem inválido');
    indices.push(idx);
    singles.push(item);
  }

  const dias = new Set(singles.map((s) => s.diaBase ?? 1));
  if (dias.size > 1) {
    throw new Error('Los ejercicios deben ser del mismo día base');
  }

  const firstIdx = Math.min(...indices);
  const tipoGrupo: TipoGrupo = selectedIds.length === 2 ? 'biserie' : 'triserie';
  const grupo: PlanificationItemGroup = {
    id: generateItemId(),
    kind: 'group',
    tipoGrupo,
    diaBase: singles[0]?.diaBase,
    items: singles,
  };

  const sinSeleccionados = items.filter(
    (it) => !(isSingleItem(it) && selectedIds.includes(it.id)),
  );
  const insertAt = indices.filter((i) => i < firstIdx).length;
  const next = [...sinSeleccionados];
  next.splice(insertAt, 0, grupo);
  return next;
}

export function desagruparItem(
  items: PlanificationSectionItem[],
  groupId: string,
): PlanificationSectionItem[] {
  const idx = items.findIndex((it) => isGroupItem(it) && it.id === groupId);
  if (idx === -1) return items;
  const grupo = items[idx];
  if (!isGroupItem(grupo)) return items;
  return [
    ...items.slice(0, idx),
    ...grupo.items,
    ...items.slice(idx + 1),
  ];
}

export function quitarDeGrupo(
  items: PlanificationSectionItem[],
  groupId: string,
  subItemId: string,
): PlanificationSectionItem[] {
  const idx = items.findIndex((it) => isGroupItem(it) && it.id === groupId);
  if (idx === -1) return items;
  const grupo = items[idx];
  if (!isGroupItem(grupo)) return items;

  const restantes = grupo.items.filter((sub) => sub.id !== subItemId);
  if (restantes.length === 0) {
    return items.filter((_, i) => i !== idx);
  }
  if (restantes.length === 1) {
    return [
      ...items.slice(0, idx),
      restantes[0],
      ...items.slice(idx + 1),
    ];
  }

  const tipoGrupo: TipoGrupo = restantes.length === 2 ? 'biserie' : 'triserie';
  const actualizado: PlanificationItemGroup = {
    ...grupo,
    tipoGrupo,
    items: restantes,
  };
  return items.map((it, i) => (i === idx ? actualizado : it));
}

export function filterItemsPorDia(
  items: PlanificationSectionItem[],
  frecuenciaBloque: number | null,
  diaActivo: number,
): PlanificationSectionItem[] {
  if (!frecuenciaBloque) return items;
  return items.filter((it) => (diaBaseDeItem(it) ?? 1) === diaActivo);
}

export function hydrateSectionItem(item: PlanificationSectionItem): PlanificationSectionItem {
  if (item.kind === 'group') {
    return {
      ...item,
      id: item.id ?? generateItemId(),
      items: item.items.map((sub) =>
        ensureSingleItem({ ...sub, id: sub.id }),
      ),
    };
  }
  return ensureSingleItem({ ...item, id: item.id });
}

export function hydrateSections(secciones: PlanificationSection[]): PlanificationSection[] {
  return secciones.map((sec) => ({
    ...sec,
    items: sec.items.map((it) =>
      hydrateSectionItem(it as PlanificationSectionItem),
    ),
  }));
}

export function countItemsEnSeccion(items: PlanificationSectionItem[]): number {
  return items.reduce((acc, it) => {
    if (isGroupItem(it)) return acc + it.items.length;
    return acc + 1;
  }, 0);
}

/** Reordena solo los ítems visibles (p. ej. filtrados por día) preservando el resto. */
export function reorderVisibleItems(
  items: PlanificationSectionItem[],
  orderedVisibleIds: string[],
): PlanificationSectionItem[] {
  const orderedSet = new Set(orderedVisibleIds);
  const byId = new Map<string, PlanificationSectionItem>();
  for (const item of items) {
    if (orderedSet.has(item.id)) byId.set(item.id, item);
  }
  if (byId.size !== orderedVisibleIds.length) return items;

  const reorderedVisible = orderedVisibleIds.map((id) => byId.get(id)!);
  let cursor = 0;
  return items.map((item) => {
    if (!orderedSet.has(item.id)) return item;
    const next = reorderedVisible[cursor++];
    return next ?? item;
  });
}

export function reorderGroupSubitem(
  items: PlanificationSectionItem[],
  groupId: string,
  subId: string,
  direction: 'up' | 'down',
): PlanificationSectionItem[] {
  const idx = items.findIndex((it) => isGroupItem(it) && it.id === groupId);
  if (idx === -1) return items;
  const grupo = items[idx];
  if (!isGroupItem(grupo)) return items;

  const subIdx = grupo.items.findIndex((s) => s.id === subId);
  if (subIdx === -1) return items;

  const newIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
  if (newIdx < 0 || newIdx >= grupo.items.length) return items;

  const nuevosSubs = [...grupo.items];
  [nuevosSubs[subIdx], nuevosSubs[newIdx]] = [nuevosSubs[newIdx], nuevosSubs[subIdx]];

  return items.map((it, i) => (i === idx ? { ...grupo, items: nuevosSubs } : it));
}
