import Link from 'next/link';
import { cn } from '@/lib/utils';

type LandingButtonVariant = 'primary' | 'secondary' | 'ghost';

interface LandingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: LandingButtonVariant;
  className?: string;
  external?: boolean;
}

const variantClasses: Record<LandingButtonVariant, string> = {
  primary:
    'bg-white text-[#050505] hover:bg-white/90 focus-visible:ring-white/40',
  secondary:
    'border border-white/20 bg-transparent text-white hover:border-white/35 hover:bg-white/5 focus-visible:ring-white/30',
  ghost: 'text-[#A3A3A3] hover:text-white focus-visible:ring-white/30',
};

export function LandingButton({
  href,
  children,
  variant = 'primary',
  className,
  external,
}: LandingButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]',
    variantClasses[variant],
    className,
  );

  if (external || href.startsWith('http')) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
