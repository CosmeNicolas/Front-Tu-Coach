export function stepDecimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

/** Quita ceros a la izquierda y acepta coma decimal. Permite vacío y "0." al escribir. */
export function sanitizeNumericDraft(raw: string, allowDecimal: boolean): string {
  let s = raw.replace(/,/g, '.');
  if (!allowDecimal) {
    s = s.replace(/\./g, '');
  }
  s = s.replace(/[^\d.]/g, '');
  if (allowDecimal) {
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      s = `${s.slice(0, firstDot + 1)}${s.slice(firstDot + 1).replace(/\./g, '')}`;
    }
  }
  if (s === '') return '';
  if (s === '.') return '0.';

  const [intPart, ...rest] = s.split('.');
  const frac = rest.join('');
  const intClean = intPart.replace(/^0+(?=\d)/, '');
  if (s.includes('.')) {
    return `${intClean || '0'}.${frac}`;
  }
  return intClean;
}

export function parseNumericDraft(raw: string): number | null {
  if (raw === '' || raw === '.' || raw === '0.') return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function clampToStep(n: number, min: number, max: number, step: number): number {
  const decimals = stepDecimals(step);
  const clamped = Math.min(max, Math.max(min, n));
  const steps = Math.round((clamped - min) / step);
  return Number((min + steps * step).toFixed(decimals));
}

export function formatNumericValue(n: number, step: number): string {
  return Number(n.toFixed(stepDecimals(step))).toString();
}
