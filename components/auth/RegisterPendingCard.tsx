'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { resendVerificationRequest } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';

interface RegisterPendingCardProps {
  email: string;
  message: string;
}

export function RegisterPendingCard({ email, message }: RegisterPendingCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    try {
      const result = await resendVerificationRequest(email);
      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudo reenviar el email. Probá más tarde.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 text-center">
      <p className="text-sm leading-relaxed text-white/80">{message}</p>
      <p className="text-sm text-white/60">
        Email: <span className="font-medium text-white">{email}</span>
      </p>
      <Button
        type="button"
        variant="outline"
        className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20"
        disabled={loading}
        onClick={() => void handleResend()}
      >
        {loading ? 'Reenviando…' : 'Reenviar email de confirmación'}
      </Button>
      <p className="text-sm text-white/70">
        <Link href="/login" className="underline-offset-4 hover:underline">
          Volver a ingresar
        </Link>
      </p>
    </div>
  );
}
