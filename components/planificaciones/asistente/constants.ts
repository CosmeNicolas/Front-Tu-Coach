import { TipoSeccion } from '@/types/planification';

/** Tokens visuales del asistente (escala de grises) */
export const CEMD = {
  primary: '#171717',
  primaryClass: 'text-foreground',
  borderClass: 'border-border',
  borderActiveClass: 'border-foreground',
  bgTintClass: 'bg-muted',
  ringClass: 'ring-foreground',
} as const;

export interface WizardTabDef {
  id: string;
  titulo: string;
  tipoSeccion: TipoSeccion;
  icon?: string;
}

/** Orden fijo de tabs — replica SECCIONES_LINEALES del CEMD */
export const WIZARD_TABS: WizardTabDef[] = [
  { id: 'calentamiento', titulo: 'Entrada en calor', tipoSeccion: TipoSeccion.CALENTAMIENTO, icon: '🔥' },
  { id: 'abdominales', titulo: 'Abdominales', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'lumbares', titulo: 'Lumbares/Espinales', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'piernas', titulo: 'Piernas', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'pecho', titulo: 'Pecho', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'espalda', titulo: 'Espalda', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'pantorrillas', titulo: 'Pantorrillas', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'biceps', titulo: 'Bíceps', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'hombros', titulo: 'Hombros', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'triceps', titulo: 'Tríceps', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'deportes', titulo: 'Deportes', tipoSeccion: TipoSeccion.PRINCIPAL, icon: '⚽' },
  { id: 'adaptados', titulo: 'Ejercicios adaptados', tipoSeccion: TipoSeccion.PRINCIPAL },
  { id: 'vuelta_calma', titulo: 'Vuelta a la calma', tipoSeccion: TipoSeccion.VUELTA_CALMA, icon: '🧘' },
];

export const TAB_PREVIEW_ID = 'vista_previa';

export const MAX_EJERCICIOS_POR_SECCION = 25;

export const OPCIONES_MINUTOS = [5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30];
export const OPCIONES_INCREMENTO_MIN = [0, 1, 2, 3, 5];

export const btnPrimary =
  'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50';
export const btnOutline =
  'rounded-lg border border-input bg-card px-3 py-2 text-sm hover:bg-muted disabled:opacity-40';
export const selectCemd =
  'rounded border border-input bg-card px-2 py-1 text-sm text-foreground';
