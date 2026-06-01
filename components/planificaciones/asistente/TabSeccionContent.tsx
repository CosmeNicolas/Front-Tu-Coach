'use client';

import { useState } from 'react';
import { Link2, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Planification,
  PlanificationItemSingle,
  PlanificationSection,
  PlanificationSectionItem,
  TipoSeccion,
} from '@/types/planification';
import {
  EjercicioCatalogo,
  esIsometrico,
  nombreVisible,
} from '@/lib/ejercicios/catalogo';
import {
  countItemsEnSeccion,
  filterItemsPorDia,
  isGroupItem,
  isSingleItem,
} from '@/lib/planification/section-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MAX_EJERCICIOS_POR_SECCION, WIZARD_TABS } from './constants';
import { SelectorCardioGrid } from './SelectorCardioGrid';
import { CardEjercicio } from './CardEjercicio';
import { CardGrupoEjercicio } from './CardGrupoEjercicio';
import { FormularioRapido } from './FormularioRapido';
import { BuscadorEjercicio } from './BuscadorEjercicio';
import { useCombinacionEjercicios } from './useCombinacionEjercicios';
import { etiquetaDia } from '@/lib/planification/preview-progression';

interface Props {
  tabId: string;
  planification: Planification;
  seccion?: PlanificationSection;
  diaActivo: number;
  frecuenciaBloque: number | null;
  contentVersion: number;
  onUpdateSeccion: (
    titulo: string,
    updater: (s: PlanificationSection) => PlanificationSection,
  ) => void;
  onUpdateCardio: (sec: PlanificationSection) => void;
  onAdjusted: (planification: Planification) => void;
}

export function TabSeccionContent({
  tabId,
  planification,
  seccion,
  diaActivo,
  frecuenciaBloque,
  contentVersion,
  onUpdateSeccion,
  onUpdateCardio,
  onAdjusted,
}: Props) {
  const tab = WIZARD_TABS.find((t) => t.id === tabId);
  if (!tab || !seccion) return null;

  if (
    tab.tipoSeccion === TipoSeccion.CALENTAMIENTO ||
    tab.tipoSeccion === TipoSeccion.VUELTA_CALMA
  ) {
    return (
      <SelectorCardioGrid
        tipoSeccion={tab.tipoSeccion}
        seccion={seccion}
        config={planification.config}
        onChange={onUpdateCardio}
      />
    );
  }

  return (
    <SeccionPrincipal
      tab={tab}
      tabId={tabId}
      seccion={seccion}
      planification={planification}
      diaActivo={diaActivo}
      frecuenciaBloque={frecuenciaBloque}
      contentVersion={contentVersion}
      onUpdateSeccion={onUpdateSeccion}
      onAdjusted={onAdjusted}
    />
  );
}

