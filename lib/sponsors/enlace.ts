export function normalizeSponsorEnlace(raw?: string | null): string | null {
  if (raw == null) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const digits = trimmed.replace(/[\s()-]/g, '');
  if (/^\+?\d{8,15}$/.test(digits)) {
    return `https://wa.me/${digits.replace(/^\+/, '')}`;
  }

  let candidate = trimmed;
  if (/^(wa\.me|api\.whatsapp\.com)\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
