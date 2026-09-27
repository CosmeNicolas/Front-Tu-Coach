'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  registerAutogestionadoRequest,
  isRegisterPendingResponse,
} from '@/lib/api/auth';
import { getDashboardPath } from '@/lib/auth/roles';
import { ApiError } from '@/lib/api/client';
import { RegisterPendingCard } from '@/components/auth/RegisterPendingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Turnstile, useTurnstile } from '@/components/ui/turnstile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { STANDARD_PLAN_TRIAL_SESSIONS } from '@/lib/landing/constants';
import { standardPlanTrialPhrase } from '@/lib/landing/pricing';
import { cn } from '@/lib/utils';

export function RegisterAutogestionadoForm({
  standardPlanSlug,
  planNombre,
  trialSessions = STANDARD_PLAN_TRIAL_SESSIONS,
}: {
  standardPlanSlug?: string;
  planNombre?: string;
  trialSessions?: number;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<{
    email: string;
    message: string;
  } | null>(null);

  const turnstile = useTurnstile();
  const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const trialPhrase = standardPlanTrialPhrase(trialSessions);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (turnstileEnabled && !turnstile.token) {
      toast.error('Completá la verificación de seguridad antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerAutogestionadoRequest({
        nombre,
        apellido,
        email,
        password,
        turnstileToken: turnstile.token ?? undefined,
        standardPlanSlug: standardPlanSlug || undefined,
      });
      if (isRegisterPendingResponse(response)) {
        setPending({ email: response.email, message: response.message });
        toast.success('Revisá tu email para confirmar la cuenta.');
        return;
      }
      toast.success(
        planNombre
          ? `Listo. Empezás con «${planNombre}» (${trialPhrase} de prueba).`
          : `Listo. Te asignamos un plan con ${trialPhrase} de prueba.`,
      );
      router.replace(getDashboardPath(response.user.role));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo crear la cuenta. Probá de nuevo.',
      );
      turnstile.reset();
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
        <Link
          href="/"
          className="flex items-center justify-center gap-4 rounded-lg transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Volver al inicio"
        >
          <Image
            src="/branding/LGO600PX.png"
            alt=""
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
            priority
          />
          <div>
            <p className="font-display text-sm tracking-wider text-white sm:text-base">
              TUCOACH
            </p>
            <CardTitle className="text-2xl font-semibold tracking-wide text-white/70">
              Plan estándar
            </CardTitle>
          </div>
        </Link>
        <CardDescription className="text-center text-white/70">
          {planNombre
            ? `«${planNombre}». ${trialPhrase} gratis; después desbloqueás el bloque completo.`
            : `${trialPhrase} de prueba gratis. Sin kilos prescritos — ajustás la carga a tu nivel.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pending ? (
          <RegisterPendingCard email={pending.email} message={pending.message} />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-white/90">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-11 border-white/20 bg-white/95 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-white/90">
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="h-11 border-white/20 bg-white/95 text-foreground"
                />
              </div>
            </div>
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
                className="h-11 border-white/20 bg-white/95 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-white/20 bg-white/95 text-foreground"
              />
            </div>
            {turnstileEnabled && (
              <div className="flex justify-center">
                <Turnstile
                  theme="dark"
                  onVerify={turnstile.onVerify}
                  onError={turnstile.onError}
                  onExpire={turnstile.onExpire}
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || (turnstileEnabled && !turnstile.token)}
              className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creando…
                </>
              ) : (
                'Empezar gratis'
              )}
            </Button>
            <p className="text-center text-sm text-white/70">
              <Link href="/login" className="underline-offset-4 hover:underline">
                Ya tengo cuenta
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
