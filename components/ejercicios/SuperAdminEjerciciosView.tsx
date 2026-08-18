'use client';

import { SuperAdminBaseCatalogPanel } from '@/components/ejercicios/SuperAdminBaseCatalogPanel';
import { SuperAdminGlobalExercisesPanel } from '@/components/ejercicios/SuperAdminGlobalExercisesPanel';
import { SuperAdminTenantExercisesPanel } from '@/components/ejercicios/SuperAdminTenantExercisesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  /** Si se pasa, fija el filtro al gimnasio (vista desde detalle de tenant). */
  tenantId?: string;
  defaultTab?: 'base' | 'global' | 'gimnasio';
}

export function SuperAdminEjerciciosView({
  tenantId,
  defaultTab = 'base',
}: Props) {
  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="flex h-auto flex-wrap gap-1">
        <TabsTrigger value="base">Catálogo base</TabsTrigger>
        <TabsTrigger value="global">Globales</TabsTrigger>
        <TabsTrigger value="gimnasio">Por gimnasio</TabsTrigger>
      </TabsList>

      <TabsContent value="base" className="mt-0">
        <SuperAdminBaseCatalogPanel />
      </TabsContent>

      <TabsContent value="global" className="mt-0">
        <SuperAdminGlobalExercisesPanel />
      </TabsContent>

      <TabsContent value="gimnasio" className="mt-0">
        <SuperAdminTenantExercisesPanel tenantId={tenantId} />
      </TabsContent>
    </Tabs>
  );
}
