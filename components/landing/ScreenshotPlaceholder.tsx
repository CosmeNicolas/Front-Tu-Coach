import { cn } from '@/lib/utils';

interface ScreenshotPlaceholderProps {
  /** Texto que indica qué captura reemplazar — ej. "Captura: inicio del alumno" */
  label: string;
  className?: string;
  aspectRatio?: 'phone' | 'wide' | 'square';
  /** Comentario para desarrolladores sobre dónde colocar la imagen */
  hint?: string;
}

const aspectClasses = {
  phone: 'aspect-[9/19]',
  wide: 'aspect-[16/10]',
  square: 'aspect-square',
} as const;

export function ScreenshotPlaceholder({
  label,
  className,
  aspectRatio = 'wide',
  hint,
}: ScreenshotPlaceholderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010]',
        aspectClasses[aspectRatio],
        className,
      )}
      data-screenshot-placeholder={label}
      title={hint ?? `Reemplazar con imagen real: ${label}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.06),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="rounded-lg border border-dashed border-white/20 bg-[#141414]/80 px-4 py-3">
          <p className="text-sm font-medium text-[#A3A3A3]">{label}</p>
          {hint ? (
            <p className="mt-1 max-w-xs text-xs text-[#737373]">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
