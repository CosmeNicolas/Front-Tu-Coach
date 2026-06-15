'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useUpdateTenant } from '@/hooks/useTenantsAdmin';
import { TenantStatus } from '@/types/admin';
import { TenantSummary } from '@/types/gym-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  tenant: TenantSummary;
  trigger?: React.ReactNode;
}

export function EditarGimnasioDialog({ tenant, trigger }: Props) {
  const update = useUpdateTenant(tenant.id);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(tenant.nombre);
  const [slug, setSlug] = useState(tenant.slug);
  const [estado, setEstado] = useState(tenant.estado);

  useEffect(() => {
    if (!open) return;
    setNombre(tenant.nombre);
    setSlug(tenant.slug);
    setEstado(tenant.estado);
  }, [open, tenant]);

  async function handleSubmit() {
    const trimmed = nombre.trim();
    if (trimmed.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      await update.mutateAsync({
        nombre: trimmed,
        slug: slug.trim(),
        estado: estado as TenantStatus,
      });
      toast.success('Gimnasio actualizado');
      setOpen(false);
    } catch (err) {
      toast.error('No se pudo actualizar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" type="button">
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar gimnasio</DialogTitle>
          <DialogDescription>{tenant.nombre}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-gym-nombre">Nombre</Label>
            <Input
              id="edit-gym-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-gym-slug">Slug</Label>
            <Input
              id="edit-gym-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-gym-estado">Estado</Label>
            <select
              id="edit-gym-estado"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value={TenantStatus.ACTIVE}>Activo</option>
              <option value={TenantStatus.SUSPENDED}>Suspendido</option>
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={update.isPending}
            onClick={() => void handleSubmit()}
          >
            {update.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
