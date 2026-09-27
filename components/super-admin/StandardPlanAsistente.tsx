'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  Planification,
  PlanificationConfig,
  PlanificationProgress,
  PlanificationSection,
  PlanificationStatus,
  ProgressionMode,
  TipoSeccion,
} from '@/types/planification';
import type { StandardPlanTemplate } from '@/types/standard-plan';
import {
  useUpdateStandardPlan,
  useUpsertStandardPlanSecciones,
} from '@/hooks/useStandardPlans';
import {
  countItemsEnSeccion,
  filterItemsPorDia,
  hydrateSections,
  isSingleItem,
} from '@/lib/planification/section-items';
import { remapSeccionesDiaBaseForMode } from '@/lib/planification/remap-dia-base';
import {
  clampDiaActivo,
  frecuenciaBloqueFromModo,
  loadDiaActivo,
  resumenDiasBloque,
  saveDiaActivo,
} from '@/lib/planification/asistente-dia';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TAB_PREVIEW_ID,
  WIZARD_TABS,
} from '@/components/planificaciones/asistente/constants';
import { IndicadorProgreso } from '@/components/planificaciones/asistente/IndicadorProgreso';
import { AsistenteConfigBar } from '@/components/planificaciones/asistente/AsistenteConfigBar';
import { TabSeccionContent } from '@/components/planificaciones/asistente/TabSeccionContent';

const EMPTY_PROGRESS: PlanificationProgress = {
  completadas: [],
  fechas: [],
  rpePorSesion: {},
  comentarios: [],
};

function defaultSection(
  tab: (typeof WIZARD_TABS)[number],
  orden: number,
): PlanificationSection {
  return {
    tipoSeccion: tab.tipoSeccion,
    titulo: tab.titulo,
    orden,
    items: [],
  };
}

function mergeWithDefaults(
  existing: PlanificationSection[],
  modo: ProgressionMode,
): PlanificationSection[] {
  const hydrated = hydrateSections(existing);
  const withTabs = WIZARD_TABS.map((tab, idx) => {
    const found = hydrated.find(
      (s) =>
        s.tipoSeccion === tab.tipoSeccion &&
        s.titulo.toLowerCase() === tab.titulo.toLowerCase(),
    );
    return found ?? defaultSection(tab, idx);
  });
  return remapSeccionesDiaBaseForMode(withTabs, modo);
}

function templateToPlanification(
  template: StandardPlanTemplate,
  configOverride?: PlanificationConfig,
): Planification {
  const modo =
    ((configOverride ?? template.config).modoProgresion as ProgressionMode) ||
    ProgressionMode.LINEAL;
  const config = configOverride ?? {
    semanasDelPlan: template.config.semanasDelPlan,
    frecuenciaSemanal: template.config.frecuenciaSemanal,
    totalSesiones: template.config.totalSesiones,
    modoProgresion: modo,
  };
  return {
    id: template.id,
    titulo: template.nombre,
    alumnoId: null,
    profesorId: '',
    tenantId: '',
    estado: PlanificationStatus.ACTIVE,
    esPlantilla: true,
    version: 1,
    contentVersion: template.contentVersion,
    config: {
      ...config,
      modoProgresion: config.modoProgresion as ProgressionMode,
    },
    secciones: (template.secciones ?? []) as PlanificationSection[],
    progresoAlumno: EMPTY_PROGRESS,
    createdAt: template.createdAt ?? new Date().toISOString(),
    updatedAt: template.updatedAt ?? new Date().toISOString(),
  };
}

