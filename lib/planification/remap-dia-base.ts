import {
  BLOQUE_MODE_FREQUENCY,
  PlanificationItemGroup,
  PlanificationItemSingle,
  PlanificationSection,
  PlanificationSectionItem,
  ProgressionMode,
} from '@/types/planification';
import { isGroupItem, isSingleItem } from '@/lib/planification/section-items';

function parseDiaBase(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return undefined;
  return Math.trunc(n);
}

function clampDiaBase(diaBase: unknown, max: number | undefined): number | undefined {
  const parsed = parseDiaBase(diaBase);
  if (parsed == null || max == null) return parsed;
  if (parsed > max) return max;
  return parsed;
}

function remapSingle(
  item: PlanificationItemSingle,
  modo: ProgressionMode,
): PlanificationItemSingle {
  const max = BLOQUE_MODE_FREQUENCY[modo];
  if (max == null) {
    const { diaBase: _d, ...rest } = item;
    return rest as PlanificationItemSingle;
  }
  return {
    ...item,
    diaBase: clampDiaBase(item.diaBase, max) ?? 1,
  };
}

function remapItem(
  item: PlanificationSectionItem,
  modo: ProgressionMode,
): PlanificationSectionItem {
  const max = BLOQUE_MODE_FREQUENCY[modo];
  if (isGroupItem(item)) {
    const items = item.items.map((sub) => remapSingle(sub, modo));
    if (max == null) {
      const { diaBase: _d, ...rest } = item;
      return { ...rest, items } as PlanificationItemGroup;
    }
    const diaBase =
      clampDiaBase(item.diaBase ?? items[0]?.diaBase, max) ?? 1;
    return {
      ...item,
      diaBase,
      items: items.map((sub) => ({ ...sub, diaBase })),
    };
  }
  if (isSingleItem(item)) {
    return remapSingle(item, modo);
  }
  return item;
}

/** Reasigna días al cambiar o importar entre lineal / Bloque x2–x5. */
export function remapSeccionesDiaBaseForMode(
  secciones: PlanificationSection[],
  modo: ProgressionMode,
): PlanificationSection[] {
  return secciones.map((sec) => ({
    ...sec,
    items: (sec.items ?? []).map((item) => remapItem(item, modo)),
  }));
}

export function remapItemsDiaBaseForMode(
  items: PlanificationSectionItem[],
  modo: ProgressionMode,
): PlanificationSectionItem[] {
  return items.map((item) => remapItem(item, modo));
}
