'use client';

import Link from 'next/link';
import { usePlanBaseline } from '@/hooks/usePlanifications';
import { Button } from '@/components/ui/button';

interface Props {
  alumnoId: string;
  /** Si ya conocemos el plan fuente (detalle de plan). */
  fromPlanId?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm';
  className?: string;
  label?: string;
}

/**
 * CTA Fase 4: solo se muestra si el alumno tiene un plan anterior importable.
 */
export function RenovarDesdeAnteriorButton({
  alumnoId,
  fromPlanId,
  variant = 'outline',
  size = 'default',
  className,
  label = 'Nueva desde plan anterior',
}: Props) {
  const { data: baseline, isLoading } = usePlanBaseline(alumnoId);

  if (isLoading || !baseline?.available) return null;

  const planId = fromPlanId || baseline.planificationId;
  const href = `/profesor/planificaciones/nueva?alumnoId=${alumnoId}&origen=anterior${
    planId ? `&fromPlanId=${planId}` : ''
  }`;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
