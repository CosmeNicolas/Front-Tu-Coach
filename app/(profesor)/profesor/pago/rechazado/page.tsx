import type { Metadata } from 'next';
import { BillingResultView } from '@/components/profesor/BillingResultView';

export const metadata: Metadata = {
  title: 'Pago rechazado',
  robots: { index: false, follow: false },
};

export default function BillingRechazadoPage() {
  return <BillingResultView variant="rechazado" />;
}
