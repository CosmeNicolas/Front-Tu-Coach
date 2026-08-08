'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { BrandMark } from '@/components/branding/BrandMark';
import { AppSidebar, SidebarNavItem } from '@/components/layout/AppSidebar';
import { DashboardSidebarContent } from '@/components/layout/DashboardSidebarContent';
import { PortalGreeting } from '@/components/layout/PortalGreeting';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  /** Etiqueta de rol bajo el saludo personalizado */
  roleContext?: string;
  navItems: SidebarNavItem[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Acciones del header (ej. campana de notificaciones) */
  headerActions?: React.ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  roleContext,
  navItems,
  children,
  footer = <LogoutButton />,
  headerActions,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <AppSidebar
        title={title}
        subtitle={subtitle}
        roleContext={roleContext}
        navItems={navItems}
        footer={footer}
        headerActions={headerActions}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex h-full w-[min(100%,16rem)] flex-col gap-0 p-0"
            >
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <DashboardSidebarContent
                  title={title}
                  subtitle={subtitle}
                  roleContext={roleContext}
                  navItems={navItems}
                  footer={footer}
                  headerActions={headerActions}
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1">
            {roleContext ? (
              <PortalGreeting compact contextLabel={roleContext} />
            ) : subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : title !== 'TuCoach' ? (
              <p className="truncate font-display text-xl tracking-wide text-foreground">
                {title}
              </p>
            ) : (
              <p className="truncate font-display text-lg tracking-wide text-foreground">
                TuCoach
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {title === 'TuCoach' ? (
              <BrandMark size="sm" showWordmark={false} priority />
            ) : null}
            {headerActions}
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
