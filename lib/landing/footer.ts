export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const LANDING_FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Funciones', href: '#funciones' },
      { label: 'Planes', href: '#planes' },
      { label: 'Para entrenadores', href: '#entrenadores' },
      { label: 'Para gimnasios', href: '#gimnasios' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Preguntas frecuentes', href: '#contacto' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', href: '#contacto' },
      { label: 'Política de privacidad', href: '#contacto' },
    ],
  },
];

export type TrustedByEntry =
  | { kind: 'placeholder'; label: string }
  | {
      kind: 'logo';
      src: string;
      alt: string;
      width?: number;
      height?: number;
      scale?: number;
      /** Evita caché del optimizador al reemplazar PNGs en /public */
      unoptimized?: boolean;
      imageClassName?: string;
    };

/** Logos en /public/sponsor/ — rutas públicas */
export const TRUSTED_BY_ENTRIES: TrustedByEntry[] = [
  { kind: 'placeholder', label: 'Tu gimnasio' },
  { kind: 'placeholder', label: 'Tu equipo' },
  {
    kind: 'logo',
    // ?v= bump al reemplazar el archivo en public/sponsor/
    src: '/sponsor/CEMD__Logo.png?v=3',
    alt: 'CEMD — Centro de Medicina Deportiva',
    scale: 4.5,
    unoptimized: true,
    width: 320,
    height: 320,
    imageClassName:
      'h-11 w-auto max-w-[200px] object-contain object-center opacity-90',
  },
  {
    kind: 'logo',
    src: '/sponsor/Q_TEAM_LETRAS.png',
    alt: 'Tony Quesada Team',
    width: 160,
    height: 48,
    imageClassName:
      'h-10 w-full max-w-[140px] object-contain object-center opacity-80 brightness-0 invert',
  },
  { kind: 'placeholder', label: 'Tu estudio' },
  { kind: 'placeholder', label: 'Tu academia' },
];
