import { UserStatus } from '@/types/auth';

export enum TenantStatus {
  ACTIVE = 'activo',
  SUSPENDED = 'suspendido',
}

export interface CreateTenantPayload {
  nombre: string;
  slug?: string;
  estado?: TenantStatus;
}

export interface UpdateTenantPayload {
  nombre?: string;
  slug?: string;
  estado?: TenantStatus;
}

export interface ProfesorAdmin {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  estado: UserStatus;
  tenantId: string;
  tenantNombre: string | null;
  createdAt: string;
}

export interface ProfesoresAdminList {
  items: ProfesorAdmin[];
  total: number;
}

export interface CreateProfesorPayload {
  email: string;
  password: string;
  tenantId: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}

export interface UpdateProfesorPayload {
  email?: string;
  password?: string;
  tenantId?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  estado?: UserStatus;
}

export interface QueryProfesoresParams {
  tenantId?: string;
  search?: string;
  limit?: number;
}
