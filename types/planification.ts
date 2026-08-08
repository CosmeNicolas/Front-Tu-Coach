export enum PlanificationStatus {
  ACTIVE = 'activa',
  CLOSED = 'cerrada',
  ARCHIVED = 'archivada',
}

export enum ProgressionMode {
  LINEAL = 'lineal',
  BLOQUE_X2 = 'bloqueX2',
  BLOQUE_X3 = 'bloqueX3',
  BLOQUE_X4 = 'bloqueX4',
  BLOQUE_X5 = 'bloqueX5',
}

export enum TipoSeccion {
  CALENTAMIENTO = 'calentamiento',
  PRINCIPAL = 'principal',
  VUELTA_CALMA = 'vuelta_calma',
}

export enum TipoItem {
  FUERZA = 'fuerza',
  AEROBICO = 'aerobico',
  ISOMETRICO = 'isometrico',
  MOVILIDAD = 'movilidad',
}

export enum UnidadTrabajo {
  REPS = 'reps',
  SEG = 'seg',
  MIN = 'min',
}

export const BLOQUE_MODE_FREQUENCY: Partial<Record<ProgressionMode, number>> = {
  [ProgressionMode.BLOQUE_X2]: 2,
  [ProgressionMode.BLOQUE_X3]: 3,
  [ProgressionMode.BLOQUE_X4]: 4,
  [ProgressionMode.BLOQUE_X5]: 5,
};

export const PROGRESSION_MODE_LABELS: Record<ProgressionMode, string> = {
  [ProgressionMode.LINEAL]: 'Lineal',
  [ProgressionMode.BLOQUE_X2]: 'Bloque x2 (MS/MI)',
  [ProgressionMode.BLOQUE_X3]: 'Bloque x3',
  [ProgressionMode.BLOQUE_X4]: 'Bloque x4',
  [ProgressionMode.BLOQUE_X5]: 'Bloque x5',
};

export const TIPO_ITEM_LABELS: Record<TipoItem, string> = {
  [TipoItem.FUERZA]: 'Fuerza',
  [TipoItem.AEROBICO]: 'Aeróbico',
  [TipoItem.ISOMETRICO]: 'Isométrico',
  [TipoItem.MOVILIDAD]: 'Movilidad',
};

export interface PlanificationConfig {
  semanasDelPlan: number;
  frecuenciaSemanal: number;
  totalSesiones: number;
  modoProgresion: ProgressionMode;
}

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

export interface PlanificationProgress {
  completadas: number[];
  fechas: string[];
  rpePorSesion: Record<string, number>;
  comentarios: string[];
  detallePorSesion?: Record<string, SessionExecutionLog>;
}

export interface ParametrosItem {
  series?: number;
  reps?: number;
  /** Tope de series antes de subir peso (progresión fuerza). */
  seriesMax?: number;
  /** Tope de repeticiones antes de subir series (progresión fuerza). */
  repsMax?: number;
  peso?: number;
  segundos?: number;
  minutos?: number;
  descanso?: number;
}

export interface ProgresionItem {
  incrementoPeso?: number;
  incrementoReps?: number;
  incrementoSegundos?: number;
  incrementoMinutos?: number;
}

export interface ItemAjusteMetadata {
  desdeSesion: number;
  tipo: 'reemplazo' | 'parametros';
  ejercicioAnterior: string;
  gifAnterior?: string | null;
  tipoItemAnterior?: TipoItem;
  unidadTrabajoAnterior?: UnidadTrabajo;
  parametrosAnteriores: ParametrosItem;
  progresionAnterior?: ProgresionItem;
  aplicadoEn?: string;
}

export interface PlanificationItemSingle {
  id: string;
  kind: 'single';
  ejercicio: string;
  tipoItem: TipoItem;
  unidadTrabajo: UnidadTrabajo;
  parametros: ParametrosItem;
  progresion?: ProgresionItem;
  diaBase?: number;
  gif?: string | null;
  notas?: string | null;
  ajuste?: ItemAjusteMetadata;
}

export type TipoGrupo = 'biserie' | 'triserie';

export interface PlanificationItemGroup {
  id: string;
  kind: 'group';
  tipoGrupo: TipoGrupo;
  diaBase?: number;
  items: PlanificationItemSingle[];
}

export type PlanificationSectionItem =
  | PlanificationItemSingle
  | PlanificationItemGroup;

/** @deprecated Usar PlanificationItemSingle */
export type PlanificationItem = PlanificationItemSingle;

