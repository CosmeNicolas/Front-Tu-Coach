import { Suspense } from 'react';
import { VerifyEmailView } from '@/components/auth/VerifyEmailView';

function VerifyEmailFallback() {
  return (
    <div className="h-[320px] w-full max-w-[420px] animate-pulse rounded-xl border border-white/20 bg-white/10 backdrop-blur-2xl" />
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailView />
    </Suspense>
  );
}