function SeccionPrincipal({
  tab,
  tabId,
  seccion,
  planification,
  diaActivo,
  frecuenciaBloque,
  contentVersion,
  onUpdateSeccion,
  onAdjusted,
}: {
  tab: (typeof WIZARD_TABS)[number];
  tabId: string;
  seccion: PlanificationSection;
  planification: Planification;
  diaActivo: number;
  frecuenciaBloque: number | null;
  contentVersion: number;
  onUpdateSeccion: Props['onUpdateSeccion'];
  onAdjusted: Props['onAdjusted'];
}) {
  const [ejercicioSel, setEjercicioSel] = useState<EjercicioCatalogo | null>(null);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(true);

  const itemsVisibles = filterItemsPorDia(
    seccion.items,
    frecuenciaBloque,
    diaActivo,
    true,
  );
  const cantidadTotal = countItemsEnSeccion(seccion.items);
  const puedeAgregar = cantidadTotal < MAX_EJERCICIOS_POR_SECCION;

  function setItems(next: PlanificationSectionItem[]) {
    onUpdateSeccion(seccion.titulo, (s) => ({ ...s, items: next }));
  }

  const combo = useCombinacionEjercicios(seccion.items, setItems);

  function indexOfId(id: string) {
    return seccion.items.findIndex((it) => it.id === id);
  }

  function updateSingleAt(idx: number, item: PlanificationItemSingle) {
    onUpdateSeccion(seccion.titulo, (s) => ({
      ...s,
      items: s.items.map((it, i) => (i === idx ? item : it)),
    }));
  }

  function removeAt(idx: number) {
    onUpdateSeccion(seccion.titulo, (s) => ({
      ...s,
      items: s.items.filter((_, i) => i !== idx),
    }));
  }

  function addItem(item: PlanificationItemSingle) {
    onUpdateSeccion(seccion.titulo, (s) => ({
      ...s,
      items: [...s.items, item],
    }));
    setEjercicioSel(null);
  }

  function updateGrupoSubitem(groupId: string, subId: string, updated: PlanificationItemSingle) {
    onUpdateSeccion(seccion.titulo, (s) => ({
      ...s,
      items: s.items.map((it) => {
        if (!isGroupItem(it) || it.id !== groupId) return it;
        return {
          ...it,
          items: it.items.map((sub) => (sub.id === subId ? updated : sub)),
        };
      }),
    }));
  }

  function handleCombinar() {
    const ok = combo.combinar();
    if (ok) toast.success('Grupo creado');
    else toast.error('No se pudo combinar. Verificá la selección.');
  }

  const diaLabel = frecuenciaBloque
    ? etiquetaDia(planification.config.modoProgresion, diaActivo)
    : null;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-primary sm:text-xl">{tab.titulo}</h2>
          <p className="text-sm text-muted-foreground">
            {itemsVisibles.length} bloque(s) visible{frecuenciaBloque ? ` · ${diaLabel}` : ''} ·{' '}
            {cantidadTotal} / {MAX_EJERCICIOS_POR_SECCION} ejercicios
          </p>
        </div>
        {!puedeAgregar ? (
          <Badge variant="outline" className="border-yellow-400 bg-yellow-50 text-yellow-800">
            ⚠️ Límite alcanzado
          </Badge>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-2">
        {!combo.modoSeleccion ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => combo.setModoSeleccion(true)}
            disabled={combo.singlesSeleccionables.length < 2}
          >
            <Link2 className="size-4" />
            Combinar biserie/triserie
          </Button>
        ) : (
          <>
            <Button type="button" size="sm" onClick={handleCombinar} disabled={!combo.puedeCombinar}>
              Combinar ({combo.seleccionados.size})
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={combo.cancelarSeleccion}>
              Cancelar
            </Button>
          </>
        )}
      </div>

      {itemsVisibles.length > 0 ? (
        <div className="space-y-2">
          {itemsVisibles.map((entry) => {
            const idx = indexOfId(entry.id);
            if (isGroupItem(entry)) {
              return (
                <CardGrupoEjercicio
                  key={entry.id}
                  grupo={entry}
                  config={planification.config}
                  planificationId={planification.id}
                  contentVersion={contentVersion}
                  modoSeleccion={combo.modoSeleccion}
                  onUpdateSubitem={(subId, updated) =>
                    updateGrupoSubitem(entry.id, subId, updated)
                  }
                  onRemoveSubitem={(subId) => combo.quitarSubitem(entry.id, subId)}
                  onDesagrupar={() => combo.desagrupar(entry.id)}
                  onAdjusted={onAdjusted}
                />
              );
            }
            return (
              <div
                key={entry.id}
                className={
                  combo.modoSeleccion && combo.seleccionados.has(entry.id)
                    ? 'rounded-lg ring-2 ring-primary'
                    : undefined
                }
              >
                {combo.modoSeleccion ? (
                  <label className="mb-1 flex items-center gap-2 px-1 text-xs">
                    <input
                      type="checkbox"
                      checked={combo.seleccionados.has(entry.id)}
                      onChange={() => combo.toggleSeleccion(entry.id)}
                    />
                    Seleccionar para combinar
                  </label>
                ) : null}
                <CardEjercicio
                  item={entry}
                  config={planification.config}
                  planificationId={planification.id}
                  contentVersion={contentVersion}
                  onUpdate={(updated) => updateSingleAt(idx, updated)}
                  onRemove={() => removeAt(idx)}
                  onAdjusted={onAdjusted}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Plus className="mb-2 size-10 text-muted-foreground" />
            <p className="text-muted-foreground">No hay ejercicios en esta sección</p>
          </CardContent>
        </Card>
      )}

      {ejercicioSel ? (
        <FormularioRapido
          config={planification.config}
          diaActivo={diaActivo}
          frecuenciaBloque={frecuenciaBloque}
          ejercicioBase={{
            nombre: nombreVisible(ejercicioSel),
            gif: ejercicioSel.gif,
            descripcion: ejercicioSel.descripcion,
            isIsometrico: esIsometrico(nombreVisible(ejercicioSel)),
          }}
          onAgregar={addItem}
          onCancelar={() => setEjercicioSel(null)}
        />
      ) : null}

      {!ejercicioSel && puedeAgregar && !combo.modoSeleccion ? (
        <div className="space-y-3">
          <Button type="button" className="w-full sm:w-auto" onClick={() => setMostrarCatalogo((v) => !v)}>
            <Search className="size-4" />
            {mostrarCatalogo ? 'Ocultar catálogo' : 'Buscar ejercicios'}
          </Button>
          {mostrarCatalogo ? (
            <BuscadorEjercicio
              tabId={tabId}
              onSeleccionar={(ej) => {
                setEjercicioSel(ej);
                setMostrarCatalogo(false);
              }}
            />
          ) : null}
        </div>
      ) : null}

      {ejercicioSel ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => setEjercicioSel(null)}>
          <X className="size-4" />
          Cancelar selección
        </Button>
      ) : null}
    </div>
  );
}
