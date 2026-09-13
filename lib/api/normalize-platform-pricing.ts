import {
  LAUNCH_DISCOUNT,
  LAUNCH_OFFER_LABEL,
  PRICE_ARS,
  TRIAL_DAYS,
  launchMonthPrice,
} from '@/lib/landing/constants';
import type { PublicPlatformPricing } from '@/types/platform-pricing';

const PRICING_KEYS = [
  'premiumMonth',
  'proMonth',
  'plusMonth',
  'gymMonth',
  'catalog4w',
  'catalog8w',
  'catalog12w',
  'personalized',
  'launchDiscount',
  'trialDays',
  'premiumBillingDays',
] as const;

function readNumber(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Tolera respuestas legacy donde Mongoose filtraba campos en `_doc`. */
export function normalizePublicPlatformPricing(
  raw: unknown,
): PublicPlatformPricing | null {
  if (!raw || typeof raw !== 'object') return null;

  const payload = raw as Record<string, unknown>;
  const nested =
    payload._doc && typeof payload._doc === 'object'
      ? (payload._doc as Record<string, unknown>)
      : payload;

  const values: Partial<Record<(typeof PRICING_KEYS)[number], number>> = {};
  for (const key of PRICING_KEYS) {
    const value = readNumber(nested, key) ?? readNumber(payload, key);
    if (value === null) return null;
    values[key] = value;
  }

  const launchOfferLabel =
    typeof payload.launchOfferLabel === 'string' && payload.launchOfferLabel.trim()
      ? payload.launchOfferLabel.trim()
      : LAUNCH_OFFER_LABEL;

  const premiumLaunchMonth =
    readNumber(payload, 'premiumLaunchMonth') ??
    launchMonthPrice(values.premiumMonth!, values.launchDiscount!);

  return {
    premiumMonth: values.premiumMonth!,
    proMonth: values.proMonth!,
    plusMonth: values.plusMonth!,
    gymMonth: values.gymMonth!,
    catalog4w: values.catalog4w!,
    catalog8w: values.catalog8w!,
    catalog12w: values.catalog12w!,
    personalized: values.personalized!,
    launchDiscount: values.launchDiscount!,
    trialDays: values.trialDays!,
    premiumBillingDays: values.premiumBillingDays!,
    premiumLaunchMonth,
    launchOfferLabel,
  };
}

export const FALLBACK_PUBLIC_PLATFORM_PRICING: PublicPlatformPricing = {
  premiumMonth: PRICE_ARS.premiumMonth,
  proMonth: PRICE_ARS.proMonth,
  plusMonth: PRICE_ARS.plusMonth,
  gymMonth: PRICE_ARS.gymMonth,
  catalog4w: PRICE_ARS.catalog4w,
  catalog8w: PRICE_ARS.catalog8w,
  catalog12w: PRICE_ARS.catalog12w,
  personalized: PRICE_ARS.personalized,
  launchDiscount: LAUNCH_DISCOUNT,
  trialDays: TRIAL_DAYS,
  premiumBillingDays: 30,
  premiumLaunchMonth: launchMonthPrice(PRICE_ARS.premiumMonth),
  launchOfferLabel: LAUNCH_OFFER_LABEL,
};