function StandardPreviewPanel({
  secciones,
  config,
  needsSave,
}: {
  secciones: PlanificationSection[];
  config: PlanificationConfig;
  needsSave: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Vista previa</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen del contenido del template (sin kilos prescritos).
            {needsSave
              ? ' Hay cambios sin guardar — esto refleja el borrador local.'
              : null}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {config.semanasDelPlan} sem · {config.frecuenciaSemanal} días/sem ·{' '}
            {config.totalSesiones} sesiones
          </p>
        </div>
        {secciones.map((sec) => (
          <div key={`${sec.tipoSeccion}-${sec.titulo}`} className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">{sec.titulo}</h3>
            {!sec.items?.length ? (
              <p className="text-xs text-muted-foreground">Sin ejercicios</p>
            ) : (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {sec.items.map((item) => {
                  if (isSingleItem(item)) {
                    return (
                      <li key={item.id}>
                        {item.ejercicio}
                        {item.diaBase ? ` · día ${item.diaBase}` : ''}
                        {item.parametros.series != null &&
                        item.parametros.reps != null
                          ? ` · ${item.parametros.series}×${item.parametros.reps}`
                          : ''}
                      </li>
                    );
                  }
                  return (
                    <li key={item.id}>
                      {item.tipoGrupo}:{' '}
                      {item.items.map((s) => s.ejercicio).join(' + ')}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StandardPlanAsistente({
  template,
}: {
  template: StandardPlanTemplate;
}) {
  const router = useRouter();
  const upsert = useUpsertStandardPlanSecciones(template.id);
  const updateMeta = useUpdateStandardPlan(template.id);

  const [config, setConfig] = useState<PlanificationConfig>(() => ({
    semanasDelPlan: template.config.semanasDelPlan,
    frecuenciaSemanal: template.config.frecuenciaSemanal,
    totalSesiones: template.config.totalSesiones,
    modoProgresion: template.config.modoProgresion as ProgressionMode,
  }));

  const planification = useMemo(
    () => templateToPlanification(template, config),
    [template, config],
  );

  const [tabActivo, setTabActivo] = useState(WIZARD_TABS[0].id);
  const [secciones, setSecciones] = useState<PlanificationSection[]>(() =>
    mergeWithDefaults(planification.secciones, config.modoProgresion),
  );
  const [contentVersion, setContentVersion] = useState(
    planification.contentVersion ?? 1,
  );
  const [dirty, setDirty] = useState(false);

  const frecuenciaBloque = useMemo(
    () => frecuenciaBloqueFromModo(config.modoProgresion),
    [config.modoProgresion],
  );

  const [diaActivo, setDiaActivoState] = useState(() =>
    loadDiaActivo(planification.id, frecuenciaBloque),
  );

  useEffect(() => {
    setSecciones(
      mergeWithDefaults(
        (template.secciones ?? []) as PlanificationSection[],
        config.modoProgresion,
      ),
    );
    setContentVersion(template.contentVersion ?? 1);
    setDirty(false);
  }, [template.secciones, template.contentVersion, config.modoProgresion]);

  useEffect(() => {
    setDiaActivoState((prev) => {
      const clamped = clampDiaActivo(prev, frecuenciaBloque);
      if (!frecuenciaBloque) return 1;
      const restored = loadDiaActivo(planification.id, frecuenciaBloque);
      return clampDiaActivo(restored || clamped, frecuenciaBloque);
    });
  }, [planification.id, frecuenciaBloque]);

  const setDiaActivo = useCallback(
    (dia: number) => {
      const next = clampDiaActivo(dia, frecuenciaBloque);
      setDiaActivoState(next);
      if (frecuenciaBloque) {
        saveDiaActivo(planification.id, next);
      }
    },
    [frecuenciaBloque, planification.id],
  );

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

  const updateSeccion = useCallback(
    (titulo: string, updater: (s: PlanificationSection) => PlanificationSection) => {
      setSecciones((prev) =>
        prev.map((s) => (s.titulo === titulo ? updater(s) : s)),
      );
      setDirty(true);
    },
    [],
  );

  const setCalentamientoOrVuelta = useCallback((sec: PlanificationSection) => {
    setSecciones((prev) => {
      const sin = prev.filter((s) => s.tipoSeccion !== sec.tipoSeccion);
      if (sec.tipoSeccion === TipoSeccion.CALENTAMIENTO) {
        return [sec, ...sin];
      }
      const calent = sin.find(
        (s) => s.tipoSeccion === TipoSeccion.CALENTAMIENTO,
      );
      const rest = sin.filter(
        (s) =>
          s.tipoSeccion !== TipoSeccion.CALENTAMIENTO &&
          s.tipoSeccion !== TipoSeccion.VUELTA_CALMA,
      );
      return calent ? [calent, ...rest, sec] : [...rest, sec];
    });
    setDirty(true);
  }, []);

  const countItemsInTab = useCallback(
    (tabId: string) => {
      const sec = getSeccion(tabId);
      if (!sec) return 0;
      const items = frecuenciaBloque
        ? filterItemsPorDia(sec.items, frecuenciaBloque, diaActivo)
        : sec.items;
      return countItemsEnSeccion(items);
    },
    [getSeccion, frecuenciaBloque, diaActivo],
  );

  const diasResumen = useMemo(() => {
    if (!frecuenciaBloque) return [];
    return resumenDiasBloque(secciones, frecuenciaBloque);
  }, [secciones, frecuenciaBloque]);

  const progresoAsistente = useMemo(() => {
    const completadas = WIZARD_TABS.filter(
      (t) => countItemsInTab(t.id) > 0,
    ).length;
    const total = WIZARD_TABS.length;
    return {
      seccionesCompletadas: completadas,
      totalSecciones: total,
      progreso: total > 0 ? (completadas / total) * 100 : 0,
    };
  }, [countItemsInTab]);

  const tabIds = [...WIZARD_TABS.map((t) => t.id), TAB_PREVIEW_ID];
  const idx = tabIds.indexOf(tabActivo);

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

  async function handleConfigCommit(next: PlanificationConfig) {
    const updated = await updateMeta.mutateAsync({
      config: {
        semanasDelPlan: next.semanasDelPlan,
        frecuenciaSemanal: next.frecuenciaSemanal,
        totalSesiones: next.totalSesiones,
        modoProgresion: next.modoProgresion,
      },
    });
    setConfig({
      semanasDelPlan: updated.config.semanasDelPlan,
      frecuenciaSemanal: updated.config.frecuenciaSemanal,
      totalSesiones: updated.config.totalSesiones,
      modoProgresion: updated.config.modoProgresion as ProgressionMode,
    });
    setSecciones(
      mergeWithDefaults(
        (updated.secciones ?? []) as PlanificationSection[],
        updated.config.modoProgresion as ProgressionMode,
      ),
    );
  }

  async function handleSave() {
    const prevVersion = contentVersion;
    try {
      const result = await upsert.mutateAsync({
        secciones: remapSeccionesDiaBaseForMode(secciones, config.modoProgresion),
        expectedContentVersion: contentVersion,
      });
      const nextVersion = result.contentVersion ?? prevVersion;
      setSecciones(
        mergeWithDefaults(
          (result.secciones ?? []) as PlanificationSection[],
          config.modoProgresion,
        ),
      );
      setContentVersion(nextVersion);
      setDirty(false);
      if (frecuenciaBloque) {
        saveDiaActivo(planification.id, diaActivo);
      }
      toast.success(
        frecuenciaBloque
          ? `Template guardado · Día ${diaActivo}. Podés seguir con otro día cuando quieras.`
          : 'Template guardado (sin kilos prescritos)',
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('Otra sesión modificó este template. Recargá la página.');
      } else {
        toast.error('No se pudo guardar', {
          description: err instanceof ApiError ? err.message : undefined,
        });
      }
    }
  }

  const wizardTabs = (
    <Tabs value={tabActivo} onValueChange={setTabActivo}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={retrocederTab}
          disabled={tabIndex <= 0}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <TabsList className="h-auto w-max flex-wrap">
            {WIZARD_TABS.map((tab, index) => {
              const count = countItemsInTab(tab.id);
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-xs sm:text-sm"
                >
                  {count > 0 ? (
                    <CheckCircle2 className="size-3 text-foreground" />
                  ) : null}
                  <span className="hidden sm:inline">{tab.titulo}</span>
                  <span className="sm:hidden">
                    {index + 1}. {tab.titulo.split(' ')[0]}
                  </span>
                  {count > 0 ? (
                    <span
                      className="ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold leading-none text-primary-foreground tabular-nums"
                      aria-label={`${count} ejercicio${count === 1 ? '' : 's'}`}
                    >
                      {count}
                    </span>
                  ) : null}
                </TabsTrigger>
              );
            })}
            <TabsTrigger value={TAB_PREVIEW_ID} className="text-xs sm:text-sm">
              Vista previa
            </TabsTrigger>
          </TabsList>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={avanzarTab}
          disabled={idx >= tabIds.length - 1}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {WIZARD_TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <TabSeccionContent
                tabId={tab.id}
                planification={{ ...planification, secciones }}
                seccion={getSeccion(tab.id)}
                diaActivo={diaActivo}
                frecuenciaBloque={frecuenciaBloque}
                contentVersion={contentVersion}
                progresoAlumno={EMPTY_PROGRESS}
                onUpdateSeccion={updateSeccion}
                onUpdateCardio={setCalentamientoOrVuelta}
                onAdjusted={() => undefined}
                assistantMode="standard"
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}

      <TabsContent value={TAB_PREVIEW_ID}>
        <StandardPreviewPanel
          secciones={secciones}
          config={config}
          needsSave={dirty}
        />
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pb-10">
      <Card className="border-2 border-primary">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plan estándar · sin kilos prescritos
              </p>
              <h1 className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                Asistente de planificación
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {template.nombre} · /{template.slug}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/super-admin/planes-estandar')}
              >
                Volver
              </Button>
              <Button
                onClick={handleSave}
                disabled={!dirty || upsert.isPending}
              >
                <Save className="size-4" />
                {upsert.isPending
                  ? 'Guardando…'
                  : dirty
                    ? 'Guardar planilla'
                    : 'Sin cambios'}
              </Button>
            </div>
          </div>

          <AsistenteConfigBar
            planificationId={planification.id}
            config={config}
            diaActivo={diaActivo}
            frecuenciaBloque={frecuenciaBloque}
            diasResumen={diasResumen}
            totalSesiones={config.totalSesiones}
            onDiaChange={setDiaActivo}
            onConfigCommit={handleConfigCommit}
          />

          <IndicadorProgreso
            progreso={progresoAsistente.progreso}
            seccionesCompletadas={progresoAsistente.seccionesCompletadas}
            totalSecciones={progresoAsistente.totalSecciones}
            diaLabel={
              frecuenciaBloque
                ? etiquetaDia(config.modoProgresion, diaActivo)
                : null
            }
          />
        </CardContent>
      </Card>

      {upsert.error ? (
        <Card className="border-destructive bg-red-50 dark:bg-red-950/30">
          <CardContent className="p-4 text-sm text-destructive">
            {(upsert.error as Error).message}
          </CardContent>
        </Card>
      ) : null}

      <div className="min-w-0">{wizardTabs}</div>
    </div>
  );
}
