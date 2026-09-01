'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useAdminSponsors, useDeleteSponsor } from '@/hooks/useSponsors';
import { SponsorFormDialog } from '@/components/super-admin/SponsorFormDialog';
import { SponsorLogo } from '@/components/sponsors/SponsorLogo';
import { vigenciaLabel } from '@/lib/sponsors/vigencia';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Sponsor } from '@/types/sponsor';

function formatDayShort(isoDay: string): string {
  const [year, month, day] = isoDay.split('-');
  if (!year || !month || !day) return isoDay;
  return `${day}/${month}/${year.slice(-2)}`;
}

function vigenciaCorta(desde?: string, hasta?: string): string | null {
  const d = desde?.trim() ?? '';
  const h = hasta?.trim() ?? '';
  if (d && h) return `${formatDayShort(d)} → ${formatDayShort(h)}`;
  return vigenciaLabel(d, h);
}

function whatsappCorto(url: string): string {
  try {
    const parsed = new URL(url);
    const digits = parsed.pathname.replace(/\D/g, '');
    if (/^\d{10,15}$/.test(digits)) {
      if (digits.startsWith('54') && digits.length >= 11) {
        return `+54 ${digits.slice(2, 3)} ${digits.slice(3, 6)} …`;
      }
      return `+${digits}`;
    }
    if (parsed.hostname.includes('wa.me')) {
      return 'Enlace de WhatsApp';
    }
    return parsed.host;
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
}

export function SuperAdminBeneficiosView() {
  const { data, isLoading, error } = useAdminSponsors();
  const remove = useDeleteSponsor();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);

  const items = data?.items ?? [];

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(sponsor: Sponsor) {
    setEditing(sponsor);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success('Colaborador eliminado');
      setDeleteTarget(null);
    } catch (err) {
      toast.error('No se pudo eliminar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-foreground">
            Beneficios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Colaboradores, códigos y enlaces de WhatsApp que ven alumnos y
            profesores.
          </p>
        </div>
        <Button type="button" className="w-full sm:w-auto" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo colaborador
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando colaboradores…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          No se pudieron cargar los colaboradores.
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no hay colaboradores. Cargá el primero para que aparezca en
          Beneficios del alumno.
        </p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {items.map((sponsor) => {
            const vigencia = vigenciaCorta(
              sponsor.validoDesde,
              sponsor.validoHasta,
            );
            const enlace = sponsor.enlace?.trim();
            return (
              <li
                key={sponsor.id}
                className="flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <SponsorLogo
                    src={sponsor.imagenUrl}
                    alt={sponsor.nombre}
                    zoom={sponsor.imagenZoom}
                    className="size-14 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold uppercase tracking-wide text-foreground">
                      {sponsor.nombre}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {sponsor.descripcion}
                    </p>
                  </div>
                </div>

                <dl className="min-w-0 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-muted-foreground">Código:</dt>
                    <dd className="min-w-0 break-all font-mono font-semibold tracking-widest text-foreground">
                      {sponsor.codigo}
                    </dd>
                  </div>
                  {vigencia ? (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-muted-foreground">Vigencia:</dt>
                      <dd className="min-w-0 text-foreground">{vigencia}</dd>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-muted-foreground">WhatsApp:</dt>
                    <dd className="min-w-0 truncate text-foreground">
                      {enlace ? whatsappCorto(enlace) : 'Sin enlace'}
                    </dd>
                  </div>
                </dl>

                <div className="grid min-w-0 grid-cols-2 gap-2 border-t border-border pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-w-0 w-full px-2"
                    onClick={() => openEdit(sponsor)}
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-w-0 w-full px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteTarget(sponsor)}
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <SponsorFormDialog
        key={editing?.id ?? 'new'}
        open={formOpen}
        onOpenChange={(next) => {
          setFormOpen(next);
          if (!next) setEditing(null);
        }}
        sponsor={editing}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar colaborador?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{deleteTarget?.nombre}&quot; y el código dejará
              de verse en Beneficios. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={remove.isPending}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {remove.isPending ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
