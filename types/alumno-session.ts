import {
  MaterializedItem,
  MaterializedSectionGroup,
  MaterializedSession,
  TipoSeccion,
} from '@/types/planification';

export interface SessionExerciseLog {
  exerciseId: string;
  name: string;
  completed: boolean;
  note: string;
}

export interface SessionRpeLog {
  value: number;
  note: string;
}

export interface SessionExecutionLog {
  rpe?: SessionRpeLog;
  sessionComment: string;
  exercises: SessionExerciseLog[];
}

export interface StudentProgressExtended {
  completadas: number[];
  fechas: string[];
  rpePorSesion: Record<string, number>;
  comentarios: string[];
  detallePorSesion: Record<string, SessionExecutionLog>;
}

export interface FlatExerciseRow {
  exerciseId: string;
  name: string;
  valor: string;
  gif?: string | null;
  notas?: string | null;
  tipoItem: MaterializedItem['tipoItem'];
  unidadTrabajo: MaterializedItem['unidadTrabajo'];
  parametros: MaterializedItem['parametros'];
  sectionType: TipoSeccion;
  sectionTitle: string;
  grupoLabel?: string;
}

export interface SessionSectionBlock {
  tipoSeccion: TipoSeccion;
  titulo: string;
  exercises: FlatExerciseRow[];
}

export interface ParsedExerciseParams {
  pesoKg: string | null;
  series: string | null;
  reps: string | null;
  minutos: string | null;
  segundos: string | null;
  display: string;
}

export interface ExerciseExecutionState {
  exerciseId: string;
  name: string;
  completed: boolean;
  note: string;
}

export interface CompleteSessionPayloadV2 {
  rpe: { value: number; note?: string };
  sessionComment?: string;
  exercises: Array<{
    exerciseId: string;
    name: string;
    completed: boolean;
    note?: string;
  }>;
}
