import type { Metadata } from 'next';
import { BillingResultView } from '@/components/profesor/BillingResultView';

export const metadata: Metadata = {
  title: 'Pago exitoso',
  robots: { index: false, follow: false },
};

export default function BillingExitoPage() {
  return <BillingResultView variant="exito" />;
}
