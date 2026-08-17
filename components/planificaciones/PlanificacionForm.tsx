'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';
import { usePlanBaseline } from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';
import { PlanificacionConfigFields } from '@/components/planificaciones/PlanificacionConfigFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreatePlanificationPayload,
  PlanificationConfig,
  PlanificationProgress,
  ProgressionMode,
} from '@/types/planification';
import { getUltimaSesionFeedback } from '@/lib/planification/exercise-progress-context';
import {
  AlumnoFeedbackResumen,
  hasAlumnoFeedbackContent,
} from '@/components/planificaciones/shared/AlumnoFeedbackResumen';

interface PlanificacionFormProps {
  initialAlumnoId?: string;
  initialTitulo?: string;
  initialConfig?: PlanificationConfig;
  /** Si viene de "renovar", preselecciona importar plan anterior */
  initialFromPlanId?: string;
  initialOrigen?: 'vacio' | 'anterior';
  submitLabel: string;
  onSubmit: (payload: CreatePlanificationPayload) => Promise<void>;
}

const DEFAULT_CONFIG: PlanificationConfig = {
  semanasDelPlan: 1,
  frecuenciaSemanal: 3,
  totalSesiones: 3,
  modoProgresion: ProgressionMode.BLOQUE_X3,
};

type ImportScope = 'full' | 'sections';

