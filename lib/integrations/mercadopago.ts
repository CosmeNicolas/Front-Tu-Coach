/**
 * Integración MercadoPago — checkout vía POST /billing/checkout (back).
 * El front redirige a init_point; el webhook activa el plan Premium.
 */
export const MERCADOPAGO_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === 'true',
);
