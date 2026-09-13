'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { verifyEmailRequest } from '@/lib/api/auth';
import { getDashboardPath } from '@/lib/auth/roles';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(
    token ? 'Confirmando tu email…' : 'El enlace no es válido.',
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const response = await verifyEmailRequest(token);
        if (cancelled) return;
        setStatus('success');
        setMessage('Email confirmado. Entrando a TuCoach…');
        toast.success('Cuenta activada');
        router.replace(getDashboardPath(response.user.role));
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          error instanceof ApiError
            ? error.message
            : 'No pudimos confirmar tu email. Pedí un reenvío desde el registro.',
        );
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

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
              Verificar email
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center text-white/70">{message}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {status === 'loading' ? <Loader2 className="h-8 w-8 animate-spin text-white/80" /> : null}
        {status === 'error' ? (
          <Button
            asChild
            className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
          >
            <Link href="/registro">Volver al registro</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
