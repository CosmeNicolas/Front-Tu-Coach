import { UserStatus } from '@/types/auth';

export enum TenantStatus {
  ACTIVE = 'activo',
  SUSPENDED = 'suspendido',
}

export enum PlanCodigo {
  FREE = 'free',
  TRIAL = 'trial',
  PREMIUM = 'premium',
  PRO = 'pro',
}

export interface LimitesOverride {
  alumnos?: number;
  planesActivos?: number;
}

export interface CreateTenantPayload {
  nombre: string;
  slug?: string;
  estado?: TenantStatus;
  planCodigo?: PlanCodigo;
}

export interface UpdateTenantPayload {
  nombre?: string;
  slug?: string;
  estado?: TenantStatus;
  planCodigo?: PlanCodigo;
  limitesOverride?: LimitesOverride | null;
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
  password?: string;
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
