const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function formatSponsorDay(isoDay: string): string {
  const [year, month, day] = isoDay.split('-');
  if (!year || !month || !day) return isoDay;
  return `${day}/${month}/${year}`;
}

export function vigenciaLabel(
  validoDesde?: string | null,
  validoHasta?: string | null,
): string | null {
  const desde = validoDesde?.trim() ?? '';
  const hasta = validoHasta?.trim() ?? '';
  if (desde && hasta) {
    return `Válido del ${formatSponsorDay(desde)} al ${formatSponsorDay(hasta)}`;
  }
  if (desde) return `Válido desde ${formatSponsorDay(desde)}`;
  if (hasta) return `Válido hasta ${formatSponsorDay(hasta)}`;
  return null;
}

export function parseSponsorDay(isoDay?: string | null): Date | undefined {
  const value = isoDay?.trim() ?? '';
  if (!DAY_RE.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

export function toSponsorDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