export interface PlanificationSection {
  tipoSeccion: TipoSeccion;
  titulo: string;
  orden?: number;
  items: PlanificationSectionItem[];
}

export interface Planification {
  id: string;
  tenantId: string;
  profesorId: string;
  alumnoId: string | null;
  /** Presente en GET /planifications/:id */
  alumnoNombre?: string | null;
  titulo: string;
  nombrePlantilla?: string | null;
  categoriaPlantilla?: string | null;
  descripcionPlantilla?: string | null;
  estado: PlanificationStatus;
  esPlantilla: boolean;
  version: number;
  contentVersion: number;
  config: PlanificationConfig;
  secciones: PlanificationSection[];
  progresoAlumno: PlanificationProgress;
  solicitudRevisionAt?: string | null;
  solicitudRevisionMensaje?: string | null;
  solicitudRevisionResueltaAt?: string | null;
  solicitudRevisionPendiente?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanificationPayload {
  titulo: string;
  alumnoId: string;
  config: PlanificationConfig;
}

export type UpdatePlanificationPayload = {
  titulo?: string;
  config?: PlanificationConfig;
  estado?: PlanificationStatus;
};

export interface UpsertSeccionesPayload {
  secciones: PlanificationSection[];
  requireFijas?: boolean;
  expectedContentVersion?: number;
}

export interface SetCalentamientoPayload {
  ejercicio: string;
  minutosIniciales: number;
  incrementoMinutos?: number;
  gif?: string;
}

export interface SetVueltaCalmaPayload {
  ejercicio: string;
  minutosIniciales: number;
  incrementoMinutos?: number;
  gif?: string;
}

export interface MaterializedItem {
  kind?: 'single';
  itemId?: string;
  ejercicio: string;
  tipoItem: TipoItem;
  unidadTrabajo: UnidadTrabajo;
  valor: string;
  parametros: ParametrosItem;
  diaBase?: number;
  gif?: string | null;
  notas?: string | null;
  ajusteDesdeSesion?: number;
  esPreAjuste?: boolean;
  ejercicioAnterior?: string;
  gifAnterior?: string | null;
}

export interface MaterializedItemGroup {
  kind: 'group';
  tipoGrupo: TipoGrupo;
  grupoId: string;
  diaBase?: number;
  items: MaterializedItem[];
}

export type MaterializedSectionEntry =
  | MaterializedItem
  | MaterializedItemGroup;

export interface MaterializedSectionGroup {
  tipoSeccion: TipoSeccion;
  titulo: string;
  items: MaterializedSectionEntry[];
}

export interface MaterializedSession {
  numero: number;
  diaBase: number;
  semanaDelPlan: number;
  dayIndexInWeek: number;
  secciones: MaterializedSectionGroup[];
}

export interface MaterializedPlanification {
  planificationId: string;
  contentVersion: number;
  updatedAt: string;
  totalSesiones: number;
  sesiones: MaterializedSession[];
}

export interface PaginatedPlanifications {
  items: Planification[];
  total: number;
  page: number;
  limit: number;
}

export interface ItemAdjustmentCambios {
  ejercicio?: string;
  gif?: string | null;
  tipoItem?: TipoItem;
  unidadTrabajo?: UnidadTrabajo;
  parametros?: ParametrosItem;
  progresion?: ProgresionItem;
}

export interface CreateItemAdjustmentPayload {
  fromSession: number;
  motivo?: string;
  expectedContentVersion?: number;
  cambios: ItemAdjustmentCambios;
}

export interface PlanificationAdjustmentRecord {
  id: string;
  planificationId: string;
  itemId: string;
  seccionTitulo: string;
  tipo: 'reemplazo' | 'parametros';
  fromSession: number;
  motivo: string;
  ejercicioAntes: string;
  ejercicioDespues: string;
  gifAntes?: string | null;
  gifDespues?: string | null;
  changedFields: Record<string, { oldValue: string; newValue: string }>;
  createdAt: string;
}

export interface CreateItemAdjustmentResult {
  planification: Planification;
  adjustment: PlanificationAdjustmentRecord;
}

export function computeTotalSesiones(
  semanasDelPlan: number,
  frecuenciaSemanal: number,
): number {
  return semanasDelPlan * frecuenciaSemanal;
}

export function getFrecuenciaForMode(modo: ProgressionMode): number | null {
  return BLOQUE_MODE_FREQUENCY[modo] ?? null;
}
