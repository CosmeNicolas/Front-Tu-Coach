'use client';

import Link from 'next/link';
import { use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Check, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import {
  useCoachRelationshipStatus,
  useRequestCoachRelationship,
} from '@/hooks/useCoachRelationships';
import { usePublicProfessor } from '@/hooks/useProfessorCatalog';
import { professorPhotoSrc } from '@/lib/api/professor-catalog';
import { Role } from '@/types/auth';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { Button } from '@/components/ui/button';

export function ProfessorDetailView({ slug: slugProp }: { slug?: string }) {
  const slug = slugProp ?? '';
  const { data, error, isLoading } = usePublicProfessor(slug);
  const { data: me } = useAuth();
  const isAlumno = me?.role === Role.ALUMNO;
  const statusQuery = useCoachRelationshipStatus(slug, Boolean(isAlumno));
  const request = useRequestCoachRelationship();

  async function handleRequest() {
    try {
      await request.mutateAsync({ professorSlug: slug });
      toast.success('Solicitud enviada al profesor');
      void statusQuery.refetch();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo enviar la solicitud',
      );
    }
  }

  if (isLoading) {
    return (
      <div className={LANDING_CONTAINER}>
        <p className="text-sm text-[#737373]">Cargando perfil…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${LANDING_CONTAINER} space-y-4`}>
        <Button asChild variant="ghost" className="text-[#A3A3A3]">
          <Link href="/profesores">
            <FontAwesomeIcon icon={faCircleArrowLeft} className="size-4" />
            Volver
          </Link>
        </Button>
        <p className="text-sm text-[#A3A3A3]">
          {error instanceof ApiError && error.status === 404
            ? 'Profesor no encontrado o catálogo desactivado.'
            : 'No se pudo cargar el perfil.'}
        </p>
      </div>
    );
  }

  const modalities: string[] = [];
  if (data.modalidadOnline) modalities.push('Online');
  if (data.modalidadPresencial) modalities.push('Presencial');

  const relStatus = statusQuery.data?.status;
  const cta = (() => {
    if (!me) {
      return (
        <LandingButton href="/login" variant="primary">
          Ingresá para solicitar vínculo
        </LandingButton>
      );
    }
    if (!isAlumno) {
      return (
        <LandingButton href="/contacto" variant="secondary">
          Contacto
        </LandingButton>
      );
    }
    if (relStatus === 'pending') {
      return (
        <Button disabled variant="secondary">
          Solicitud pendiente
        </Button>
      );
    }
    if (relStatus === 'accepted') {
      return (
        <Button asChild variant="secondary">
          <Link href="/alumno/solicitudes">Ya estás vinculado</Link>
        </Button>
      );
    }
    return (
      <Button
        disabled={request.isPending}
        onClick={() => void handleRequest()}
      >
        {request.isPending ? 'Enviando…' : 'Solicitar vínculo'}
      </Button>
    );
  })();

  return (
    <div className={LANDING_CONTAINER}>
      <Button asChild variant="ghost" className="-ml-2 mb-6 text-[#A3A3A3]">
        <Link href="/profesores">
          <FontAwesomeIcon icon={faCircleArrowLeft} className="size-4" />
          Profesores
        </Link>
      </Button>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-end gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#101010] sm:size-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={professorPhotoSrc(data.fotoUrl)}
              alt={data.displayName}
              className="size-full object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
              {modalities.length ? modalities.join(' · ') : 'Entrenador'}
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-wide text-white sm:text-5xl">
              {data.displayName}
            </h1>
          </div>
        </div>
        {data.ubicacion ? (
          <p className="mt-3 flex items-center gap-1.5 text-[#A3A3A3]">
            <MapPin className="size-4" aria-hidden />
            {data.ubicacion}
          </p>
        ) : null}
        <p className="mt-6 text-lg leading-relaxed text-[#A3A3A3]">
          {data.bio || 'Entrenador en TuCoach.'}
        </p>

        <ul className="mt-8 space-y-3">
          {[
            ...(data.especialidades ?? []).map((e) => `Especialidad: ${e}`),
            ...(data.deportes ?? []).map((d) => `Deporte: ${d}`),
            data.redes.instagram ? `Instagram: ${data.redes.instagram}` : null,
            data.redes.website ? `Web: ${data.redes.website}` : null,
          ]
            .filter(Boolean)
            .map((f) => (
              <li
                key={f as string}
                className="flex items-start gap-2.5 text-[#A3A3A3]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-white"
                  aria-hidden
                />
                {f}
              </li>
            ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          {cta}
          <LandingButton href="/profesores" variant="secondary">
            Ver otros
          </LandingButton>
        </div>
        <p className="mt-4 text-xs text-[#737373]">
          Al aceptar, el vínculo queda registrado. Historial y chat dependen de
          los permisos que active el alumno.
        </p>
      </div>
    </div>
  );
}

export function ProfessorDetailPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <ProfessorDetailView slug={slug} />;
}
