'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  Planification,
  PlanificationSection,
  PlanificationSectionItem,
  TipoSeccion,
} from '@/types/planification';
import { useUpsertSecciones } from '@/hooks/usePlanifications';
import {
  countItemsEnSeccion,
  filterItemsPorDia,
  hydrateSections,
} from '@/lib/planification/section-items';
import { TAB_PREVIEW_ID, WIZARD_TABS } from './constants';

function defaultSection(tab: (typeof WIZARD_TABS)[number], orden: number): PlanificationSection {
  return {
    tipoSeccion: tab.tipoSeccion,
    titulo: tab.titulo,
    orden,
    items: [],
  };
}

function mergeWithDefaults(existing: PlanificationSection[]): PlanificationSection[] {
  const hydrated = hydrateSections(existing);
  return WIZARD_TABS.map((tab, idx) => {
    const found = hydrated.find(
      (s) =>
        s.tipoSeccion === tab.tipoSeccion &&
        s.titulo.toLowerCase() === tab.titulo.toLowerCase(),
    );
    return found ?? defaultSection(tab, idx);
  });
}

export function useAsistenteState(planification: Planification) {
  const [tabActivo, setTabActivo] = useState(WIZARD_TABS[0].id);
  const [diaActivo, setDiaActivo] = useState(1);
  const [secciones, setSecciones] = useState<PlanificationSection[]>(() =>
    mergeWithDefaults(planification.secciones),
  );
  const [contentVersion, setContentVersion] = useState(
    planification.contentVersion ?? 1,
  );
  const [dirty, setDirty] = useState(false);
  const upsert = useUpsertSecciones(planification.id);

  useEffect(() => {
    setSecciones(mergeWithDefaults(planification.secciones));
    setContentVersion(planification.contentVersion ?? 1);
    setDirty(false);
  }, [planification.secciones, planification.contentVersion]);

  const frecuenciaBloque = useMemo(() => {
    const { modoProgresion, frecuenciaSemanal } = planification.config;
    const map: Partial<Record<string, number>> = {
      bloqueX2: 2,
      bloqueX3: 3,
      bloqueX4: 4,
      bloqueX5: 5,
    };
    return map[modoProgresion] ?? null;
  }, [planification.config]);

  useEffect(() => {
    if (frecuenciaBloque && diaActivo > frecuenciaBloque) {
      setDiaActivo(1);
    }
  }, [frecuenciaBloque, diaActivo]);

  const tabIndex = useMemo(() => {
    if (tabActivo === TAB_PREVIEW_ID) return WIZARD_TABS.length;
    return WIZARD_TABS.findIndex((t) => t.id === tabActivo);
  }, [tabActivo]);

  const getSeccion = useCallback(
    (tabId: string) => {
      const tab = WIZARD_TABS.find((t) => t.id === tabId);
      if (!tab) return undefined;
      return secciones.find((s) => s.titulo === tab.titulo);
    },
    [secciones],
  );

  const updateSeccion = useCallback((titulo: string, updater: (s: PlanificationSection) => PlanificationSection) => {
    setSecciones((prev) =>
      prev.map((s) => (s.titulo === titulo ? updater(s) : s)),
    );
    setDirty(true);
  }, []);

  const setCalentamientoOrVuelta = useCallback((sec: PlanificationSection) => {
    setSecciones((prev) => {
      const sin = prev.filter((s) => s.tipoSeccion !== sec.tipoSeccion);
      if (sec.tipoSeccion === TipoSeccion.CALENTAMIENTO) {
        return [sec, ...sin.filter((s) => s.tipoSeccion !== TipoSeccion.CALENTAMIENTO)];
      }
      const calent = sin.find((s) => s.tipoSeccion === TipoSeccion.CALENTAMIENTO);
      const rest = sin.filter(
        (s) =>
          s.tipoSeccion !== TipoSeccion.CALENTAMIENTO &&
          s.tipoSeccion !== TipoSeccion.VUELTA_CALMA,
      );
      const out = calent ? [calent, ...rest, sec] : [...rest, sec];
      return out;
    });
    setDirty(true);
  }, []);

  const countItemsInTab = useCallback(
    (tabId: string) => {
      const sec = getSeccion(tabId);
      if (!sec) return 0;
      if (!frecuenciaBloque || sec.tipoSeccion !== TipoSeccion.PRINCIPAL) {
        return countItemsEnSeccion(sec.items);
      }
      return countItemsEnSeccion(
        filterItemsPorDia(sec.items, frecuenciaBloque, diaActivo, true),
      );
    },
    [getSeccion, frecuenciaBloque, diaActivo],
  );

  async function handleSave() {
    const prevVersion = contentVersion;
    try {
      const result = await upsert.mutateAsync({
        secciones,
        requireFijas: false,
        expectedContentVersion: contentVersion,
      });
      const nextVersion = result.contentVersion ?? prevVersion;
      if (nextVersion <= prevVersion) {
        toast.warning(
          'El servidor no incrementó contentVersion. Revisá la consola o reintentá.',
        );
      } else {
        toast.success('Planilla guardada correctamente');
      }
      setSecciones(mergeWithDefaults(result.secciones));
      setContentVersion(nextVersion);
      setDirty(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(
          'Otra sesión modificó esta planificación. Recargá la página.',
        );
      } else {
        const msg = err instanceof Error ? err.message : 'Error al guardar';
        toast.error(msg);
      }
      throw err;
    }
  }

  function avanzarTab() {
    if (tabActivo === TAB_PREVIEW_ID) return;
    const next = WIZARD_TABS[tabIndex + 1];
    if (next) setTabActivo(next.id);
    else setTabActivo(TAB_PREVIEW_ID);
  }

  function retrocederTab() {
    if (tabActivo === TAB_PREVIEW_ID) {
      setTabActivo(WIZARD_TABS[WIZARD_TABS.length - 1].id);
      return;
    }
    const prev = WIZARD_TABS[tabIndex - 1];
    if (prev) setTabActivo(prev.id);
  }

  const seccionTieneItems = useCallback(
    (tabId: string) => countItemsInTab(tabId) > 0,
    [countItemsInTab],
  );

  const progresoAsistente = useMemo(() => {
    const completadas = WIZARD_TABS.filter((t) => seccionTieneItems(t.id)).length;
    const total = WIZARD_TABS.length;
    return {
      seccionesCompletadas: completadas,
      totalSecciones: total,
      progreso: total > 0 ? (completadas / total) * 100 : 0,
    };
  }, [seccionTieneItems]);

  const syncFromServer = useCallback((next: Planification) => {
    setSecciones(mergeWithDefaults(next.secciones));
    setContentVersion(next.contentVersion ?? 1);
  }, []);

  return {
    tabActivo,
    setTabActivo,
    diaActivo,
    setDiaActivo,
    secciones,
    contentVersion,
    dirty,
    upsert,
    frecuenciaBloque,
    tabIndex,
    getSeccion,
    updateSeccion,
    setCalentamientoOrVuelta,
    countItemsInTab,
    handleSave,
    avanzarTab,
    retrocederTab,
    progresoAsistente,
    syncFromServer,
  };
}

export type AsistenteState = ReturnType<typeof useAsistenteState>;

export { filterItemsPorDia };
export type { PlanificationSectionItem };
