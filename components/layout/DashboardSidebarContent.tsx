'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/branding/BrandMark';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PortalGreeting } from '@/components/layout/PortalGreeting';
import { useMessagesUnreadCount } from '@/hooks/useMessages';
import { cn } from '@/lib/utils/cn';
import type { SidebarNavItem } from '@/components/layout/AppSidebar';

interface DashboardSidebarContentProps {
  title: string;
  subtitle?: string;
  roleContext?: string;
  navItems: SidebarNavItem[];
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  onNavigate?: () => void;
}

export function DashboardSidebarContent({
  title,
  subtitle,
  roleContext,
  navItems,
  footer,
  headerActions,
  onNavigate,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();
  const hasMensajesNav = navItems.some((i) => i.href.includes('/mensajes'));
  const { data: unread } = useMessagesUnreadCount(hasMensajesNav);
  const unreadCount = unread?.count ?? 0;

  return (
    <>
      <div className="space-y-4 border-b border-border px-5 py-6">
        <div className="flex items-start justify-between gap-2">
          <div className="shrink-0">
            {title === 'TuCoach' ? (
              headerActions ? (
                <BrandMark size="md" showWordmark={false} priority />
              ) : (
                <BrandMark size="md" showLogo={false} priority />
              )
            ) : (
              <p className="font-display text-2xl tracking-wide text-foreground">
                {title}
              </p>
            )}
            {!roleContext && subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {headerActions ? (
            <div className="hidden shrink-0 lg:block">{headerActions}</div>
          ) : null}
        </div>
        {roleContext ? (
          <PortalGreeting showAvatar contextLabel={roleContext} />
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showBadge =
            item.href.includes('/mensajes') && unreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="flex-1">{item.label}</span>
              {showBadge ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px] font-bold',
                    active
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-primary text-primary-foreground',
                  )}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              ) : null}
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
