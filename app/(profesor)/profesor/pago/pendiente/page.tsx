import type { Metadata } from 'next';
import { BillingResultView } from '@/components/profesor/BillingResultView';

export const metadata: Metadata = {
  title: 'Pago pendiente | TuCoach',
  robots: { index: false, follow: false },
};

export default function BillingPendientePage() {
  return <BillingResultView variant="pendiente" />;
}
