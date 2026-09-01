'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Planification,
  PlanificationStatus,
} from '@/types/planification';

interface Props {
  plans: Planification[];
  alumnoNameById: Map<string, string>;
}

export function PlanificacionesDashboardPanel({
  plans,
  alumnoNameById,
}: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = plans
      .filter((p) => !p.esPlantilla)
      .map((p) => ({
        ...p,
        alumnoLabel:
          p.alumnoNombre ??
          (p.alumnoId ? alumnoNameById.get(p.alumnoId) : null) ??
          'Sin alumno',
      }))
      .sort((a, b) => {
        const aAct = a.estado === PlanificationStatus.ACTIVE ? 0 : 1;
        const bAct = b.estado === PlanificationStatus.ACTIVE ? 0 : 1;
        if (aAct !== bAct) return aAct - bAct;
        return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
      });
    if (!q) return rows.slice(0, 8);
    return rows
      .filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.alumnoLabel.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [alumnoNameById, plans, search]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Planificaciones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actual = la que el alumno está usando. Buscá por nombre del plan o
            del alumno.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/profesor/planificaciones">Ver todas</Link>
        </Button>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar planificación o alumno…"
        className="mb-4 max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No hay planificaciones con ese criterio.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Alumno</th>
                <th className="px-4 py-3 font-medium">Planificación</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const esActual = p.estado === PlanificationStatus.ACTIVE;
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-border hover:bg-muted/20 ${
                      esActual ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.alumnoLabel}
                    </td>
                    <td className="px-4 py-3 text-foreground">{p.titulo}</td>
                    <td className="px-4 py-3">
                      {esActual ? (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          Actual
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Archivada</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/profesor/planificaciones/${p.id}`}
                        className="font-medium text-foreground underline-offset-2 hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
