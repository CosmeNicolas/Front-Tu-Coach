'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { submitContactInquiry } from '@/lib/api/contact';
import { ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/auth/constants';
import {
  CONTACT_TOPICS,
  type ContactTopicValue,
  isContactTopic,
} from '@/lib/landing/contact';
import { CONTACT_EMAIL } from '@/lib/landing/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const fieldClassName =
  'border-white/15 bg-[#0A0A0A] text-white placeholder:text-[#525252] focus-visible:ring-white/20';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const motivoParam = searchParams.get('motivo');
  const initialMotivo = isContactTopic(motivoParam) ? motivoParam : 'general';

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [motivo, setMotivo] = useState<ContactTopicValue>(initialMotivo);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isContactTopic(motivoParam)) {
      setMotivo(motivoParam);
    }
  }, [motivoParam]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await submitContactInquiry({
        nombre: nombre.trim(),
        email: email.trim(),
        motivo,
        mensaje: mensaje.trim(),
      });
      setSent(true);
      toast.success(response.message);
    } catch (error) {
      let message = 'No pudimos enviar tu consulta. Probá de nuevo.';
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof TypeError) {
        message =
          process.env.NODE_ENV === 'development'
            ? `No se pudo conectar con la API (${API_BASE_URL}). ¿Está corriendo el backend?`
            : 'No se pudo conectar con el servidor. Intentá más tarde.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/15 bg-[#101010] p-8 text-center sm:p-10">
        <p className="font-display text-2xl tracking-wide text-white">¡Consulta enviada!</p>
        <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
          Te respondemos a la brevedad en{' '}
          <span className="text-white">{email.trim()}</span>.
        </p>
        <p className="mt-6 text-xs text-[#737373]">
          Si es urgente, también podés escribirnos a {CONTACT_EMAIL}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/15 bg-[#101010] p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-nombre" className="text-[#A3A3A3]">
            Nombre
          </Label>
          <Input
            id="contact-nombre"
            name="nombre"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className={fieldClassName}
            placeholder="Tu nombre"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-[#A3A3A3]">
            Email
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="contact-motivo" className="text-[#A3A3A3]">
          Motivo
        </Label>
        <select
          id="contact-motivo"
          name="motivo"
          required
          value={motivo}
          onChange={(event) => setMotivo(event.target.value as ContactTopicValue)}
          className={cn(
            'flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm',
            'focus-visible:outline-none focus-visible:ring-2',
            fieldClassName,
          )}
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value} className="bg-[#101010]">
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="contact-mensaje" className="text-[#A3A3A3]">
          Mensaje
        </Label>
        <Textarea
          id="contact-mensaje"
          name="mensaje"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={mensaje}
          onChange={(event) => setMensaje(event.target.value)}
          className={cn('min-h-[140px] resize-y', fieldClassName)}
          placeholder="Contanos qué necesitás: demo, plan para tu gym, dudas sobre planes..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20',
          'bg-white px-5 py-3 text-sm font-semibold text-[#050505] transition-colors',
          'hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto',
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enviando...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden />
            Enviar consulta
          </>
        )}
      </button>
    </form>
  );
}

function ContactFormFallback() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-white/15 bg-[#101010]">
      <Loader2 className="size-6 animate-spin text-[#737373]" aria-hidden />
    </div>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<ContactFormFallback />}>
      <ContactFormInner />
    </Suspense>
  );
}
