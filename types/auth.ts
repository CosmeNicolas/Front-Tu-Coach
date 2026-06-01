export enum Role {
  SUPER_ADMIN = 'super_admin',
  OWNER_GIMNASIO = 'owner_gimnasio',
  PROFESOR = 'profesor',
  ALUMNO = 'alumno',
}

export enum UserStatus {
  ACTIVE = 'activo',
  BLOCKED = 'bloqueado',
  PENDING = 'pendiente',
}

export interface UserProfile {
  nombre: string;
  apellido: string;
  telefono?: string | null;
  avatar?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  estado: UserStatus;
  tenantId: string | null;
  profesorId: string | null;
  clientId?: string | null;
  profile?: UserProfile;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
