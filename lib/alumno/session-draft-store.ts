import { ExerciseExecutionState } from '@/types/alumno-session';
import { StopwatchSnapshot } from '@/hooks/useStopwatch';

const PREFIX = 'tucoach:session-draft:';

export interface SessionDraft {
  planificationId: string;
  sessionNum: number;
  updatedAt: number;
  exerciseStates: ExerciseExecutionState[];
  rpe: number | '';
  rpeNote: string;
  sessionComment: string;
  sessionTimer?: StopwatchSnapshot;
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
      exerciseTimeSeconds: saved.exerciseTimeSeconds ?? row.exerciseTimeSeconds,
      restTimeSeconds: saved.restTimeSeconds ?? row.restTimeSeconds,
    };
  });
}
