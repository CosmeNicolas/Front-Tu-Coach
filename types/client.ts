export enum ClientStatus {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
}

export interface ClientPersonalData {
  edad?: number | null;
  peso?: number | null;
  altura?: number | null;
  objetivo?: string;
  condicionanteDeCarga?: string;
  sexo?: 'masculino' | 'femenino' | 'otro' | 'no_informado';
}

export interface Client {
  id: string;
  tenantId: string;
  profesorId: string;
  userId?: string | null;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  dni: string | null;
  datos: ClientPersonalData;
  estado: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientPayload {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
  datos?: ClientPersonalData;
  estado?: ClientStatus;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;

export interface PaginatedClients {
  items: Client[];
  total: number;
  page: number;
  limit: number;
}
