'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { EjercicioCatalogo } from '@/lib/ejercicios/catalogo';
import { BuscadorEjercicio } from '@/components/planificaciones/asistente/BuscadorEjercicio';
import { Button } from '@/components/ui/button';
import { CEMD } from './constants';

interface Props {
  catalogTabId: string;
  onSeleccionar: (ejercicio: EjercicioCatalogo) => void;
}

export function SustitucionEjercicioCatalogo({
  catalogTabId,
  onSeleccionar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className={`text-sm font-semibold ${CEMD.primaryClass}`}>
            Sustituir por otro ejercicio
          </p>
          <p className="text-xs text-muted-foreground">
            Elegí del catálogo. Las sesiones anteriores al corte no cambian.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAbierto((v) => !v)}
        >
          <Search className="size-4" />
          {abierto ? 'Ocultar catálogo' : 'Buscar reemplazo'}
        </Button>
      </div>

      {abierto ? (
        <BuscadorEjercicio
          tabId={catalogTabId}
          onSeleccionar={(ej) => {
            onSeleccionar(ej);
            setAbierto(false);
          }}
        />
      ) : null}
    </div>
  );
}
