'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginRequest } from '@/lib/api/auth';
import { getDashboardPath } from '@/lib/auth/roles';
import { ApiError } from '@/lib/api/client';
import { REMEMBER_EMAIL_KEY } from '@/lib/auth/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromLink = searchParams.get('email')?.trim() ?? '';
  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailFromLink) return;
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      // ignore
    }
  }, [emailFromLink]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await loginRequest({ email, password });
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
      toast.success('Sesión iniciada');
      router.replace(getDashboardPath(response.user.role));
    } catch (error) {
      let message = 'No se pudo iniciar sesión';
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof TypeError) {
        message =
          'No se pudo conectar con la API. En producción verificá NEXT_PUBLIC_API_URL en Netlify y CORS_ORIGIN en Vercel.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        'w-full max-w-[420px] border-white/25 bg-white/10 text-white shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
        'backdrop-blur-2xl ',
      )}
    >
      <CardHeader className="space-y-4 pb-2">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/branding/ZORRO1.png"
            alt="TuCoach"
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
            priority
          />
          <div className="text-left">
            <p className="font-display text-sm tracking-wider  text-white sm:text-base">
              TUCOACH
            </p>
            <CardTitle className="text-2xl font-semibold tracking-wide text-white/70">
              Ingresar
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center text-white/70">
          Accedé a tu panel de entrenamiento y planificaciones.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="h-11 border-white/20 bg-white/95 text-foreground placeholder:text-muted-foreground focus-visible:ring-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 border-white/20 bg-white/95 pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-white/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:bg-black/5 hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/80">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-white/40 bg-white/20 accent-white"
            />
            Recordar mi email en este dispositivo
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Ingresando…
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
