'use client';

import { useCallback, useState } from 'react';
import {
  PlanificationSectionItem,
  PlanificationItemSingle,
} from '@/types/planification';
import {
  combinarItems,
  desagruparItem,
  isSingleItem,
  quitarDeGrupo,
} from '@/lib/planification/section-items';

export function useCombinacionEjercicios(
  items: PlanificationSectionItem[],
  onChange: (items: PlanificationSectionItem[]) => void,
) {
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const toggleSeleccion = useCallback((id: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  }, []);

  const cancelarSeleccion = useCallback(() => {
    setModoSeleccion(false);
    setSeleccionados(new Set());
  }, []);

  const combinar = useCallback(() => {
    const ids = Array.from(seleccionados);
    try {
      onChange(combinarItems(items, ids));
      cancelarSeleccion();
      return true;
    } catch {
      return false;
    }
  }, [items, onChange, seleccionados, cancelarSeleccion]);

  const desagrupar = useCallback(
    (groupId: string) => {
      onChange(desagruparItem(items, groupId));
    },
    [items, onChange],
  );

  const quitarSubitem = useCallback(
    (groupId: string, subId: string) => {
      onChange(quitarDeGrupo(items, groupId, subId));
    },
    [items, onChange],
  );

  const singlesSeleccionables = items.filter(isSingleItem) as PlanificationItemSingle[];

  return {
    modoSeleccion,
    setModoSeleccion,
    seleccionados,
    toggleSeleccion,
    cancelarSeleccion,
    combinar,
    desagrupar,
    quitarSubitem,
    singlesSeleccionables,
    puedeCombinar: seleccionados.size === 2 || seleccionados.size === 3,
  };
}
