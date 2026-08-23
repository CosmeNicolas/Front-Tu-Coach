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

/** Logos en /public/sponsor/ — orden: izquierda → centro → derecha */
export const TRUSTED_BY_ENTRIES: TrustedByEntry[] = [
  {
    kind: 'logo',
    src: '/sponsor/Q_TEAM_LETRAS.png',
    alt: 'Tony Quesada Team',
    width: 160,
    height: 48,
    imageClassName:
      'h-14 w-full max-w-[240px] object-contain object-center opacity-80 brightness-0 invert sm:h-10 sm:max-w-[160px]',
  },
  {
    kind: 'logo',
    src: '/sponsor/CEMD__Logo.png?v=3',
    alt: 'CEMD — Centro de Medicina Deportiva',
    scale: 4.5,
    unoptimized: true,
    width: 320,
    height: 320,
    imageClassName:
      'h-14 w-auto max-w-[280px] object-contain object-center opacity-90 sm:h-11 sm:max-w-[200px]',
  },
  {
    kind: 'logo',
    src: '/sponsor/ATLAS.png?v=3',
    alt: 'Atlas Suplementos',
    scale: 4.5,
    unoptimized: true,
    width: 320,
    height: 320,
    imageClassName:
      'h-14 w-auto max-w-[280px] object-contain object-center opacity-90 sm:h-11 sm:max-w-[200px]',
  },
];
