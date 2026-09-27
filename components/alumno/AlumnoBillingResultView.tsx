'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock3, Loader2, XCircle } from 'lucide-react';
import { BrandMark } from '@/components/branding/BrandMark';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useConfirmStandardPlanPayment } from '@/hooks/useStandardPlanCheckout';
import { cn } from '@/lib/utils/cn';

export type AlumnoBillingResultVariant = 'exito' | 'pendiente' | 'rechazado';

const VARIANT_CONFIG: Record<
  AlumnoBillingResultVariant,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    cardClass: string;
    title: string;
    description: string;
  }
> = {
  exito: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    cardClass: 'border-emerald-500/25 bg-emerald-500/5',
    title: 'Pago exitoso',
    description:
      'Tu plan quedó desbloqueado. Ya podés continuar con todas las sesiones.',
  },
  pendiente: {
    icon: Clock3,
    iconClass: 'text-amber-500',
    cardClass: 'border-amber-500/25 bg-amber-500/5',
    title: 'Pago pendiente',
    description:
      'Tu pago está en revisión. Cuando se confirme, el plan se desbloquea solo.',
  },
  rechazado: {
    icon: XCircle,
    iconClass: 'text-destructive',
    cardClass: 'border-destructive/25 bg-destructive/5',
    title: 'Pago rechazado',
    description:
      'No se pudo completar el cobro. Probá de nuevo desde tu planificación.',
  },
};

function resolvePaymentId(params: URLSearchParams): string | null {
  const candidates = [
    params.get('payment_id'),
    params.get('collection_id'),
    params.get('paymentId'),
  ];
  for (const value of candidates) {
    if (value && value !== 'null' && value !== 'undefined') {
      return value;
    }
  }
  return null;
}

interface Props {
  variant: AlumnoBillingResultVariant;
}

export function AlumnoBillingResultView({ variant }: Props) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useConfirmStandardPlanPayment();
  const startedRef = useRef(false);
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  const paymentId = useMemo(
    () => resolvePaymentId(searchParams),
    [searchParams],
  );

  useEffect(() => {
    if (variant !== 'exito' || !paymentId || startedRef.current) return;
    startedRef.current = true;
    void mutateAsync(paymentId).finally(() => {
      void queryClient.invalidateQueries({ queryKey: ['alumno'] });
    });
  }, [variant, paymentId, mutateAsync, queryClient]);

  const confirming = variant === 'exito' && isPending;

  return (
    <div className="flex min-h-[min(70vh,640px)] items-center justify-center p-4 sm:p-8">
      <Card className={cn('w-full max-w-md shadow-sm', config.cardClass)}>
        <CardHeader className="items-center space-y-4 pb-2 text-center">
          <BrandMark size="md" priority className="justify-center" />
          <div
            className={cn(
              'flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/80',
              config.iconClass,
            )}
          >
            <Icon className="size-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-display text-2xl tracking-wide">
              {config.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {config.description}
            </CardDescription>
          </div>
        </CardHeader>

        {confirming ? (
          <p className="px-6 pb-2 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Activando tu plan…
            </span>
          </p>
        ) : null}

        <CardContent className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/alumno/mi-planificacion">Ir a mi plan</Link>
          </Button>
          {variant === 'rechazado' ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/alumno/mi-planificacion">Intentar de nuevo</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
