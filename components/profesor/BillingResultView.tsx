'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
import { cn } from '@/lib/utils/cn';

export type BillingResultVariant = 'exito' | 'pendiente' | 'rechazado';

const VARIANT_CONFIG: Record<
  BillingResultVariant,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    cardClass: string;
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  }
> = {
  exito: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    cardClass: 'border-emerald-500/25 bg-emerald-500/5',
    title: 'Pago exitoso',
    description:
      'Recibimos tu pago. Tu plan Premium se activa en unos segundos; podés seguir usando TuCoach con más cupos.',
    primaryHref: '/profesor/dashboard',
    primaryLabel: 'Ir al dashboard',
  },
  pendiente: {
    icon: Clock3,
    iconClass: 'text-amber-500',
    cardClass: 'border-amber-500/25 bg-amber-500/5',
    title: 'Pago pendiente',
    description:
      'Tu pago está en revisión. Te avisamos cuando se confirme y tu plan se actualice automáticamente.',
    primaryHref: '/profesor/dashboard',
    primaryLabel: 'Ir al dashboard',
  },
  rechazado: {
    icon: XCircle,
    iconClass: 'text-destructive',
    cardClass: 'border-destructive/25 bg-destructive/5',
    title: 'Pago rechazado',
    description:
      'No se pudo completar el cobro. Revisá el medio de pago o probá con otra tarjeta desde el dashboard.',
    primaryHref: '/profesor/dashboard',
    primaryLabel: 'Volver al dashboard',
    secondaryHref: '/profesor/dashboard',
    secondaryLabel: 'Intentar de nuevo',
  },
};

interface BillingResultViewProps {
  variant: BillingResultVariant;
}

export function BillingResultView({ variant }: BillingResultViewProps) {
  const queryClient = useQueryClient();
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (variant === 'exito') {
      void queryClient.invalidateQueries({ queryKey: ['billing', 'plan-status'] });
    }
  }, [queryClient, variant]);

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

        {variant === 'exito' ? (
          <p className="px-6 pb-2 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Actualizando tu plan…
            </span>
          </p>
        ) : null}

        <CardContent className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href={config.primaryHref}>{config.primaryLabel}</Link>
          </Button>
          {config.secondaryHref && config.secondaryLabel ? (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={config.secondaryHref}>{config.secondaryLabel}</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
