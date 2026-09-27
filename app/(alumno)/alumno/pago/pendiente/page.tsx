import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AlumnoBillingResultView } from '@/components/alumno/AlumnoBillingResultView';

export const metadata: Metadata = {
  title: 'Pago pendiente | TuCoach',
  robots: { index: false, follow: false },
};

export default function AlumnoPagoPendientePage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Cargando…</p>}>
      <AlumnoBillingResultView variant="pendiente" />
    </Suspense>
  );
}
