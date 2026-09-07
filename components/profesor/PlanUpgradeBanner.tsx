'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useBillingCheckout, useBillingPlanStatus } from '@/hooks/useBilling';
import { PlanCodigo } from '@/types/admin';
import { formatArs, launchMonthPrice, PRICE_ARS } from '@/lib/landing/constants';
import { Button } from '@/components/ui/button';
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
  const searchParams = useSearchParams();
  const { data, isLoading, refetch } = useBillingPlanStatus();
  const checkout = useBillingCheckout();

  useEffect(() => {
    const billing = searchParams.get('billing');
    if (billing === 'success') {
      toast.success('Pago recibido. Tu plan se actualiza en unos segundos.');
      void refetch();
    } else if (billing === 'failure') {
      toast.error('El pago no se completó.');
    } else if (billing === 'pending') {
      toast.message('Pago pendiente de confirmación.');
    }
  }, [searchParams, refetch]);

  if (isLoading || !data) {
    return null;
  }

  if (!data.canCheckout && data.planEfectivo !== PlanCodigo.FREE && data.planEfectivo !== PlanCodigo.TRIAL) {
    const vence = formatDate(data.planVenceAt);
    if (!vence) return null;
    return (
      <section className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5">
        <p className="text-sm text-muted-foreground">
          Plan <strong className="text-foreground">{data.planEfectivo}</strong> activo
          {vence ? ` hasta el ${vence}.` : '.'}
        </p>
      </section>
    );
  }

  if (!data.canCheckout) {
    return null;
  }

  const trialLabel = formatDate(data.trialEndsAt);
  const amount = data.checkoutPlans[0]?.amountArs ?? launchMonthPrice(PRICE_ARS.premiumMonth);

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

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-5">
      <div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-amber-500" aria-hidden />
          {data.planEfectivo === PlanCodigo.TRIAL
            ? `Tu prueba Premium${trialLabel ? ` termina el ${trialLabel}` : ' está por terminar'}`
            : 'Estás en plan Free'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pasá a Premium para más alumnos y planificaciones activas. Primer mes promo:{' '}
          {formatArs(amount)}.
        </p>
      </div>
      <Button
        type="button"
        className="mt-3 w-full sm:mt-0 sm:w-auto"
        disabled={!data.checkoutAvailable || checkout.isPending}
        onClick={() => void handleCheckout()}
      >
        {checkout.isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Abriendo pago…
          </>
        ) : (
          'Pagar con MercadoPago'
        )}
      </Button>
    </section>
  );
}
