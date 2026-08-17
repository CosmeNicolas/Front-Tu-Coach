'use client';

interface Props {
  progreso: number;
  seccionesCompletadas: number;
  totalSecciones: number;
  diaLabel?: string | null;
}

export function IndicadorProgreso({
  progreso,
  seccionesCompletadas,
  totalSecciones,
  diaLabel,
}: Props) {
  return (
    <div className="mt-4 w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Progreso{diaLabel ? ` · ${diaLabel}` : ''}
        </span>
        <span className="text-muted-foreground">
          {seccionesCompletadas} / {totalSecciones} secciones
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="text-foreground">✓</span>
        <span>{Math.round(progreso)}% completado</span>
      </div>
    </div>
  );
}
