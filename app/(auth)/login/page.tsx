import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="absolute right-4 top-4">
        <ThemeToggle variant="compact" />
      </div>
      <div className="mb-8 text-center">
        <Image  src="/branding/ZORRO1.png"
          alt="Logo de TuCoach"
          width={200}
          height={100}
          className="mb-8"
          priority/>
          <h1 className="font-display text-4xl tracking-wide text-foreground">
            TuCoach
          </h1>
      </div>
      <Suspense fallback={<div className="h-48 w-full max-w-sm animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
