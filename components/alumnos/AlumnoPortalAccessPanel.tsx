'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useClientPortalAccess,
  useUpsertClientPortalAccess,
} from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types/client';

function generatePassword(): string {
  const chars =
    'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$';
  let out = '';
  for (let i = 0; i < 10; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${out}Aa1`;
}

interface Props {
  client: Client;
}

export function AlumnoPortalAccessPanel({ client }: Props) {
  const { data: portal, isLoading } = useClientPortalAccess(client.id);
  const upsert = useUpsertClientPortalAccess(client.id);

  const [email, setEmail] = useState(client.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (portal?.email) setEmail(portal.email);
    else if (client.email) setEmail(client.email);
  }, [portal?.email, client.email]);

  const hasAccount = portal?.hasAccount ?? Boolean(client.userId);
  const loginUrl =
    portal?.loginUrl ??
    (email.trim()
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/login?email=${encodeURIComponent(email.trim())}`
      : null);

  async function handleSave() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Ingresá el email de acceso del alumno');
      return;
    }
    if (!hasAccount && password.trim().length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres al crear el acceso');
      return;
    }
    if (password.trim() && password.trim().length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const result = await upsert.mutateAsync({
        email: trimmedEmail,
        password: password.trim() || undefined,
      });
      setPassword('');
      toast.success(
        hasAccount ? 'Acceso actualizado' : 'Cuenta de portal creada',
        {
          description: result.email ?? undefined,
        },
      );
    } catch (err) {
      toast.error('No se pudo guardar el acceso', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function copyLoginLink() {
    if (!loginUrl) {
      toast.error('Guardá el acceso con un email válido para generar el enlace');
      return;
    }
    try {
      await navigator.clipboard.writeText(loginUrl);
      toast.success('Enlace copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar. Copiá el enlace manualmente.');
    }
  }

  async function copyCredentials() {
    if (!email.trim() || !loginUrl) return;
    const text = [
      'TuCoach — acceso alumno',
      `Email: ${email.trim()}`,
      password.trim() ? `Contraseña: ${password.trim()}` : '(usá la contraseña que configuraste)',
      `Ingreso: ${loginUrl}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Datos de acceso copiados');
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando acceso al portal…</p>;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div
        className={`rounded-lg border px-4 py-3 text-sm ${
          hasAccount
            ? 'border-border bg-muted text-foreground'
            : 'border-border bg-secondary text-muted-foreground'
        }`}
      >
        {hasAccount
          ? 'Este alumno ya tiene cuenta para ingresar al portal.'
          : 'Sin cuenta de portal. Creá email y contraseña para que pueda ver su planificación.'}
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Email de acceso</span>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alumno@ejemplo.com"
            autoComplete="off"
          />
          <span className="text-xs text-muted-foreground">
            Es el usuario con el que el alumno inicia sesión.
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">
            {hasAccount ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          </span>
          <div className="flex gap-2">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={hasAccount ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
              autoComplete="new-password"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              setPassword(generatePassword());
              setShowPassword(true);
            }}
          >
            Generar contraseña segura
          </Button>
        </label>
      </div>

      {loginUrl ? (
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Enlace para compartir
          </p>
          <p className="mt-2 break-all text-sm text-foreground">{loginUrl}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={copyLoginLink}>
              Copiar enlace
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={copyCredentials}>
              Copiar email + enlace
            </Button>
          </div>
        </div>
      ) : null}

      <Button
        type="button"
        disabled={upsert.isPending}
        className="w-full bg-zinc-900 text-white hover:bg-zinc-700"
        onClick={handleSave}
      >
        {upsert.isPending
          ? 'Guardando…'
          : hasAccount
            ? 'Actualizar acceso'
            : 'Crear acceso al portal'}
      </Button>
    </div>
  );
}
