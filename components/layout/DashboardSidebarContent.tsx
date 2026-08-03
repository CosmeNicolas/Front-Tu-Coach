'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PortalGreeting } from '@/components/layout/PortalGreeting';
import { cn } from '@/lib/utils/cn';
import type { SidebarNavItem } from '@/components/layout/AppSidebar';

interface DashboardSidebarContentProps {
  title: string;
  subtitle?: string;
  roleContext?: string;
  navItems: SidebarNavItem[];
  footer?: React.ReactNode;
  onNavigate?: () => void;
}

export function DashboardSidebarContent({
  title,
  subtitle,
  roleContext,
  navItems,
  footer,
  onNavigate,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="space-y-4 border-b border-border px-5 py-6">
        <div>
          <p className="font-display text-2xl tracking-wide text-foreground">
            {title}
          </p>
          {!roleContext && subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {roleContext ? (
          <PortalGreeting showAvatar contextLabel={roleContext} />
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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
    </>
  );
}
