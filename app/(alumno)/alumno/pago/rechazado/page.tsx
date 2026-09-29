import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AlumnoBillingResultView } from '@/components/alumno/AlumnoBillingResultView';

export const metadata: Metadata = {
  title: 'Pago rechazado',
  robots: { index: false, follow: false },
};

export default function AlumnoPagoRechazadoPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Cargando…</p>}>
      <AlumnoBillingResultView variant="rechazado" />
    </Suspense>
  );
}
