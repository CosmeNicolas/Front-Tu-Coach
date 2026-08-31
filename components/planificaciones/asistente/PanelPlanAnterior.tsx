'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftRight, History, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePlanBaseline } from '@/hooks/usePlanifications';
import { usePrivateExerciseWizardCatalog } from '@/hooks/usePrivateExercises';
import {
  PlanBaselineItem,
  PlanBaselineSection,
  Planification,
  PlanificationItemSingle,
  PlanificationSection,
  PlanificationSectionItem,
  TipoSeccion,
} from '@/types/planification';
import { mergeImportedItemsIntoSection } from '@/lib/planification/merge-baseline-import';
import { remapItemsDiaBaseForMode } from '@/lib/planification/remap-dia-base';
import { isGroupItem, isSingleItem } from '@/lib/planification/section-items';
import {
  aplicarSugerenciaConservandoCarga,
  buildTabCatalog,
  collectExerciseNames,
  sugerirAlternativasEjercicio,
} from '@/lib/ejercicios/sugerir-alternativas';
import {
  filtrarPrivadosParaWizard,
} from '@/lib/ejercicios/merge-private-catalog';
import { EjercicioCatalogo, nombreVisible } from '@/lib/ejercicios/catalogo';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Props {
  planification: Planification;
  /** Tab activo del wizard (titulo de sección destino). */
  activeTabTitulo?: string;
  getSeccion: (tabId: string) => PlanificationSection | undefined;
  tabIdByTitulo: Map<string, string>;
  onUpdateSeccion: (
    titulo: string,
    updater: (s: PlanificationSection) => PlanificationSection,
  ) => void;
  onUpdateCardio: (sec: PlanificationSection) => void;
  blocked?: boolean;
}

function toastMergeResult(
  label: string,
  result: ReturnType<typeof mergeImportedItemsIntoSection>,
) {
  if (result.added > 0) {
    toast.success(`${label}: +${result.added} ejercicio(s)`);
  }
  if (result.skippedDuplicates > 0 || result.skippedLimit > 0) {
    const parts: string[] = [];
    if (result.skippedDuplicates > 0) {
      parts.push(`${result.skippedDuplicates} duplicado(s)`);
    }
    if (result.skippedLimit > 0) {
      parts.push(`${result.skippedLimit} por límite de sección`);
    }
    toast.message(`Omitidos: ${parts.join(', ')}`);
  }
  if (
    result.added === 0 &&
    result.skippedDuplicates === 0 &&
    result.skippedLimit === 0
  ) {
    toast.message('No había nada para importar');
  }
}

function asSinglePayload(
  payload: PlanificationSectionItem,
): PlanificationItemSingle | null {
  if (isSingleItem(payload)) return payload;
  return null;
}

