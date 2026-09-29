import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AlumnoBillingResultView } from '@/components/alumno/AlumnoBillingResultView';

export const metadata: Metadata = {
  title: 'Pago exitoso',
  robots: { index: false, follow: false },
};

export default function AlumnoPagoExitoPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Cargando…</p>}>
      <AlumnoBillingResultView variant="exito" />
    </Suspense>
  );
}
