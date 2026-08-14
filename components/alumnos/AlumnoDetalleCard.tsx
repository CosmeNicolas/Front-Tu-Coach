'use client';

import Link from 'next/link';
import { Client } from '@/types/client';
import { RenovarDesdeAnteriorButton } from '@/components/planificaciones/RenovarDesdeAnteriorButton';
import { Button } from '@/components/ui/button';

const SEXO_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
  no_informado: 'No informado',
};

export function AlumnoDetalleCard({ client }: { client: Client }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {client.apellido}, {client.nombre}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {client.email ?? 'Sin email'} · {client.telefono ?? 'Sin teléfono'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/profesor/alumnos/${client.id}/editar`}>Editar</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/profesor/alumnos/${client.id}/editar?tab=portal`}>
              {client.userId ? 'Acceso portal' : 'Crear acceso portal'}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/profesor/mensajes?alumnoId=${client.id}`}>
              Mensajes
            </Link>
          </Button>
          <RenovarDesdeAnteriorButton alumnoId={client.id} size="sm" />
          <Button asChild size="sm">
            <Link
              href={`/profesor/planificaciones/nueva?alumnoId=${client.id}`}
            >
              Nueva planificación
            </Link>
          </Button>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item label="DNI" value={client.dni ?? '—'} />
        <Item
          label="Portal alumno"
          value={
            client.userId
              ? 'Cuenta de login vinculada'
              : client.email
                ? 'Pendiente de vincular login'
                : 'Sin email'
          }
        />
        <Item
          label="Edad"
          value={client.datos.edad ? `${client.datos.edad} años` : '—'}
        />
        <Item
          label="Peso"
          value={client.datos.peso ? `${client.datos.peso} kg` : '—'}
        />
        <Item
          label="Altura"
          value={client.datos.altura ? `${client.datos.altura} cm` : '—'}
        />
        <Item
          label="Sexo"
          value={SEXO_LABELS[client.datos.sexo ?? 'no_informado'] ?? '—'}
        />
        <Item label="Objetivo" value={client.datos.objetivo || '—'} />
        <Item
          label="Condicionante"
          value={client.datos.condicionanteDeCarga || '—'}
        />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
