'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { resetPasswordRequest } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
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

export function RecoverResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const result = await resetPasswordRequest(token, password);
      toast.success(result.message);
      router.replace('/login');
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo actualizar la contraseña.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        'w-full max-w-[420px] border-white/25 bg-white/10 text-white shadow-[0_8px_40px_rgba(0,0,0,0.45)]',
        'backdrop-blur-2xl',
      )}
    >
      <CardHeader className="space-y-4 pb-2">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/branding/LGO600PX.png"
            alt="TuCoach"
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
            priority
          />
          <div className="text-left">
            <p className="font-display text-sm tracking-wider text-white sm:text-base">
              TUCOACH
            </p>
            <CardTitle className="text-2xl font-semibold tracking-wide text-white/70">
              Nueva clave
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center text-white/70">
          {token
            ? 'Elegí una contraseña de al menos 8 caracteres.'
            : 'Falta el enlace de recuperación. Pedí uno nuevo.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <Button
            asChild
            className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
          >
            <Link href="/recuperar">Pedir un enlace</Link>
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Contraseña nueva
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-white/90">
                Repetir contraseña
              </Label>
              <Input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="h-11 border-white/20 bg-white/95 text-foreground placeholder:text-muted-foreground focus-visible:ring-white/40"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar contraseña'
              )}
            </Button>
            <p className="text-center text-sm text-white/70">
              <Link href="/login" className="underline-offset-4 hover:underline">
                Volver a ingresar
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
