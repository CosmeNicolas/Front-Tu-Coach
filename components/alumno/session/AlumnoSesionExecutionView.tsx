'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StudentMaterializedPlanification, StudentPlanification } from '@/lib/api/student-portal';
import { isSessionCompleted } from '@/lib/api/student-portal';
import { flattenSessionToBlocks, countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { getSessionLog, initExerciseStateFromLog } from '@/lib/alumno/metrics';
import { calcSessionVolumeKg } from '@/lib/alumno/volume';
import {
  clearSessionDraft,
  loadSessionDraft,
  mergeExerciseStatesWithDraft,
  saveSessionDraft,
} from '@/lib/alumno/session-draft-store';
import { formatSessionClock } from '@/lib/alumno/format-time';
import { useStopwatch } from '@/hooks/useStopwatch';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { useCompleteSession } from '@/hooks/useStudentPortal';
import { ExerciseExecutionState } from '@/types/alumno-session';
import { ApiError } from '@/lib/api/client';
import { AlumnoBloqueSeccion } from './AlumnoBloqueSeccion';
import { AlumnoSessionStopwatch } from './AlumnoSessionStopwatch';
import { AlumnoRpeForm } from './AlumnoRpeForm';
import { AlumnoPendingExercisesDialog } from './AlumnoPendingExercisesDialog';
import { Button } from '@/components/ui/button';

interface Props {
  plan: StudentPlanification;
  materialized: StudentMaterializedPlanification;
  sessionNum: number;
}

export function AlumnoSesionExecutionView({
  plan,
  materialized,
  sessionNum,
}: Props) {
  const router = useRouter();
  const complete = useCompleteSession(plan.id);
  const sesion = materialized.sesiones.find((s) => s.numero === sessionNum);
  const readOnly = isSessionCompleted(materialized.progreso, sessionNum);

  const blocks = useMemo(
    () => (sesion ? flattenSessionToBlocks(sesion) : []),
    [sesion],
  );

  const allExercises = useMemo(
    () => blocks.flatMap((b) => b.exercises),
    [blocks],
  );

  const sessionLog = getSessionLog(materialized.progreso, sessionNum);
  const localDraft = readOnly ? null : loadSessionDraft(plan.id, sessionNum);

  const [exerciseStates, setExerciseStates] = useState<ExerciseExecutionState[]>(
    () =>
      mergeExerciseStatesWithDraft(
        initExerciseStateFromLog(allExercises, sessionLog),
        localDraft,
      ),
  );

  const [rpe, setRpe] = useState<number | ''>(() => {
    if (localDraft?.rpe !== undefined && localDraft.rpe !== '') {
      return localDraft.rpe;
    }
    return (
      sessionLog?.rpe?.value ??
      materialized.progreso.rpePorSesion[String(sessionNum)] ??
      ''
    );
  });
  const [rpeNote, setRpeNote] = useState(
    localDraft?.rpeNote ?? sessionLog?.rpe?.note ?? '',
  );
  const [sessionComment, setSessionComment] = useState(
    localDraft?.sessionComment ??
      sessionLog?.sessionComment ??
      materialized.progreso.comentarios[sessionNum - 1] ??
      '',
  );
  const [notifyProfessor, setNotifyProfessor] = useState(false);
  const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeRestExerciseId, setActiveRestExerciseId] = useState<string | null>(
    null,
  );
  const sessionHeaderRef = useRef<HTMLElement>(null);
  const [sessionHeaderHeight, setSessionHeaderHeight] = useState(132);

  const savedSessionSeconds = sessionLog?.sessionDurationSeconds ?? 0;
  const sessionTimer = useStopwatch(
    readOnly
      ? { elapsedSeconds: savedSessionSeconds, isRunning: false }
      : (localDraft?.sessionTimer ?? { elapsedSeconds: 0, isRunning: false }),
  );

  useLayoutEffect(() => {
    const el = sessionHeaderRef.current;
    if (!el) return;

    const updateHeight = () => {
      setSessionHeaderHeight(el.offsetHeight);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [readOnly, sesion?.diaBase, sesion?.numero]);

  useEffect(() => {
    if (readOnly) return;
    saveSessionDraft({
      planificationId: plan.id,
      sessionNum,
      updatedAt: Date.now(),
      exerciseStates,
      rpe,
      rpeNote,
      sessionComment,
      sessionTimer: sessionTimer.getSnapshot(),
    });
  }, [
    readOnly,
    plan.id,
    sessionNum,
    exerciseStates,
    rpe,
    rpeNote,
    sessionComment,
    sessionTimer.elapsedSeconds,
    sessionTimer.isRunning,
  ]);

  const patchExercise = useCallback(
    (id: string, patch: Partial<ExerciseExecutionState>) => {
      setExerciseStates((prev) => {
        const current = prev.find((e) => e.exerciseId === id);
        if (!current) return prev;

        const hasChange = (
          Object.keys(patch) as (keyof ExerciseExecutionState)[]
        ).some((key) => current[key] !== patch[key]);
        if (!hasChange) return prev;

        return prev.map((e) => (e.exerciseId === id ? { ...e, ...patch } : e));
      });
    },
    [],
  );

  const handleToggleExercise = useCallback(
    (id: string, completed: boolean) => patchExercise(id, { completed }),
    [patchExercise],
  );

  const handleNoteExercise = useCallback(
    (id: string, note: string) => patchExercise(id, { note }),
    [patchExercise],
  );

  const handleWorkTimeChange = useCallback(
    (id: string, exerciseTimeSeconds: number) =>
      patchExercise(id, { exerciseTimeSeconds }),
    [patchExercise],
  );

  const handleRestTimeChange = useCallback(
    (id: string, restTimeSeconds: number) =>
      patchExercise(id, { restTimeSeconds }),
    [patchExercise],
  );

  const handleRestStart = useCallback(
    (id: string) => setActiveRestExerciseId(id),
    [],
  );

  const handleRestEnd = useCallback(() => setActiveRestExerciseId(null), []);

  if (!sesion) {
    return (
      <p className="text-sm text-destructive">Sesión no encontrada.</p>
    );
  }

  const totalEx = countSessionExercises(sesion);
  const doneEx = exerciseStates.filter((e) => e.completed).length;
  const sessionPct = totalEx > 0 ? Math.round((doneEx / totalEx) * 100) : 0;

  const prevN = sessionNum > 1 ? sessionNum - 1 : null;
  const nextN = sessionNum < materialized.totalSesiones ? sessionNum + 1 : null;

  async function submitSession() {
    const sessionDurationSeconds = sessionTimer.getSnapshot().elapsedSeconds;
    if (sessionTimer.isRunning) {
      sessionTimer.pause();
    }
    const completedById = new Map(
      exerciseStates.map((e) => [e.exerciseId, e.completed]),
    );
    const totalVolumeKg = calcSessionVolumeKg(allExercises, completedById);

    try {
      await complete.mutateAsync({
        sessionNum,
        payload: {
          rpe: { value: rpe as number, note: rpeNote.trim() || undefined },
          sessionComment: sessionComment.trim() || undefined,
          notifyProfessor:
            Boolean(sessionComment.trim()) && notifyProfessor,
          sessionDurationSeconds,
          totalVolumeKg,
          exercises: exerciseStates.map((e) => ({
            exerciseId: e.exerciseId,
            name: e.name,
            completed: e.completed,
            note: e.note.trim() || undefined,
            exerciseTimeSeconds: e.exerciseTimeSeconds || undefined,
            restTimeSeconds: e.restTimeSeconds || undefined,
          })),
        },
      });
      clearSessionDraft(plan.id, sessionNum);
      setPendingDialogOpen(false);
      toast.success('Sesión completada', {
        description:
          sessionDurationSeconds > 0
            ? `Tiempo registrado: ${formatSessionClock(sessionDurationSeconds)}. Lo vas a ver en Métricas.`
            : `La sesión ${sessionNum} se guardó correctamente.`,
      });
      router.push('/alumno/mi-planificacion');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo completar la sesión. Intentá de nuevo.';
      toast.error('Error al guardar la sesión', { description: message });
    }
  }

  function handleFinalize() {
    if (rpe === '' || rpe < 1 || rpe > 10) {
      toast.error('RPE obligatorio', {
        description: 'Seleccioná un valor entre 1 y 10 para finalizar la sesión.',
      });
      return;
    }

    if (sessionTimer.elapsedSeconds === 0) {
      toast.message('Cronómetro de sesión', {
        description:
          'No registraste tiempo de sesión. Podés iniciarlo arriba a la derecha antes de finalizar.',
      });
    }

    const pending = exerciseStates.filter((e) => !e.completed).length;
    if (pending > 0) {
      setPendingCount(pending);
      setPendingDialogOpen(true);
      return;
    }

    void submitSession();
  }

  function handleConfirmWithPending() {
    void submitSession();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-24">
      <Link
        href="/alumno/sesiones"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver al historial
      </Link>

      <div
        className="fixed inset-x-0 top-(--alumno-sticky-top) z-20 px-4 sm:px-6"
        aria-live="polite"
      >
        <header
          ref={sessionHeaderRef}
          className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {readOnly ? 'Sesión completada' : 'En entrenamiento'}
          </p>
          <h1 className="text-xl font-bold text-foreground">
            Sesión {sesion.numero} de {materialized.totalSesiones}
          </h1>
          {sesion.diaBase ? (
            <p className="text-sm text-primary">
              {etiquetaDia(plan.config.modoProgresion, sesion.diaBase)}
              {' · '}
              Semana {sesion.semanaDelPlan} · Día {sesion.dayIndexInWeek}
            </p>
          ) : null}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Ejercicios de esta sesión</span>
                <span>
                  {doneEx}/{totalEx} ({sessionPct}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${sessionPct}%` }}
                />
              </div>
            </div>
            <AlumnoSessionStopwatch
              elapsedSeconds={
                readOnly ? savedSessionSeconds : sessionTimer.elapsedSeconds
              }
              isRunning={!readOnly && sessionTimer.isRunning}
              readOnly={readOnly}
              onStart={sessionTimer.start}
              onPause={sessionTimer.pause}
              onReset={sessionTimer.reset}
            />
          </div>
        </header>
      </div>

      <div
        aria-hidden
        className="shrink-0"
        style={{ height: sessionHeaderHeight }}
      />

      <div className="space-y-3">
        {blocks.map((block) => (
          <AlumnoBloqueSeccion
            key={`${block.tipoSeccion}-${block.titulo}`}
            block={block}
            exerciseStates={exerciseStates}
            readOnly={readOnly}
            defaultOpen
            onToggle={handleToggleExercise}
            onNote={handleNoteExercise}
            onWorkTimeChange={handleWorkTimeChange}
            onRestTimeChange={handleRestTimeChange}
            activeRestExerciseId={activeRestExerciseId}
            onRestStart={handleRestStart}
            onRestEnd={handleRestEnd}
          />
        ))}
      </div>

      <AlumnoRpeForm
        rpe={rpe}
        rpeNote={rpeNote}
        sessionComment={sessionComment}
        notifyProfessor={notifyProfessor}
        readOnly={readOnly}
        isPending={complete.isPending}
        onRpe={setRpe}
        onRpeNote={setRpeNote}
        onSessionComment={setSessionComment}
        onNotifyProfessor={setNotifyProfessor}
        onSubmit={handleFinalize}
      />

      <AlumnoPendingExercisesDialog
        open={pendingDialogOpen}
        onOpenChange={setPendingDialogOpen}
        pendingCount={pendingCount}
        onConfirm={handleConfirmWithPending}
        isSubmitting={complete.isPending}
      />

      <nav className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {prevN ? (
          <Button variant="outline" asChild>
            <Link href={`/alumno/sesiones/${prevN}`}>← Sesión {prevN}</Link>
          </Button>
        ) : (
          <span />
        )}
        {nextN && !readOnly ? (
          <Button variant="outline" asChild>
            <Link href={`/alumno/sesiones/${nextN}`}>Sesión {nextN} →</Link>
          </Button>
        ) : nextN ? (
          <Button variant="outline" asChild>
            <Link href={`/alumno/sesiones/${nextN}`}>Ver sesión {nextN} →</Link>
          </Button>
        ) : null}
      </nav>
    </div>
  );
}
