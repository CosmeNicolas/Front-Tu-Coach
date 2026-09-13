'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  fetchSecurityEvents,
  SecurityEventRow,
  SecurityEventSeverity,
} from '@/lib/api/security-events';

function formatMeta(meta: SecurityEventRow['meta']): string {
  const entries = Object.entries(meta);
  if (entries.length === 0) {
    return '—';
  }
  return entries.map(([key, value]) => `${key}=${value}`).join(' · ');
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(value));
}

export function SuperAdminSecurityView() {
  const [rows, setRows] = useState<SecurityEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SecurityEventSeverity | 'all'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSecurityEvents({
        limit: 100,
        severity: severity === 'all' ? undefined : severity,
      });
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los eventos');
    } finally {
      setLoading(false);
    }
  }, [severity]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Seguridad</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Eventos recientes de contacto, registro y anti-spam. Las IPs se guardan hasheadas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={severity}
            onChange={(event) =>
              setSeverity(event.target.value as SecurityEventSeverity | 'all')
            }
          >
            <option value="all">Todos</option>
            <option value="warn">Solo alertas</option>
            <option value="info">Solo info</option>
          </select>
          <Button type="button" variant="outline" onClick={() => void load()}>
            Actualizar
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[960px] w-full text-sm">
          <thead className="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Evento</th>
              <th className="px-4 py-3 font-medium">Severidad</th>
              <th className="px-4 py-3 font-medium">IP hash</th>
              <th className="px-4 py-3 font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando eventos…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Todavía no hay eventos registrados.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.event}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.severity === 'warn'
                          ? 'rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300'
                          : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
                      }
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {row.ipHash ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatMeta(row.meta)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
