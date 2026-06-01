import Link from 'next/link';
import {
  Planification,
  PROGRESSION_MODE_LABELS,
} from '@/types/planification';
import { ProgresoAlumnoPanel } from '@/components/planificaciones/ProgresoAlumnoPanel';

export function PlanificacionDetalleCard({
  planification,
}: {
  planification: Planification;
}) {
  const { config } = planification;
  const totalItems = planification.secciones.reduce(
    (acc, s) => acc + s.items.length,
    0,
  );

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {planification.titulo}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Versión {planification.version} · {planification.estado}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/profesor/planificaciones/${planification.id}/asistente`}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {planification.secciones.length === 0
              ? 'Abrir Asistente'
              : 'Editar en Asistente'}
          </Link>
          <Link
            href={`/profesor/planificaciones/${planification.id}/editar`}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Editar metadata
          </Link>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Item label="Modo" value={PROGRESSION_MODE_LABELS[config.modoProgresion]} />
        <Item label="Semanas" value={String(config.semanasDelPlan)} />
        <Item label="Frecuencia semanal" value={String(config.frecuenciaSemanal)} />
        <Item label="Total sesiones" value={String(config.totalSesiones)} />
      </dl>

      <ProgresoAlumnoPanel planification={planification} />

      <p className="mt-4 text-sm text-zinc-500">
        {planification.secciones.length === 0
          ? 'Sin secciones todavía. Abrí el Asistente para cargar entrada en calor, ejercicios principales y vuelta a la calma.'
          : `${planification.secciones.length} secciones · ${totalItems} ítems cargados`}
      </p>
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
