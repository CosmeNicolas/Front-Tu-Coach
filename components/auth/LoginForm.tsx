'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { loginRequest } from '@/lib/api/auth';
import { getDashboardPath } from '@/lib/auth/roles';
import { ApiError } from '@/lib/api/client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromLink = searchParams.get('email')?.trim() ?? '';
  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await loginRequest({ email, password });
      toast.success('Sesión iniciada');
      router.replace(getDashboardPath(response.user.role));
    } catch (error) {
      let message = 'No se pudo iniciar sesión';
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof TypeError) {
        message =
          'No se pudo conectar con el servidor. Verificá que el backend esté corriendo en el puerto 3001.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-ring"
          placeholder="admin@tucoach.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-ring"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}
