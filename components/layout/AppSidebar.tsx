'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils/cn';

export interface SidebarNavItem {
  href: string;
  label: string;
}

interface AppSidebarProps {
  title: string;
  subtitle?: string;
  navItems: SidebarNavItem[];
  footer?: React.ReactNode;
}

export function AppSidebar({
  title,
  subtitle,
  navItems,
  footer,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-5 py-6">
        <p className="font-display text-2xl tracking-wide text-foreground">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {footer && (
        <div className="space-y-3 border-t border-border p-4">
          <ThemeToggle />
          {footer}
        </div>
      )}
    </aside>
  );
}
