export interface Sponsor {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  imagenUrl: string;
  enlace: string;
  imagenZoom: number;
  validoDesde: string;
  validoHasta: string;
  activo: boolean;
  orden: number;
}

export interface SponsorList {
  items: Sponsor[];
}

export interface CreateSponsorPayload {
  nombre: string;
  descripcion: string;
  codigo: string;
  imagenUrl: string;
  enlace?: string;
  imagenZoom?: number;
  validoDesde?: string;
  validoHasta?: string;
  activo?: boolean;
  orden?: number;
}

export type UpdateSponsorPayload = Partial<CreateSponsorPayload>;
