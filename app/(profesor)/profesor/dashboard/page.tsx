import { Suspense } from 'react';
import { ProfesorDashboardView } from '@/components/profesor/ProfesorDashboardView';

function DashboardFallback() {
  return (
    <div className="p-8 text-sm text-muted-foreground">Cargando dashboard…</div>
  );
}

export default function ProfesorDashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <ProfesorDashboardView />
    </Suspense>
  );
}
