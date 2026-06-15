'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useTenants } from '@/hooks/useGymAdmin';
import { useCreateAdminProfesor } from '@/hooks/useAdminProfesores';
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
  defaultTenantId?: string;
  trigger?: React.ReactNode;
}

export function NuevoProfesorDialog({ defaultTenantId, trigger }: Props) {
  const { data: tenants } = useTenants();
  const create = useCreateAdminProfesor();
  const [open, setOpen] = useState(false);
  const [tenantId, setTenantId] = useState(defaultTenantId ?? '');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');

  function resetForm() {
    setTenantId(defaultTenantId ?? '');
    setNombre('');
    setApellido('');
    setEmail('');
    setPassword('');
    setTelefono('');
  }

  async function handleSubmit() {
    if (!tenantId) {
      toast.error('Seleccioná un gimnasio');
      return;
    }
    if (!nombre.trim() || !apellido.trim()) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }
    if (!email.trim()) {
      toast.error('El email es obligatorio');
      return;
    }
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await create.mutateAsync({
        tenantId,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        password,
        telefono: telefono.trim() || undefined,
      });
      toast.success('Profesor creado');
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error('No se pudo crear el profesor', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && defaultTenantId) setTenantId(defaultTenantId);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo profesor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo profesor</DialogTitle>
          <DialogDescription>
            Alta global con acceso al gimnasio que elijas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prof-tenant">Gimnasio *</Label>
            <select
              id="prof-tenant"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">Seleccionar…</option>
              {tenants?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prof-nombre">Nombre *</Label>
              <Input
                id="prof-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prof-apellido">Apellido *</Label>
              <Input
                id="prof-apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prof-email">Email *</Label>
            <Input
              id="prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prof-password">Contraseña *</Label>
            <Input
              id="prof-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prof-telefono">Teléfono</Label>
            <Input
              id="prof-telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={create.isPending}
            onClick={() => void handleSubmit()}
          >
            {create.isPending ? 'Creando…' : 'Crear profesor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
