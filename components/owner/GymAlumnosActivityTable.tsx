'use client';

import Link from 'next/link';
import type { GymAlumnoActivity } from '@/types/gym-admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabId = 'todos' | 'activos' | 'inactivos' | 'con-actividad' | 'sin-actividad';

function filterRows(rows: GymAlumnoActivity[], tab: TabId): GymAlumnoActivity[] {
  switch (tab) {
    case 'activos':
      return rows.filter((r) => r.estado === 'activo');
    case 'inactivos':
      return rows.filter((r) => r.estado !== 'activo');
    case 'con-actividad':
      return rows.filter((r) => Boolean(r.ultimaActividadAt));
    case 'sin-actividad':
      return rows.filter((r) => !r.ultimaActividadAt);
    default:
      return rows;
  }
}

function TableBody({
  rows,
  basePath,
}: {
  rows: GymAlumnoActivity[];
  basePath: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No hay alumnos en este filtro.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-[800px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Alumno</th>
            <th className="px-4 py-3 font-medium">Profesor</th>
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
                <Link
                  href={`${basePath}/profesores/${row.profesorId}`}
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  {row.profesorNombre}
                </Link>
              </td>
              <td className="px-4 py-3 text-foreground">
                {row.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </td>
              <td className="max-w-[160px] truncate px-4 py-3 text-muted-foreground">
                {row.planActivoTitulo ?? '—'}
              </td>
              <td className="px-4 py-3">{row.sesionesCompletadas}</td>
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
                  href={`${basePath}/profesores/${row.profesorId}`}
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

export function GymAlumnosActivityTable({
  rows,
  basePath,
}: {
  rows: GymAlumnoActivity[];
  basePath: string;
}) {
  const counts = {
    todos: rows.length,
    activos: filterRows(rows, 'activos').length,
    inactivos: filterRows(rows, 'inactivos').length,
    'con-actividad': filterRows(rows, 'con-actividad').length,
    'sin-actividad': filterRows(rows, 'sin-actividad').length,
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Alumnos del gimnasio
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Última actividad 
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
            <TableBody rows={filterRows(rows, tab)} basePath={basePath} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
