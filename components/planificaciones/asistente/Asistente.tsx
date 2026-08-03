'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2, Save } from 'lucide-react';
import { Planification } from '@/types/planification';
import { useClient } from '@/hooks/useClients';
import { useMaterializedPlanification } from '@/hooks/usePlanifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  hasAlumnoSessionProgress,
  ultimaSesionCompletadaAlumno,
} from '@/lib/planification/alumno-progress-guard';
import { TAB_PREVIEW_ID, WIZARD_TABS } from './constants';
import { useAsistenteState } from './useAsistenteState';
import { IndicadorProgreso } from './IndicadorProgreso';
import { AsistenteConfigBar } from './AsistenteConfigBar';
import { TabSeccionContent } from './TabSeccionContent';
import { PreviewPanel } from './PreviewPanel';

export function Asistente({ planification }: { planification: Planification }) {
  const router = useRouter();
  const { data: alumno } = useClient(planification.alumnoId ?? '');
  const nombreAlumno =
    planification.alumnoNombre ??
    (alumno ? `${alumno.apellido}, ${alumno.nombre}` : null);
  const state = useAsistenteState(planification);

  const {
    tabActivo,
    setTabActivo,
    diaActivo,
    setDiaActivo,
    dirty,
    upsert,
    frecuenciaBloque,
    getSeccion,
    updateSeccion,
    setCalentamientoOrVuelta,
    countItemsInTab,
    handleSave,
    avanzarTab,
    retrocederTab,
    progresoAsistente,
    contentVersion,
    syncFromServer,
    tabIndex,
  } = state;

  const tabIds = [...WIZARD_TABS.map((t) => t.id), TAB_PREVIEW_ID];
  const idx = tabIds.indexOf(tabActivo);
  const alumnoConProgreso = hasAlumnoSessionProgress(planification.progresoAlumno);
  const { data: materialized } = useMaterializedPlanification(
    alumnoConProgreso ? planification.id : '',
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pb-10">
      <Card className="border-2 border-primary">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              {planification.alumnoId ? (
                <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {nombreAlumno ?? 'Alumno'}
                </p>
              ) : null}
              <h1
                className={`font-bold text-primary sm:text-2xl ${
                  planification.alumnoId ? 'mt-1 text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                }`}
              >
                Asistente de planificación
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {planification.titulo}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/profesor/planificaciones/${planification.id}`)
                }
              >
                Volver
              </Button>
              <Button onClick={handleSave} disabled={!dirty || upsert.isPending}>
                <Save className="size-4" />
                {upsert.isPending ? 'Guardando…' : dirty ? 'Guardar planilla' : 'Sin cambios'}
              </Button>
            </div>
          </div>

          <AsistenteConfigBar
            planificationId={planification.id}
            config={planification.config}
            diaActivo={diaActivo}
            frecuenciaBloque={frecuenciaBloque}
            onDiaChange={setDiaActivo}
          />

          <IndicadorProgreso
            progreso={progresoAsistente.progreso}
            seccionesCompletadas={progresoAsistente.seccionesCompletadas}
            totalSecciones={progresoAsistente.totalSecciones}
          />

          {alumnoConProgreso ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              El alumno completó{' '}
              <strong>{planification.progresoAlumno.completadas.length}</strong>{' '}
              sesión(es) (última: #
              {ultimaSesionCompletadaAlumno(planification.progresoAlumno)}). Para
              cambiar ejercicios usá <strong>⚡ Ajuste desde sesión N</strong>; podés
              avanzar el corte semana a semana sin modificar lo ya entrenado. La edición ✎
              y eliminar 🗑 están bloqueadas. Podés{' '}
              <strong>reordenar</strong> ejercicios con ⋮⋮; el alumno verá el nuevo orden
              al guardar.
            </div>
          ) : null}
        </CardContent>
      </Card>

      {upsert.error ? (
        <Card className="border-destructive bg-red-50">
          <CardContent className="p-4 text-sm text-destructive">
            {(upsert.error as Error).message}
          </CardContent>
        </Card>
      ) : null}

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
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
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
                  planification={planification}
                  seccion={getSeccion(tab.id)}
                  diaActivo={diaActivo}
                  frecuenciaBloque={frecuenciaBloque}
                  contentVersion={contentVersion}
                  progresoAlumno={planification.progresoAlumno}
                  materialized={materialized}
                  onUpdateSeccion={updateSeccion}
                  onUpdateCardio={setCalentamientoOrVuelta}
                  onAdjusted={syncFromServer}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value={TAB_PREVIEW_ID}>
          <PreviewPanel
            planificationId={planification.id}
            config={planification.config}
            needsSave={dirty}
            diaActivo={diaActivo}
            frecuenciaBloque={frecuenciaBloque}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
