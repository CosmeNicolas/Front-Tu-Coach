import { TipoItem, UnidadTrabajo } from '@/types/planification';

/** Formatea `valor` materializado para display estilo CEMD (sin recalcular). */
export function formatValorDisplay(
  valor: string,
  tipoItem?: TipoItem,
  unidadTrabajo?: UnidadTrabajo,
): string {
  const v = valor.trim();
  if (!v) return '—';

  const iso = v.match(/^(\d+)x(\d+)\s*(?:''|"|s|seg)/i);
  if (iso) return `${iso[1]} series × ${iso[2]} seg`;

  const aerobico = v.match(/^(\d+(?:\.\d+)?)\s*min/i);
  if (aerobico) return `${aerobico[1]} minutos`;

  const fuerza = v.match(/(?:(\d+(?:\.\d+)?)\s*kg\s*)?(\d+)x(\d+)/i);
  if (fuerza) {
    const peso = fuerza[1] ? `${fuerza[1]} kg · ` : '';
    return `${peso}${fuerza[2]} series × ${fuerza[3]} reps`;
  }

  if (tipoItem === TipoItem.AEROBICO || unidadTrabajo === UnidadTrabajo.MIN) {
    return v.includes('min') ? v : `${v} minutos`;
  }
  if (tipoItem === TipoItem.ISOMETRICO || unidadTrabajo === UnidadTrabajo.SEG) {
    return v;
  }
  return v;
}

export function iconoSeccion(tipo: string): string {
  switch (tipo) {
    case 'calentamiento':
      return '🔥';
    case 'vuelta_calma':
      return '🧘';
    default:
      return '💪';
  }
}

export function labelGrupo(tipoGrupo: 'biserie' | 'triserie'): string {
  return tipoGrupo === 'biserie' ? 'Biserie' : 'Triserie';
}
