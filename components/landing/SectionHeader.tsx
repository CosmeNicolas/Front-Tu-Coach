import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {label ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
          {label}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
