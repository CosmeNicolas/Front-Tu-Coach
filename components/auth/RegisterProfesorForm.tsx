'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { registerProfesorRequest } from '@/lib/api/auth';
import { getDashboardPath } from '@/lib/auth/roles';
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

export function RegisterProfesorForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreEstudio, setNombreEstudio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await registerProfesorRequest({
        nombre,
        apellido,
        nombreEstudio: nombreEstudio.trim() || undefined,
        email,
        password,
      });
      toast.success('Cuenta creada. Tenés 7 días de prueba Premium.');
      router.replace(getDashboardPath(response.user.role));
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo crear la cuenta. Probá de nuevo.',
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
          <div>
            <p className="font-display text-sm tracking-wider text-white sm:text-base">
              TUCOACH
            </p>
            <CardTitle className="text-2xl font-semibold tracking-wide text-white/70">
              Probar 7 días
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-center text-white/70">
          Cuenta de profesor. Cuando termina el trial pasás a Free: hasta 2
          alumnos y 1 planificación activa. No borramos tus datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="estudio" className="text-white/90">
              Nombre del estudio (opcional)
            </Label>
            <Input
              id="estudio"
              value={nombreEstudio}
              onChange={(e) => setNombreEstudio(e.target.value)}
              placeholder="Estudio Niev"
              className="h-11 border-white/20 bg-white/95 text-foreground"
            />
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
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-neutral-950 text-base font-medium text-white hover:bg-neutral-800"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Creando…
              </>
            ) : (
              'Crear cuenta de profe'
            )}
          </Button>
          <p className="text-center text-sm text-white/70">
            <Link href="/login" className="underline-offset-4 hover:underline">
              Ya tengo cuenta
            </Link>
            {' · '}
            <Link href="/terminos" className="underline-offset-4 hover:underline">
              Términos
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
