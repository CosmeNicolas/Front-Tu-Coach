import { ExerciseExecutionState } from '@/types/alumno-session';
import type { StopwatchSnapshot } from '@/hooks/useStopwatch';

export interface SessionTimerDraft extends StopwatchSnapshot {
  /** elapsedSeconds es solo el tiempo anterior al tramo en curso. */
  baseOnly?: boolean;
}

const PREFIX = 'tucoach:session-draft:';

export interface SessionDraft {
  planificationId: string;
  sessionNum: number;
  updatedAt: number;
  exerciseStates: ExerciseExecutionState[];
  rpe: number | '';
  rpeNote: string;
  sessionComment: string;
  sessionTimer?: SessionTimerDraft;
}

/**
 * Al reabrir, el cronómetro sigue desde runningSince.
 * Los borradores viejos guardaban el total ya sumado y además runningSince.
 */
export function restoreSessionTimer(draft: SessionDraft | null): StopwatchSnapshot {
  const timer = draft?.sessionTimer;
  if (!draft || !timer) return { elapsedSeconds: 0, isRunning: false };

  const elapsed = Math.max(0, Math.floor(timer.elapsedSeconds || 0));
  if (!timer.isRunning || !timer.runningSince) {
    return { elapsedSeconds: elapsed, isRunning: false };
  }

  if (timer.baseOnly) {
    return {
      elapsedSeconds: elapsed,
      isRunning: true,
      runningSince: timer.runningSince,
    };
  }

  const baked = Math.max(
    0,
    Math.floor((draft.updatedAt - timer.runningSince) / 1000),
  );
  return {
    elapsedSeconds: Math.max(0, elapsed - baked),
    isRunning: true,
    runningSince: timer.runningSince,
  };
}

function draftKey(planificationId: string, sessionNum: number): string {
  return `${PREFIX}${planificationId}:${sessionNum}`;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadSessionDraft(
  planificationId: string,
  sessionNum: number,
): SessionDraft | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(draftKey(planificationId, sessionNum));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionDraft;
    if (
      parsed.planificationId !== planificationId ||
      parsed.sessionNum !== sessionNum ||
      !Array.isArray(parsed.exerciseStates)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveSessionDraft(draft: SessionDraft): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      draftKey(draft.planificationId, draft.sessionNum),
      JSON.stringify({ ...draft, updatedAt: Date.now() }),
    );
  } catch {
    // quota / private mode
  }
}

export function clearSessionDraft(
  planificationId: string,
  sessionNum: number,
): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(draftKey(planificationId, sessionNum));
  } catch {
    // ignore
  }
}

export function mergeExerciseStatesWithDraft(
  fromServer: ExerciseExecutionState[],
  draft: SessionDraft | null,
): ExerciseExecutionState[] {
  if (!draft?.exerciseStates?.length) return fromServer;

  const draftById = new Map(
    draft.exerciseStates.map((e) => [e.exerciseId, e]),
  );

  return fromServer.map((row) => {
    const saved = draftById.get(row.exerciseId);
    if (!saved) return row;
    return {
      ...row,
      completed: saved.completed,
      note: saved.note ?? '',
      pesoUsadoKg:
        saved.pesoUsadoKg != null && Number.isFinite(saved.pesoUsadoKg)
          ? saved.pesoUsadoKg
          : row.pesoUsadoKg,
      exerciseTimeSeconds: saved.exerciseTimeSeconds ?? row.exerciseTimeSeconds,
      restTimeSeconds: saved.restTimeSeconds ?? row.restTimeSeconds,
    };
  });
}
