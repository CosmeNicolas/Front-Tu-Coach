import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

function LoginFormFallback() {
  return (
    <div className="h-[420px] w-full max-w-[420px] animate-pulse rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl" />
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
        <ThemeToggle variant="compact" className="text-white [&_svg]:text-white/90" />
      </div>

      {/* Acentos decorativos (inspiración glass UI) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[18%] size-28 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[15%] right-[10%] size-36 rounded-full bg-white/10 blur-3xl"
      />

      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
