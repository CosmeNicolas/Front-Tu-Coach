'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useAdminSponsors, useDeleteSponsor } from '@/hooks/useSponsors';
import { SponsorFormDialog } from '@/components/super-admin/SponsorFormDialog';
import { SponsorLogo } from '@/components/sponsors/SponsorLogo';
import { vigenciaLabel } from '@/lib/sponsors/vigencia';
import { Badge } from '@/components/ui/badge';
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
        <Button type="button" onClick={openCreate}>
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
            const vigencia = vigenciaLabel(
              sponsor.validoDesde,
              sponsor.validoHasta,
            );
            return (
            <li
              key={sponsor.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <SponsorLogo
                src={sponsor.imagenUrl}
                alt={sponsor.nombre}
                zoom={sponsor.imagenZoom}
                className="size-24 shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{sponsor.nombre}</p>
                  <Badge variant={sponsor.activo ? 'default' : 'secondary'}>
                    {sponsor.activo ? 'Visible' : 'Oculto'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{sponsor.descripcion}</p>
                <p className="font-mono text-sm font-semibold tracking-widest text-foreground">
                  {sponsor.codigo}
                </p>
                {vigencia ? (
                  <p className="text-xs text-muted-foreground">{vigencia}</p>
                ) : null}
                {sponsor.enlace?.trim() ? (
                  <p className="truncate text-xs text-muted-foreground">
                    WhatsApp: {sponsor.enlace}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Sin enlace</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Editar ${sponsor.nombre}`}
                  onClick={() => openEdit(sponsor)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Eliminar ${sponsor.nombre}`}
                  onClick={() => setDeleteTarget(sponsor)}
                >
                  <Trash2 className="size-4" />
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
