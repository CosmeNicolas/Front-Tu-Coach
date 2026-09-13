export type SponsorDestino = 'tucoach' | 'cemd' | 'ambos';

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
  destino: SponsorDestino;
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
  destino?: SponsorDestino;
  orden?: number;
}

export type UpdateSponsorPayload = Partial<CreateSponsorPayload>;

export const SPONSOR_DESTINO_OPTIONS: {
  value: SponsorDestino;
  label: string;
}[] = [
  { value: 'tucoach', label: 'Solo TuCoach' },
  { value: 'cemd', label: 'Solo CEMD' },
  { value: 'ambos', label: 'TuCoach y CEMD' },
];

export function sponsorDestinoLabel(destino: SponsorDestino | undefined): string {
  return (
    SPONSOR_DESTINO_OPTIONS.find((option) => option.value === destino)?.label ??
    'Solo TuCoach'
  );
}
