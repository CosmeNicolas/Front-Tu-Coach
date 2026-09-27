export enum StandardPlanLevel {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

export enum StandardPlanTemplateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export const STANDARD_PLAN_LEVEL_LABELS: Record<StandardPlanLevel, string> = {
  [StandardPlanLevel.PRINCIPIANTE]: 'Principiante',
  [StandardPlanLevel.INTERMEDIO]: 'Intermedio',
  [StandardPlanLevel.AVANZADO]: 'Avanzado',
};

export const STANDARD_PLAN_STATUS_LABELS: Record<
  StandardPlanTemplateStatus,
  string
> = {
  [StandardPlanTemplateStatus.DRAFT]: 'Borrador',
  [StandardPlanTemplateStatus.PUBLISHED]: 'Publicado',
  [StandardPlanTemplateStatus.ARCHIVED]: 'Archivado',
};

export interface StandardPlanTemplate {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagenUrl?: string | null;
  objetivo: string;
  nivel: StandardPlanLevel;
  precioArs: number;
  config: {
    semanasDelPlan: number;
    frecuenciaSemanal: number;
    totalSesiones: number;
    modoProgresion: string;
  };
  secciones: unknown[];
  status: StandardPlanTemplateStatus;
  publishedAt?: string | null;
  contentVersion: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StandardPlanTemplatesList {
  items: StandardPlanTemplate[];
  total: number;
}

export interface CreateStandardPlanPayload {
  slug: string;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  objetivo: string;
  nivel: StandardPlanLevel;
  precioArs: number;
  config: {
    semanasDelPlan: number;
    frecuenciaSemanal: number;
    totalSesiones: number;
    modoProgresion: string;
  };
}

export type UpdateStandardPlanPayload = Partial<CreateStandardPlanPayload> & {
  expectedContentVersion?: number;
  secciones?: unknown[];
};
