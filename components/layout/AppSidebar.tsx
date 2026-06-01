import { DashboardSidebarContent } from '@/components/layout/DashboardSidebarContent';

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
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <DashboardSidebarContent
        title={title}
        subtitle={subtitle}
        navItems={navItems}
        footer={footer}
      />
    </aside>
  );
}
