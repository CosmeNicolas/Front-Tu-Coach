import { AppSidebar } from '@/components/layout/AppSidebar';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { SidebarNavItem } from '@/components/layout/AppSidebar';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  navItems: SidebarNavItem[];
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  navItems,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        title={title}
        subtitle={subtitle}
        navItems={navItems}
        footer={<LogoutButton />}
      />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
