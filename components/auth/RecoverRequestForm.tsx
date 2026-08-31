'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPasswordRequest } from '@/lib/api/auth';
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

export function RecoverRequestForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await forgotPasswordRequest(email);
      setSent(true);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo enviar el pedido. Probá de nuevo.',
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
            width={140}
            height={176}
            className="h-28 w-auto shrink-0 object-contain sm:h-32"
            priority
          />
          <div className="text-left">
            <p className="font-display text-sm tracking-wider text-white sm:text-base">
              TUCOACH
            </p>
            <CardTitle className="text-2xl font-semibold tracking-wide text-white/70">
              Recuperar
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center text-white/70">
          {sent
            ? 'Si ese email está en TuCoach, vas a recibir un enlace. Revisá también spam.'
            : 'Ingresá el email de tu cuenta.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <Button
            asChild
            className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
          >
            <Link href="/login">Volver a ingresar</Link>
          </Button>
        ) : (
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
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Enviando…
                </>
              ) : (
                'Enviar enlace'
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
