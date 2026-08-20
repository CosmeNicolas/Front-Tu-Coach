'use client';

import { useState } from 'react';
import { Link2, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  MaterializedPlanification,
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
  reorderGroupSubitem,
  reorderVisibleItems,
} from '@/lib/planification/section-items';
import { hasAlumnoSessionProgress } from '@/lib/planification/alumno-progress-guard';
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
import {
  SeccionItemsSortableList,
  SortableSectionItem,
} from './SeccionItemsSortableList';
import { etiquetaDia } from '@/lib/planification/preview-progression';

interface Props {
  tabId: string;
  planification: Planification;
  seccion?: PlanificationSection;
  diaActivo: number;
  frecuenciaBloque: number | null;
  contentVersion: number;
  progresoAlumno: Planification['progresoAlumno'];
  materialized?: MaterializedPlanification;
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
  progresoAlumno,
  materialized,
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
        diaActivo={diaActivo}
        frecuenciaBloque={frecuenciaBloque}
        progresoAlumno={progresoAlumno}
        planificationId={planification.id}
        contentVersion={contentVersion}
        onChange={onUpdateCardio}
        onAdjusted={onAdjusted}
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
      progresoAlumno={progresoAlumno}
      materialized={materialized}
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
  progresoAlumno,
  materialized,
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
  progresoAlumno: Planification['progresoAlumno'];
  materialized?: MaterializedPlanification;
  onUpdateSeccion: Props['onUpdateSeccion'];
  onAdjusted: Props['onAdjusted'];
}) {
  const [ejercicioSel, setEjercicioSel] = useState<EjercicioCatalogo | null>(null);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(true);

  const itemsVisibles = filterItemsPorDia(
    seccion.items,
    frecuenciaBloque,
    diaActivo,
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

  function notifyReorderIfProgress() {
    if (hasAlumnoSessionProgress(progresoAlumno)) {
      toast.message('Orden actualizado', {
        description:
          'El alumno verá los ejercicios en este orden. Guardá la planilla para aplicarlo.',
      });
    }
  }

  function handleReorderVisible(orderedVisibleIds: string[]) {
    const next = reorderVisibleItems(seccion.items, orderedVisibleIds);
    const changed = next.some((item, i) => item.id !== seccion.items[i]?.id);
    if (!changed) return;
    setItems(next);
    notifyReorderIfProgress();
  }

  function handleReorderInGroup(
    groupId: string,
    subId: string,
    direction: 'up' | 'down',
  ) {
    const next = reorderGroupSubitem(seccion.items, groupId, subId, direction);
    const grupoBefore = seccion.items.find(
      (it) => isGroupItem(it) && it.id === groupId,
    );
    const grupoAfter = next.find((it) => isGroupItem(it) && it.id === groupId);
    if (
      !grupoBefore ||
      !isGroupItem(grupoBefore) ||
      !grupoAfter ||
      !isGroupItem(grupoAfter)
    ) {
      return;
    }
    const changed = grupoBefore.items.some(
      (sub, i) => sub.id !== grupoAfter.items[i]?.id,
    );
    if (!changed) return;
    setItems(next);
    notifyReorderIfProgress();
  }

  const alumnoConProgreso = hasAlumnoSessionProgress(progresoAlumno);
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

      {itemsVisibles.length > 1 && !combo.modoSeleccion ? (
        <p className="rounded-lg border border-muted bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Arrastrá <span aria-hidden>⋮⋮</span> para reordenar bloques. El alumno verá los
          ejercicios en este mismo orden en su sesión.
          {alumnoConProgreso
            ? ' Podés reordenar aunque el alumno ya tenga progreso; recordá guardar la planilla.'
            : null}
        </p>
      ) : null}

      {itemsVisibles.length > 0 ? (
        <SeccionItemsSortableList
          itemIds={itemsVisibles.map((it) => it.id)}
          disabled={combo.modoSeleccion}
          onReorder={handleReorderVisible}
        >
          {itemsVisibles.map((entry) => {
            const idx = indexOfId(entry.id);
            if (isGroupItem(entry)) {
              return (
                <SortableSectionItem key={entry.id} id={entry.id}>
                  {({ dragHandleProps }) => (
                    <CardGrupoEjercicio
                      grupo={entry}
                      config={planification.config}
                      catalogTabId={tabId}
                      planificationId={planification.id}
                      contentVersion={contentVersion}
                      progresoAlumno={progresoAlumno}
                      materialized={materialized}
                      modoSeleccion={combo.modoSeleccion}
                      dragHandleProps={
                        combo.modoSeleccion ? undefined : dragHandleProps
                      }
                      onUpdateSubitem={(subId, updated) =>
                        updateGrupoSubitem(entry.id, subId, updated)
                      }
                      onRemoveSubitem={(subId) => combo.quitarSubitem(entry.id, subId)}
                      onDesagrupar={() => combo.desagrupar(entry.id)}
                      onReorderSubitem={(subId, direction) =>
                        handleReorderInGroup(entry.id, subId, direction)
                      }
                      onAdjusted={onAdjusted}
                    />
                  )}
                </SortableSectionItem>
              );
            }
            return (
              <SortableSectionItem key={entry.id} id={entry.id}>
                {({ dragHandleProps }) => (
                  <div
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
                      catalogTabId={tabId}
                      planificationId={planification.id}
                      contentVersion={contentVersion}
                      progresoAlumno={progresoAlumno}
                      materialized={materialized}
                      dragHandleProps={
                        combo.modoSeleccion ? undefined : dragHandleProps
                      }
                      onUpdate={(updated) => updateSingleAt(idx, updated)}
                      onRemove={() => removeAt(idx)}
                      onAdjusted={onAdjusted}
                    />
                  </div>
                )}
              </SortableSectionItem>
            );
          })}
        </SeccionItemsSortableList>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Plus className="mb-2 size-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              {frecuenciaBloque && diaLabel
                ? `Sin ejercicios en ${diaLabel} para esta sección`
                : 'No hay ejercicios en esta sección'}
            </p>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              {frecuenciaBloque
                ? 'Los ejercicios del Día 1 no aparecen acá. Cargá este día, guardá, y podés seguir con otro día más tarde.'
                : 'Buscá un ejercicio abajo para empezar.'}
            </p>
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
            mediaType: ejercicioSel.mediaType,
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
