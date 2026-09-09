export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const LANDING_FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Funciones', href: '/#funciones' },
      { label: 'Planes', href: '/#planes' },
      { label: 'Para entrenadores', href: '/#entrenadores' },
      { label: 'Para gimnasios', href: '/#gimnasios' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Crear cuenta', href: '/registro' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y condiciones', href: '/terminos' },
      { label: 'Política de privacidad', href: '/privacidad' },
    ],
  },
];

export type TrustedByEntry =
  | { kind: 'placeholder'; label: string }
  | {
      kind: 'logo';
      src: string;
      alt: string;
      unoptimized?: boolean;
      imageClassName?: string;
      sizeClassName?: string;
    };

/** Logos en /public/sponsor/ — orden: izquierda → derecha (CEMD en el centro) */
export const TRUSTED_BY_ENTRIES: TrustedByEntry[] = [
  {
    kind: 'logo',
    src: '/sponsor/Q_TEAM_LETRAS.png',
    alt: 'Tony Quesada Team',
    imageClassName: 'brightness-0 invert opacity-85',
  },
  {
    kind: 'logo',
    src: '/sponsor/ATLAS.png?v=4',
    alt: 'Atlas Suplementos',
    unoptimized: true,
  },
  {
    kind: 'logo',
    src: '/sponsor/CEMD__Logo.png?v=4',
    alt: 'CEMD — Centro de Medicina Deportiva',
    unoptimized: true,
  },
  {
    kind: 'logo',
    src: '/sponsor/allFrozen.png?v=4',
    alt: 'allFrozen — Especialistas en alimentos congelados',
    unoptimized: true,
    imageClassName: 'brightness-[1.85] contrast-[1.05] opacity-95',
  },
  {
    kind: 'logo',
    src: '/sponsor/Coffee.png?v=3',
    alt: 'Coffee Station',
    unoptimized: true,
    imageClassName: 'opacity-90',
    sizeClassName: 'lg:max-w-[9.5rem]',
  },
];
