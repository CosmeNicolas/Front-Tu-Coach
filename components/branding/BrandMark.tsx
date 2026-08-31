import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

const SIZES = {
  sm: { px: 28, text: 'text-lg' },
  md: { px: 36, text: 'text-2xl' },
} as const;

interface BrandMarkProps {
  size?: keyof typeof SIZES;
  showWordmark?: boolean;
  showLogo?: boolean;
  className?: string;
  priority?: boolean;
}

export function BrandMark({
  size = 'md',
  showWordmark = true,
  showLogo = true,
  className,
  priority = false,
}: BrandMarkProps) {
  const { px, text } = SIZES[size];

  return (
    <div className={cn('flex shrink-0 items-center gap-2.5', className)}>
      {showLogo ? (
        <Image
          src="/branding/LGO600PX.png"
          alt={showWordmark ? '' : 'TuCoach'}
          width={px}
          height={px}
          className="shrink-0 object-contain"
          priority={priority}
        />
      ) : null}
      {showWordmark ? (
        <span className={cn('font-display tracking-wide text-foreground', text)}>
          TuCoach
        </span>
      ) : null}
    </div>
  );
}
