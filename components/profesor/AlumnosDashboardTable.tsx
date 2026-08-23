'use client';

import Link from 'next/link';
import { ClientStatus } from '@/types/client';
import { AlumnoDashboardRow } from '@/lib/profesor/dashboard-stats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabId = 'todos' | 'activos' | 'inactivos' | 'con-actividad' | 'sin-actividad';

function filterRows(rows: AlumnoDashboardRow[], tab: TabId): AlumnoDashboardRow[] {
  switch (tab) {
    case 'activos':
      return rows.filter((r) => r.estado === ClientStatus.ACTIVE);
    case 'inactivos':
      return rows.filter((r) => r.estado === ClientStatus.INACTIVE);
    case 'con-actividad':
      return rows.filter((r) => Boolean(r.ultimaActividadAt));
    case 'sin-actividad':
      return rows.filter((r) => !r.ultimaActividadAt);
    default:
      return rows;
  }
}

function AlumnosTable({ rows }: { rows: AlumnoDashboardRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No hay alumnos en este filtro.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Alumno</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Plan activo</th>
            <th className="px-4 py-3 font-medium">Sesiones</th>
            <th className="px-4 py-3 font-medium">Última actividad</th>
            <th className="px-4 py-3 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border hover:bg-muted/20">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">
                  {row.apellido}, {row.nombre}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.email ?? 'Sin email'}
                </p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    row.estado === ClientStatus.ACTIVE
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {row.estado === ClientStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 text-muted-foreground">
                {row.planActivoTitulo ?? '—'}
              </td>
              <td className="px-4 py-3 text-foreground">
                {row.sesionesCompletadas}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    row.ultimaActividadAt
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {row.ultimaActividadLabel}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/profesor/alumnos/${row.id}`}
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AlumnosDashboardTable({ rows }: { rows: AlumnoDashboardRow[] }) {
  const counts = {
    todos: rows.length,
    activos: filterRows(rows, 'activos').length,
    inactivos: filterRows(rows, 'inactivos').length,
    'con-actividad': filterRows(rows, 'con-actividad').length,
    'sin-actividad': filterRows(rows, 'sin-actividad').length,
  };

  return (
    <section
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
      data-tour="profesor-dashboard-alumnos"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Alumnos registrados
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Última actividad = última sesión completada en el portal (fecha y hora).
        </p>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="max-w-full flex-wrap">
          <TabsTrigger value="todos">Todos ({counts.todos})</TabsTrigger>
          <TabsTrigger value="activos">Activos ({counts.activos})</TabsTrigger>
          <TabsTrigger value="inactivos">
            Inactivos ({counts.inactivos})
          </TabsTrigger>
          <TabsTrigger value="con-actividad">
            Con actividad ({counts['con-actividad']})
          </TabsTrigger>
          <TabsTrigger value="sin-actividad">
            Sin actividad ({counts['sin-actividad']})
          </TabsTrigger>
        </TabsList>

        {(
          [
            'todos',
            'activos',
            'inactivos',
            'con-actividad',
            'sin-actividad',
          ] as TabId[]
        ).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <AlumnosTable rows={filterRows(rows, tab)} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
