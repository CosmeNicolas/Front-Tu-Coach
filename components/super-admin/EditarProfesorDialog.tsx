'use client';

import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useTenants } from '@/hooks/useGymAdmin';
import { useUpdateAdminProfesor } from '@/hooks/useAdminProfesores';
import { ProfesorAdmin } from '@/types/admin';
import { UserStatus } from '@/types/auth';
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
  profesor: ProfesorAdmin;
  trigger?: React.ReactNode;
}

export function EditarProfesorDialog({ profesor, trigger }: Props) {
  const { data: tenants } = useTenants();
  const update = useUpdateAdminProfesor(profesor.id);
  const [open, setOpen] = useState(false);
  const [tenantId, setTenantId] = useState(profesor.tenantId);
  const [nombre, setNombre] = useState(profesor.nombre);
  const [apellido, setApellido] = useState(profesor.apellido);
  const [email, setEmail] = useState(profesor.email);
  const [telefono, setTelefono] = useState(profesor.telefono ?? '');
  const [estado, setEstado] = useState(profesor.estado);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!open) return;
    setTenantId(profesor.tenantId);
    setNombre(profesor.nombre);
    setApellido(profesor.apellido);
    setEmail(profesor.email);
    setTelefono(profesor.telefono ?? '');
    setEstado(profesor.estado);
    setPassword('');
  }, [open, profesor]);

  async function handleSubmit() {
    if (!tenantId) {
      toast.error('Seleccioná un gimnasio');
      return;
    }

    try {
      await update.mutateAsync({
        tenantId,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim() || null,
        estado,
        ...(password.length >= 8 ? { password } : {}),
      });
      toast.success('Profesor actualizado');
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
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar profesor</DialogTitle>
          <DialogDescription>
            {profesor.apellido}, {profesor.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-prof-tenant">Gimnasio</Label>
            <select
              id="edit-prof-tenant"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              {tenants?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-prof-nombre">Nombre</Label>
              <Input
                id="edit-prof-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prof-apellido">Apellido</Label>
              <Input
                id="edit-prof-apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prof-email">Email</Label>
            <Input
              id="edit-prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prof-telefono">Teléfono</Label>
            <Input
              id="edit-prof-telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prof-estado">Estado</Label>
            <select
              id="edit-prof-estado"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={estado}
              onChange={(e) => setEstado(e.target.value as UserStatus)}
            >
              <option value={UserStatus.ACTIVE}>Activo</option>
              <option value={UserStatus.BLOCKED}>Bloqueado</option>
              <option value={UserStatus.PENDING}>Pendiente</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-prof-password">Nueva contraseña</Label>
            <Input
              id="edit-prof-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dejar vacío para no cambiar"
              autoComplete="new-password"
            />
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
