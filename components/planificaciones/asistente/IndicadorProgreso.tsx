'use client';

import { CEMD } from './constants';

interface Props {
  progreso: number;
  seccionesCompletadas: number;
  totalSecciones: number;
}

export function IndicadorProgreso({
  progreso,
  seccionesCompletadas,
  totalSecciones,
}: Props) {
  return (
    <div className="mt-4 w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${CEMD.primaryClass}`}>Progreso</span>
        <span className="text-gray-600">
          {seccionesCompletadas} / {totalSecciones} secciones
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <span className="text-foreground">✓</span>
        <span>{Math.round(progreso)}% completado</span>
      </div>
    </div>
  );
}
