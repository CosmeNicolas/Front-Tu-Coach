'use client';

import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useStandardPlanCheckout } from '@/hooks/useStandardPlanCheckout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

type Props = {
  planificationId: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
};

export function StandardPlanUnlockButton({
  planificationId,
  label = 'Desbloquear plan',
  className,
  variant = 'default',
  size = 'default',
}: Props) {
  const checkout = useStandardPlanCheckout();

  async function handleClick() {
    try {
      const result = await checkout.mutateAsync(planificationId);
      window.location.href = result.checkoutUrl;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo iniciar el pago. Probá de nuevo.';
      toast.error(message);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={checkout.isPending || !planificationId}
      onClick={() => void handleClick()}
    >
      {checkout.isPending ? 'Redirigiendo a Mercado Pago…' : label}
    </Button>
  );
}