export function PanelPlanAnterior({
  planification,
  activeTabTitulo,
  getSeccion,
  tabIdByTitulo,
  onUpdateSeccion,
  onUpdateCardio,
  blocked,
}: Props) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  /** sourceKey → catalog key elegido como reemplazo */
  const [reemplazos, setReemplazos] = useState<Record<string, string>>({});

  const { data: baseline, isLoading } = usePlanBaseline(
    planification.alumnoId ?? undefined,
    {
      excludePlanificationId: planification.id,
      modoProgresion: planification.config.modoProgresion,
    },
  );
  const { data: wizardPrivados } = usePrivateExerciseWizardCatalog();

  const sections = useMemo(
    () => baseline?.secciones ?? [],
    [baseline?.secciones],
  );

  const privadosByTab = useMemo(() => {
    const map = new Map<string, EjercicioCatalogo[]>();
    const raw = wizardPrivados?.ejercicios ?? [];
    const tabIds = new Set(tabIdByTitulo.values());
    for (const tabId of tabIds) {
      map.set(tabId, filtrarPrivadosParaWizard(raw, { tabId, limit: 80 }));
    }
    return map;
  }, [wizardPrivados?.ejercicios, tabIdByTitulo]);

  if (!planification.alumnoId) return null;
  if (!isLoading && !baseline?.available) return null;

  function resolveTabId(source: PlanBaselineSection): string | undefined {
    return tabIdByTitulo.get(source.titulo.toLowerCase());
  }

  function resolveTargetSection(
    source: PlanBaselineSection,
  ): PlanificationSection | null {
    const tabId = resolveTabId(source);
    if (tabId) {
      return getSeccion(tabId) ?? null;
    }
    for (const [, id] of tabIdByTitulo) {
      const sec = getSeccion(id);
      if (sec && sec.titulo.toLowerCase() === source.titulo.toLowerCase()) {
        return sec;
      }
    }
    return null;
  }

  function catalogForSection(source: PlanBaselineSection): EjercicioCatalogo[] {
    const tabId = resolveTabId(source);
    if (!tabId) return [];
    return buildTabCatalog(tabId, privadosByTab.get(tabId) ?? [], 80);
  }

  function suggestionsForItem(
    source: PlanBaselineSection,
    item: PlanBaselineItem,
  ): EjercicioCatalogo[] {
    if (item.kind === 'group') return [];
    const tabId = resolveTabId(source);
    if (!tabId) return [];
    const target = resolveTargetSection(source);
    const exclude = [
      ...collectExerciseNames(source.sectionPayload?.items ?? []),
      ...collectExerciseNames(target?.items ?? []),
    ];
    return sugerirAlternativasEjercicio({
      ejercicioNombre: item.ejercicio,
      tabId,
      catalogo: catalogForSection(source),
      excludeNames: exclude,
      limit: 5,
    });
  }

  function applyToSection(
    target: PlanificationSection,
    items: PlanificationSectionItem[],
    label: string,
  ) {
    const result = mergeImportedItemsIntoSection(
      target,
      remapItemsDiaBaseForMode(items, planification.config.modoProgresion),
    );
    if (
      target.tipoSeccion === TipoSeccion.CALENTAMIENTO ||
      target.tipoSeccion === TipoSeccion.VUELTA_CALMA
    ) {
      onUpdateCardio(result.section);
    } else {
      onUpdateSeccion(target.titulo, () => result.section);
    }
    toastMergeResult(label, result);
  }

  function importSection(source: PlanBaselineSection) {
    if (blocked) {
      toast.error(
        'Con progreso del alumno no se puede importar así. Usá ⚡ ajuste.',
      );
      return;
    }
    const target = resolveTargetSection(source);
    if (!target) {
      toast.error(`No encontré la sección «${source.titulo}» en el asistente`);
      return;
    }
    const items =
      source.sectionPayload?.items ??
      source.items.map((i) => i.payload).filter(Boolean);
    applyToSection(target, items, source.titulo);
  }

  function resolvePayloadWithOptionalSwap(
    source: PlanBaselineSection,
    item: PlanBaselineItem,
  ): PlanificationSectionItem | null {
    const payload = item.payload;
    if (!payload) return null;
    if (item.kind === 'group' || isGroupItem(payload)) return payload;

    const single = asSinglePayload(payload);
    if (!single) return payload;

    const selectedKey = reemplazos[item.sourceKey];
    if (!selectedKey || selectedKey === '__same__') return single;

    const suggestions = suggestionsForItem(source, item);
    const chosen = suggestions.find(
      (s) => `${nombreVisible(s)}::${s.gif}` === selectedKey,
    );
    if (!chosen) return single;
    return aplicarSugerenciaConservandoCarga(single, chosen);
  }

  function importItem(source: PlanBaselineSection, item: PlanBaselineItem) {
    if (blocked) {
      toast.error(
        'Con progreso del alumno no se puede importar así. Usá ⚡ ajuste.',
      );
      return;
    }
    const target = resolveTargetSection(source);
    if (!target) {
      toast.error(`No encontré la sección «${source.titulo}» en el asistente`);
      return;
    }
    const payload = resolvePayloadWithOptionalSwap(source, item);
    if (!payload) {
      toast.error('No se pudo preparar el ejercicio para importar');
      return;
    }
    const label =
      isSingleItem(payload) && payload.ejercicio !== item.ejercicio
        ? `${item.ejercicio} → ${payload.ejercicio}`
        : item.ejercicio;
    applyToSection(target, [payload], label);
  }

  function importActiveTabSection() {
    if (!activeTabTitulo) return;
    const source = sections.find(
      (s) => s.titulo.toLowerCase() === activeTabTitulo.toLowerCase(),
    );
    if (!source) {
      toast.message(`El plan anterior no tiene «${activeTabTitulo}»`);
      return;
    }
    importSection(source);
  }

  return (
    <aside className="rounded-2xl border border-border bg-card shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="size-4" />
          Plan anterior
        </span>
        <span className="text-xs text-muted-foreground">
          {open ? 'Ocultar' : 'Mostrar'}
        </span>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-border px-4 py-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {baseline?.titulo}
                {' · '}
                {baseline?.totalEjercicios} ejercicios
                {' · '}
                última carga sembrada
              </p>
              <p className="text-[11px] text-muted-foreground">
                En cada ejercicio podés importarlo igual o cambiarlo por un
                sugerido del mismo grupo, conservando la carga.
              </p>

              {activeTabTitulo ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={blocked}
                  onClick={importActiveTabSection}
                >
                  Importar «{activeTabTitulo}» del plan anterior
                </Button>
              ) : null}

              <ul className="max-h-[28rem] space-y-2 overflow-y-auto">
                {sections.map((sec) => {
                  const isOpen = expanded === sec.titulo;
                  const isActiveTab =
                    activeTabTitulo &&
                    sec.titulo.toLowerCase() === activeTabTitulo.toLowerCase();
                  return (
                    <li
                      key={sec.titulo}
                      className={cn(
                        'rounded-xl border border-border',
                        isActiveTab && 'border-primary/50 bg-primary/5',
                      )}
                    >
                      <div className="flex items-center gap-1 px-2 py-1.5">
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground"
                          onClick={() =>
                            setExpanded(isOpen ? null : sec.titulo)
                          }
                        >
                          {sec.titulo}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({sec.totalEjercicios})
                          </span>
                        </button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={blocked}
                          onClick={() => importSection(sec)}
                          title={`Importar sección ${sec.titulo}`}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      {isOpen ? (
                        <ul className="space-y-2 border-t border-border px-2 py-2">
                          {sec.items.map((item) => {
                            const suggestions =
                              item.kind === 'single'
                                ? suggestionsForItem(sec, item)
                                : [];
                            const selected =
                              reemplazos[item.sourceKey] ?? '__same__';
                            return (
                              <li
                                key={item.sourceKey}
                                className="space-y-1.5 rounded-md bg-background/60 px-1.5 py-1.5 text-xs"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-foreground">
                                      {item.ejercicio}
                                      {item.tipoGrupo ? (
                                        <span className="ml-1 text-muted-foreground">
                                          ({item.tipoGrupo})
                                        </span>
                                      ) : null}
                                    </p>
                                    {item.ultimaCarga ? (
                                      <p className="text-muted-foreground">
                                        {item.ultimaCarga}
                                        {item.diaBase != null
                                          ? ` · Día ${item.diaBase}`
                                          : ''}
                                      </p>
                                    ) : item.diaBase != null ? (
                                      <p className="text-muted-foreground">
                                        Día {item.diaBase}
                                      </p>
                                    ) : null}
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    disabled={blocked}
                                    onClick={() => importItem(sec, item)}
                                    title="Importar"
                                  >
                                    <Plus className="size-3.5" />
                                  </Button>
                                </div>

                                {suggestions.length > 0 ? (
                                  <div className="flex items-center gap-1.5">
                                    <ArrowLeftRight className="size-3 shrink-0 text-muted-foreground" />
                                    <Select
                                      value={selected}
                                      onValueChange={(value) =>
                                        setReemplazos((prev) => ({
                                          ...prev,
                                          [item.sourceKey]: value,
                                        }))
                                      }
                                      disabled={blocked}
                                    >
                                      <SelectTrigger className="h-7 text-[11px]">
                                        <SelectValue placeholder="Importar igual" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="__same__">
                                          Mismo ejercicio
                                        </SelectItem>
                                        {suggestions.map((s) => {
                                          const key = `${nombreVisible(s)}::${s.gif}`;
                                          return (
                                            <SelectItem key={key} value={key}>
                                              {nombreVisible(s)}
                                              {s.source === 'private'
                                                ? ' (privado)'
                                                : ''}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </aside>
  );
}
