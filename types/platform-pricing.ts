export interface PlatformPricingValues {
  premiumMonth: number;
  proMonth: number;
  plusMonth: number;
  gymMonth: number;
  catalog4w: number;
  catalog8w: number;
  catalog12w: number;
  personalized: number;
  launchDiscount: number;
  trialDays: number;
  premiumBillingDays: number;
}

export interface PublicPlatformPricing extends PlatformPricingValues {
  premiumLaunchMonth: number;
  launchOfferLabel: string;
}

export interface PlatformPricingAdminResponse {
  pricing: PlatformPricingValues;
  premiumLaunchMonth: number;
  updatedAt?: string | null;
}