export function PlanificacionForm({
  initialAlumnoId,
  initialTitulo,
  initialConfig,
  initialFromPlanId,
  initialOrigen,
  submitLabel,
  onSubmit,
}: PlanificacionFormProps) {
  const { data: clientsData } = useClients();
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState(initialTitulo ?? '');
  const [alumnoId, setAlumnoId] = useState(initialAlumnoId ?? '');
  const [config, setConfig] = useState(initialConfig ?? DEFAULT_CONFIG);
  const [origen, setOrigen] = useState<'vacio' | 'anterior'>(
    initialOrigen ?? (initialFromPlanId ? 'anterior' : 'vacio'),
  );
  const [importScope, setImportScope] = useState<ImportScope>('full');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [appliedBaselineId, setAppliedBaselineId] = useState<string | null>(
    null,
  );

  const { data: baseline, isFetching: loadingBaseline } = usePlanBaseline(
    alumnoId || undefined,
  );

  const canImportPrevious = Boolean(
    baseline?.available && (baseline.totalEjercicios ?? 0) > 0,
  );

  const baselineSections = useMemo(
    () => baseline?.secciones ?? [],
    [baseline?.secciones],
  );

  const baselineFeedback = useMemo(() => {
    if (!baseline?.progresoAlumno) return null;
    return getUltimaSesionFeedback(baseline.progresoAlumno as PlanificationProgress);
  }, [baseline?.progresoAlumno]);

  useEffect(() => {
    if (!baseline?.available || !baseline.planificationId) return;
    if (appliedBaselineId === baseline.planificationId) return;

    if (baseline.config) {
      setConfig(baseline.config);
    }
    if (!titulo.trim() && baseline.titulo) {
      setTitulo(`Nueva — ${baseline.titulo}`);
    }
    if (
      initialOrigen === 'anterior' ||
      initialFromPlanId ||
      baseline.solicitudRevisionPendiente
    ) {
      setOrigen('anterior');
    }
    setSelectedSections((baseline.secciones ?? []).map((s) => s.titulo));
    setImportScope('full');
    setAppliedBaselineId(baseline.planificationId);
  }, [
    baseline,
    appliedBaselineId,
    titulo,
    initialOrigen,
    initialFromPlanId,
  ]);

  useEffect(() => {
    if (!canImportPrevious && origen === 'anterior') {
      setOrigen('vacio');
    }
  }, [canImportPrevious, origen]);

  function toggleSection(tituloSec: string, checked: boolean) {
    setSelectedSections((prev) =>
      checked
        ? prev.includes(tituloSec)
          ? prev
          : [...prev, tituloSec]
        : prev.filter((t) => t !== tituloSec),
    );
  }

  function handleAlumnoChange(nextId: string) {
    setAlumnoId(nextId === '__none__' ? '' : nextId);
    setAppliedBaselineId(null);
    setOrigen('vacio');
    setSelectedSections([]);
    setImportScope('full');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alumnoId) {
      toast.error('Seleccioná un alumno');
      return;
    }
    if (origen === 'anterior' && !canImportPrevious) {
      toast.error('Este alumno no tiene un plan anterior con ejercicios');
      return;
    }
    if (
      origen === 'anterior' &&
      importScope === 'sections' &&
      selectedSections.length === 0
    ) {
      toast.error('Seleccioná al menos una sección para importar');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        titulo,
        alumnoId,
        config,
        origen,
        fromPlanificationId:
          origen === 'anterior'
            ? initialFromPlanId || baseline?.planificationId
            : undefined,
        sectionTitulos:
          origen === 'anterior' && importScope === 'sections'
            ? selectedSections
            : undefined,
      });
      toast.success(
        origen === 'anterior'
          ? importScope === 'sections'
            ? 'Planificación creada con las secciones elegidas'
            : 'Planificación creada con ejercicios del plan anterior'
          : 'Planificación guardada',
      );
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo guardar',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto flex max-w-xl flex-col gap-6"
    >
      <div className="space-y-2">
        <Label htmlFor="plan-titulo">Título</Label>
        <Input
          id="plan-titulo"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Plan mes de junio"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-alumno">Alumno</Label>
        <Select
          value={alumnoId || '__none__'}
          onValueChange={handleAlumnoChange}
        >
          <SelectTrigger id="plan-alumno">
            <SelectValue placeholder="Seleccionar alumno…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Seleccionar alumno…</SelectItem>
            {(clientsData?.items ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.apellido}, {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {alumnoId ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Punto de partida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingBaseline ? (
              <p className="text-sm text-muted-foreground">
                Buscando plan anterior…
              </p>
            ) : canImportPrevious ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Último plan:{' '}
                  <span className="font-medium text-foreground">
                    {baseline?.titulo}
                  </span>
                  {' · '}
                  {baseline?.totalEjercicios} ejercicios
                  {' · '}
                  {baseline?.sesionesCompletadas}/{baseline?.totalSesiones}{' '}
                  sesiones
                  {baseline?.solicitudRevisionPendiente
                    ? ' · solicitud pendiente'
                    : ''}
                </p>

                {hasAlumnoFeedbackContent(baselineFeedback) ? (
                  <div className="rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2.5 dark:border-sky-900/50 dark:bg-sky-950/30">
                    <AlumnoFeedbackResumen
                      feedback={baselineFeedback}
                      title={`Feedback del alumno · última sesión #${baselineFeedback.sessionNum}${baselineFeedback.rpe !== null ? ` · RPE ${baselineFeedback.rpe}` : ''}`}
                      showExerciseNotesHint
                    />
                  </div>
                ) : null}

                <RadioGroup
                  value={origen}
                  onValueChange={(value) =>
                    setOrigen(value as 'vacio' | 'anterior')
                  }
                  className="gap-3"
                >
                  <label
                    htmlFor="origen-anterior"
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/40"
                  >
                    <RadioGroupItem
                      id="origen-anterior"
                      value="anterior"
                      className="mt-0.5"
                    />
                    <span className="min-w-0 space-y-1">
                      <span className="block text-sm font-medium text-foreground">
                        Importar plan anterior
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        Copia ejercicios (incl. biseries) con la última carga
                        materializada. La planificación activa se archiva.
                      </span>
                    </span>
                  </label>

                  <label
                    htmlFor="origen-vacio"
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/40"
                  >
                    <RadioGroupItem
                      id="origen-vacio"
                      value="vacio"
                      className="mt-0.5"
                    />
                    <span className="min-w-0 space-y-1">
                      <span className="block text-sm font-medium text-foreground">
                        Empezar vacío
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        Planilla en blanco. La planificación activa también se
                        archiva.
                      </span>
                    </span>
                  </label>
                </RadioGroup>

                {origen === 'anterior' ? (
                  <div className="space-y-3 border-t border-border pt-3">
                    <RadioGroup
                      value={importScope}
                      onValueChange={(value) =>
                        setImportScope(value as ImportScope)
                      }
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="scope-full" value="full" />
                        <Label htmlFor="scope-full" className="font-normal">
                          Todo el plan
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="scope-sections" value="sections" />
                        <Label htmlFor="scope-sections" className="font-normal">
                          Solo secciones elegidas
                        </Label>
                      </div>
                    </RadioGroup>

                    {importScope === 'sections' ? (
                      <ul className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border bg-background p-2">
                        {baselineSections.map((sec) => {
                          const checked = selectedSections.includes(sec.titulo);
                          const checkboxId = `sec-${sec.titulo}`;
                          return (
                            <li key={sec.titulo}>
                              <label
                                htmlFor={checkboxId}
                                className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted"
                              >
                                <Checkbox
                                  id={checkboxId}
                                  checked={checked}
                                  onCheckedChange={(state) =>
                                    toggleSection(sec.titulo, state === true)
                                  }
                                  className="mt-0.5"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="font-medium text-foreground">
                                    {sec.titulo}
                                  </span>
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {sec.totalEjercicios} ejercicio
                                    {sec.totalEjercicios === 1 ? '' : 's'}
                                    {sec.items[0]?.ultimaCarga
                                      ? ` · ej. ${sec.items[0].ultimaCarga}`
                                      : ''}
                                  </span>
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {origen === 'anterior' &&
                baseline?.config &&
                (baseline.config.modoProgresion !== config.modoProgresion ||
                  baseline.config.frecuenciaSemanal !==
                    config.frecuenciaSemanal) ? (
                  <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                    Cambiaste modo o frecuencia respecto del plan anterior. Se
                    ajustará el día de cada ejercicio; si falla la validación,
                    mantené la misma config o empezá vacío.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este alumno no tiene un plan anterior con ejercicios. Podés
                empezar vacío o asignar una plantilla desde Plantillas.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}

      <PlanificacionConfigFields value={config} onChange={setConfig} />

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading
          ? 'Guardando…'
          : origen === 'anterior'
            ? importScope === 'sections'
              ? 'Crear e importar secciones'
              : 'Crear e importar plan anterior'
            : submitLabel}
      </Button>
    </form>
  );
}
