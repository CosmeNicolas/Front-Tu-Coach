'use client';

import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBillingCheckout, useBillingPlanStatus } from '@/hooks/useBilling';
import { PlanCodigo } from '@/types/admin';
import {
  formatArs,
  LAUNCH_OFFER_LABEL,
  launchMonthPrice,
  PRICE_ARS,
} from '@/lib/landing/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ApiError } from '@/lib/api/client';

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function PlanUpgradeBanner() {
  const { data, isLoading } = useBillingPlanStatus();
  const checkout = useBillingCheckout();

  if (isLoading || !data) {
    return null;
  }

  if (
    !data.canCheckout &&
    data.planEfectivo !== PlanCodigo.FREE &&
    data.planEfectivo !== PlanCodigo.TRIAL
  ) {
    const vence = formatDate(data.planVenceAt);
    if (!vence) return null;
    return (
      <Card>
        <CardHeader className="p-4 sm:p-5">
          <CardDescription>
            Plan <strong className="text-foreground">{data.planEfectivo}</strong>{' '}
            activo hasta el {vence}.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data.canCheckout) {
    return null;
  }

  const trialLabel = formatDate(data.trialEndsAt);
  const amount =
    data.checkoutPlans[0]?.amountArs ?? launchMonthPrice(PRICE_ARS.premiumMonth);

  async function handleCheckout() {
    try {
      const result = await checkout.mutateAsync();
      window.location.href = result.checkoutUrl;
    } catch (err) {
      toast.error('No se pudo abrir el pago', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  const title =
    data.planEfectivo === PlanCodigo.TRIAL
      ? `Tu prueba Premium${trialLabel ? ` termina el ${trialLabel}` : ' está por terminar'}`
      : 'Estás en plan Free';

  return (
    <Card className="border-sky-500/25 bg-sky-500/6">
      <CardHeader className="gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <Badge variant="secondary">{LAUNCH_OFFER_LABEL}</Badge>
          </div>
          <CardDescription>
            Pasá a Premium para más alumnos y planificaciones activas. Primer mes:{' '}
            <strong className="font-semibold text-foreground">{formatArs(amount)}</strong>.
          </CardDescription>
        </div>
        <Button
          type="button"
          className="w-full shrink-0 sm:w-auto"
          disabled={!data.checkoutAvailable || checkout.isPending}
          onClick={() => void handleCheckout()}
        >
          {checkout.isPending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Abriendo pago…
            </>
          ) : (
            <>
              <CreditCard className="size-4" aria-hidden />
              Pagar con Mercado Pago
            </>
          )}
        </Button>
      </CardHeader>
    </Card>
  );
}
