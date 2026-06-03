export type PrivateExerciseMediaType = 'gif' | 'mp4' | 'webm' | 'image';

export interface PrivateExercise {
  id: string;
  tenantId: string;
  profesorId: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  mediaUrl: string;
  mediaType: PrivateExerciseMediaType;
  activo: boolean;
  profesorNombre?: string | null;
  tenantNombre?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPrivateExercises {
  items: PrivateExercise[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePrivateExercisePayload {
  nombre: string;
  categoria: string;
  descripcion?: string;
  mediaUrl?: string;
  mediaType?: PrivateExerciseMediaType;
}

export type UpdatePrivateExercisePayload = Partial<
  CreatePrivateExercisePayload & { activo: boolean }
>;

export interface WizardPrivateExerciseItem {
  grupo: string;
  nombre: string;
  nombre_español: string;
  gif: string;
  mediaType: PrivateExerciseMediaType;
  series: string;
  descripcion: string;
  source: 'private';
  privateId: string;
}

export interface WizardPrivateCatalogResponse {
  ejercicios: WizardPrivateExerciseItem[];
  total: number;
}

export interface UploadMediaResponse {
  mediaUrl: string;
  mediaType: PrivateExerciseMediaType;
}
