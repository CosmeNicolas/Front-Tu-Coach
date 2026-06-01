import Link from 'next/link';
import { Client } from '@/types/client';

const SEXO_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
  no_informado: 'No informado',
};

export function AlumnoDetalleCard({ client }: { client: Client }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {client.apellido}, {client.nombre}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {client.email ?? 'Sin email'} · {client.telefono ?? 'Sin teléfono'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/profesor/alumnos/${client.id}/editar`}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Editar
          </Link>
          <Link
            href={`/profesor/alumnos/${client.id}/editar?tab=portal`}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            {client.userId ? 'Acceso portal' : 'Crear acceso portal'}
          </Link>
          <Link
            href={`/profesor/planificaciones/nueva?alumnoId=${client.id}`}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Nueva planificación
          </Link>
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
        <Item label="Edad" value={client.datos.edad ? `${client.datos.edad} años` : '—'} />
        <Item label="Peso" value={client.datos.peso ? `${client.datos.peso} kg` : '—'} />
        <Item label="Altura" value={client.datos.altura ? `${client.datos.altura} cm` : '—'} />
        <Item
          label="Sexo"
          value={SEXO_LABELS[client.datos.sexo ?? 'no_informado'] ?? '—'}
        />
        <Item label="Objetivo" value={client.datos.objetivo || '—'} />
        <Item label="Condicionante" value={client.datos.condicionanteDeCarga || '—'} />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  );
}
