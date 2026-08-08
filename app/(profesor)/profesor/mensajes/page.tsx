import { Suspense } from 'react';
import { ProfesorMensajesView } from '@/components/profesor/ProfesorMensajesView';

export default function ProfesorMensajesPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-sm text-muted-foreground">Cargando mensajes…</p>
      }
    >
      <ProfesorMensajesView />
    </Suspense>
  );
}
