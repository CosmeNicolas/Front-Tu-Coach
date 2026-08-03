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

/** Placeholders de confianza — reemplazar con logos reales en /public cuando existan */
export const TRUSTED_BY_PLACEHOLDERS = [
  'Tu gimnasio',
  'Tu equipo',
  'Tu centro',
  'Tu club',
  'Tu estudio',
  'Tu academia',
] as const;
