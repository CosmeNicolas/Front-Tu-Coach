'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AlumnoForm } from '@/components/alumnos/AlumnoForm';
import { AlumnoPortalAccessPanel } from '@/components/alumnos/AlumnoPortalAccessPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateClient } from '@/hooks/useClients';
import { Client, CreateClientPayload } from '@/types/client';

const TAB_DATOS = 'datos';
const TAB_PORTAL = 'portal';

interface Props {
  client: Client;
}

export function AlumnoEditTabs({ client }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') === TAB_PORTAL ? TAB_PORTAL : TAB_DATOS;
  const updateMutation = useUpdateClient(client.id);

  function setTab(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === TAB_PORTAL) {
      params.set('tab', TAB_PORTAL);
    } else {
      params.delete('tab');
    }
    const qs = params.toString();
    router.replace(
      `/profesor/alumnos/${client.id}/editar${qs ? `?${qs}` : ''}`,
      { scroll: false },
    );
  }

  async function handleDatosSubmit(payload: CreateClientPayload) {
    await updateMutation.mutateAsync(payload);
    router.push(`/profesor/alumnos/${client.id}`);
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value={TAB_DATOS}>Datos personales</TabsTrigger>
        <TabsTrigger value={TAB_PORTAL}>Acceso al portal</TabsTrigger>
      </TabsList>

      <TabsContent value={TAB_DATOS}>
        <AlumnoForm
          initial={{
            nombre: client.nombre,
            apellido: client.apellido,
            email: client.email ?? undefined,
            telefono: client.telefono ?? undefined,
            dni: client.dni ?? undefined,
            datos: client.datos,
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleDatosSubmit}
        />
      </TabsContent>

      <TabsContent value={TAB_PORTAL}>
        <AlumnoPortalAccessPanel client={client} />
      </TabsContent>
    </Tabs>
  );
}
