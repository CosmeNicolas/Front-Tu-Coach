import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

const SIZES = {
  sm: { px: 28, text: 'text-lg' },
  md: { px: 36, text: 'text-2xl' },
} as const;

interface BrandMarkProps {
  size?: keyof typeof SIZES;
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
}

export function BrandMark({
  size = 'md',
  showWordmark = true,
  className,
  priority = false,
}: BrandMarkProps) {
  const { px, text } = SIZES[size];

  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Image
        src="/branding/ZORRO1.png"
        alt={showWordmark ? '' : 'TuCoach'}
        width={px}
        height={px}
        className="shrink-0 rounded-full object-cover ring-1 ring-border"
        priority={priority}
      />
      {showWordmark ? (
        <span
          className={cn(
            'truncate font-display tracking-wide text-foreground',
            text,
          )}
        >
          TuCoach
        </span>
      ) : null}
    </div>
  );
}
