/**
 * Utilidad preparada para ShadCN — combina clases condicionales.
 * Fase posterior: reemplazar con clsx + tailwind-merge al init ShadCN.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
