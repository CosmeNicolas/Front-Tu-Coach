'use client';

import { usePublicStandardPlanPreview } from '@/hooks/useStandardPlans';
import type { PublicPlanSessionPreview } from '@/lib/api/standard-plans';
import { EjercicioCatalogoImage } from '@/components/ejercicios/EjercicioCatalogoImage';
import { formatValorDisplay } from '@/components/planificaciones/asistente/preview/preview-format';
import { LANDING } from '@/lib/landing/constants';
import { TipoItem, UnidadTrabajo } from '@/types/planification';

function sectionLabel(tipo: string, titulo: string) {
  return titulo || tipo.replace(/_/g, ' ');
}

function SessionPreviewBlock({
  session,
}: {
  session: PublicPlanSessionPreview;
}) {
  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={{
        borderColor: LANDING.border,
        background: LANDING.card,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#737373]">
        Así se ve una sesión
      </p>
      <h3 className="mt-1 font-display text-xl tracking-wide text-white">
        Sesión {session.numero}
        <span className="ml-2 font-sans text-sm font-normal text-[#737373]">
          · día {session.dayIndexInWeek} · semana {session.semanaDelPlan}
        </span>
      </h3>

      <div className="mt-4 space-y-5">
        {(session.secciones ?? []).map((sec, i) => (
          <div key={`${sec.titulo}-${i}`}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A3A3A3]">
              {sectionLabel(sec.tipoSeccion, sec.titulo)}
            </p>
            <ul className="space-y-2">
              {sec.items.map((entry, j) => {
                if ('kind' in entry && entry.kind === 'group') {
                  return (
                    <li
                      key={j}
                      className="rounded-xl border border-white/10 bg-black/30 p-3"
                    >
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[#737373]">
                        {entry.tipoGrupo}
                      </p>
                      <div className="space-y-2">
                        {entry.items.map((item, k) => (
                          <SessionExerciseRow key={k} item={item} />
                        ))}
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={j}>
                    <SessionExerciseRow item={entry} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionExerciseRow({
  item,
}: {
  item: {
    ejercicio: string;
    valor: string;
    gif?: string | null;
    tipoItem?: string;
    unidadTrabajo?: string;
  };
}) {
  const valor = formatValorDisplay(
    item.valor,
    item.tipoItem as TipoItem | undefined,
    item.unidadTrabajo as UnidadTrabajo | undefined,
  );

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <EjercicioCatalogoImage
        src={item.gif}
        alt={item.ejercicio}
        eager
        containerClassName="size-12 shrink-0 overflow-hidden rounded-lg border border-white/10"
        className="ejercicio-gif-fondo size-full object-contain"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {item.ejercicio}
        </p>
        <p className="text-xs text-[#A3A3A3]">{valor}</p>
      </div>
    </div>
  );
}

export function StandardPlanPreviewSection({ slug }: { slug: string }) {
  const { data, isLoading, error } = usePublicStandardPlanPreview(slug);

  if (isLoading) {
    return (
      <p className="mt-12 text-sm text-[#737373]">Cargando vista previa…</p>
    );
  }

  if (error || !data?.sessionPreview) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-10">
      <SessionPreviewBlock session={data.sessionPreview} />
    </div>
  );
}
