'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StudentMaterializedPlanification, StudentPlanification } from '@/lib/api/student-portal';
import { isSessionCompleted } from '@/lib/api/student-portal';
import { flattenSessionToBlocks, countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { getSessionLog, initExerciseStateFromLog } from '@/lib/alumno/metrics';
import {
  clearSessionDraft,
  loadSessionDraft,
  mergeExerciseStatesWithDraft,
  saveSessionDraft,
} from '@/lib/alumno/session-draft-store';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { useCompleteSession } from '@/hooks/useStudentPortal';
import { ExerciseExecutionState } from '@/types/alumno-session';
import { ApiError } from '@/lib/api/client';
import { AlumnoBloqueSeccion } from './AlumnoBloqueSeccion';
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
  const [pendingDialogOpen, setPendingDialogOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

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
    });
  }, [
    readOnly,
    plan.id,
    sessionNum,
    exerciseStates,
    rpe,
    rpeNote,
    sessionComment,
  ]);

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

  function updateExercise(id: string, patch: Partial<ExerciseExecutionState>) {
    setExerciseStates((prev) =>
      prev.map((e) => (e.exerciseId === id ? { ...e, ...patch } : e)),
    );
  }

  async function submitSession() {
    try {
      await complete.mutateAsync({
        sessionNum,
        payload: {
          rpe: { value: rpe as number, note: rpeNote.trim() || undefined },
          sessionComment: sessionComment.trim() || undefined,
          exercises: exerciseStates.map((e) => ({
            exerciseId: e.exerciseId,
            name: e.name,
            completed: e.completed,
            note: e.note.trim() || undefined,
          })),
        },
      });
      clearSessionDraft(plan.id, sessionNum);
      setPendingDialogOpen(false);
      toast.success('Sesión completada', {
        description: `La sesión ${sessionNum} se guardó correctamente.`,
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

      <header className="rounded-xl border border-border bg-card p-4">
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
        <div className="mt-3">
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
      </header>

      <div className="space-y-3">
        {blocks.map((block) => (
          <AlumnoBloqueSeccion
            key={`${block.tipoSeccion}-${block.titulo}`}
            block={block}
            exerciseStates={exerciseStates}
            readOnly={readOnly}
            defaultOpen
            onToggle={(id, c) => updateExercise(id, { completed: c })}
            onNote={(id, n) => updateExercise(id, { note: n })}
          />
        ))}
      </div>

      <AlumnoRpeForm
        rpe={rpe}
        rpeNote={rpeNote}
        sessionComment={sessionComment}
        readOnly={readOnly}
        isPending={complete.isPending}
        onRpe={setRpe}
        onRpeNote={setRpeNote}
        onSessionComment={setSessionComment}
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
