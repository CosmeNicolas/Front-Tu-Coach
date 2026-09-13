'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchSecurityEvents,
  SecurityEventRow,
  SecurityEventSeverity,
} from '@/lib/api/security-events';
import {
  createSecurityBlocklistEntry,
  deleteSecurityBlocklistEntry,
  fetchSecurityBlocklist,
  SecurityBlocklistKind,
  SecurityBlocklistRow,
} from '@/lib/api/security-blocklist';

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

const BLOCKLIST_KIND_LABELS: Record<SecurityBlocklistKind, string> = {
  ip_hash: 'IP hash',
  email: 'Email',
  email_domain: 'Dominio email',
};

export function SuperAdminSecurityView() {
  const [tab, setTab] = useState<'events' | 'blocklist'>('events');
  const [rows, setRows] = useState<SecurityEventRow[]>([]);
  const [blocklist, setBlocklist] = useState<SecurityBlocklistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SecurityEventSeverity | 'all'>('all');
  const [blockKind, setBlockKind] = useState<SecurityBlocklistKind>('ip_hash');
  const [blockValue, setBlockValue] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [blockHours, setBlockHours] = useState('24');
  const [savingBlock, setSavingBlock] = useState(false);

  const loadEvents = useCallback(async () => {
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

  const loadBlocklist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSecurityBlocklist();
      setBlocklist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la blocklist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'events') {
      void loadEvents();
    } else {
      void loadBlocklist();
    }
  }, [tab, loadEvents, loadBlocklist]);

  async function handleCreateBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingBlock(true);
    try {
      await createSecurityBlocklistEntry({
        kind: blockKind,
        value: blockValue.trim(),
        reason: blockReason.trim(),
        expiresInHours: blockHours ? Number(blockHours) : undefined,
      });
      toast.success('Bloqueo agregado');
      setBlockValue('');
      setBlockReason('');
      await loadBlocklist();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo agregar el bloqueo');
    } finally {
      setSavingBlock(false);
    }
  }

  async function handleRemoveBlock(id: string) {
    try {
      await deleteSecurityBlocklistEntry(id);
      toast.success('Bloqueo eliminado');
      setBlocklist((current) => current.filter((row) => row.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Seguridad</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Eventos anti-spam, bloqueos automáticos/manuales y rate limit compartido vía MongoDB.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as 'events' | 'blocklist')}>
        <TabsList>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="blocklist">Blocklist</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
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
            <Button type="button" variant="outline" onClick={() => void loadEvents()}>
              Actualizar
            </Button>
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
        </TabsContent>

        <TabsContent value="blocklist" className="space-y-4">
          <form
            onSubmit={handleCreateBlock}
            className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="block-kind">Tipo</Label>
              <select
                id="block-kind"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                value={blockKind}
                onChange={(event) => setBlockKind(event.target.value as SecurityBlocklistKind)}
              >
                <option value="ip_hash">IP hash</option>
                <option value="email">Email</option>
                <option value="email_domain">Dominio email</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="block-value">Valor</Label>
              <Input
                id="block-value"
                required
                value={blockValue}
                onChange={(event) => setBlockValue(event.target.value)}
                placeholder="Copiá el ipHash de un evento"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="block-reason">Motivo</Label>
              <Input
                id="block-reason"
                required
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                placeholder="Spam repetido en contacto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="block-hours">Expira en (horas, vacío = permanente)</Label>
              <Input
                id="block-hours"
                type="number"
                min={1}
                value={blockHours}
                onChange={(event) => setBlockHours(event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={savingBlock}>
                {savingBlock ? 'Guardando…' : 'Agregar bloqueo'}
              </Button>
            </div>
          </form>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => void loadBlocklist()}>
              Actualizar
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-[880px] w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                  <th className="px-4 py-3 font-medium">Origen</th>
                  <th className="px-4 py-3 font-medium">Motivo</th>
                  <th className="px-4 py-3 font-medium">Expira</th>
                  <th className="px-4 py-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Cargando blocklist…
                    </td>
                  </tr>
                ) : blocklist.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No hay bloqueos activos.
                    </td>
                  </tr>
                ) : (
                  blocklist.map((row) => (
                    <tr key={row.id} className="border-t border-border align-top">
                      <td className="px-4 py-3">{BLOCKLIST_KIND_LABELS[row.kind]}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.value}</td>
                      <td className="px-4 py-3">{row.source}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.reason}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.expiresAt ? formatDate(row.expiresAt) : 'Permanente'}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void handleRemoveBlock(row.id)}
                        >
                          Quitar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
