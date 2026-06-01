'use client';

import {
  MaterializedSession,
  PlanificationConfig,
  ProgressionMode,
} from '@/types/planification';
import { etiquetaDia } from '@/lib/planification/preview-progression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeccionPreviewBlock } from './SeccionPreviewBlock';
import { CEMD } from '../constants';

interface Props {
  sesion: MaterializedSession;
  config: PlanificationConfig;
}

export function SesionPreviewCard({ sesion, config }: Props) {
  const tieneAjuste = sesion.secciones.some((g) =>
    g.items.some((entry) => {
      if ('kind' in entry && entry.kind === 'group') {
        return entry.items.some((s) => s.esPreAjuste || s.ajusteDesdeSesion);
      }
      return entry.esPreAjuste || entry.ajusteDesdeSesion;
    }),
  );

  return (
    <Card
      className={`border-2 ${tieneAjuste ? 'border-foreground' : 'border-border'} shadow-sm`}
    >
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-center text-base sm:text-lg">
          Sesión {sesion.numero}
          {sesion.diaBase ? (
            <span
              className={`mt-1 block text-sm font-normal ${CEMD.primaryClass}`}
            >
              {etiquetaDia(config.modoProgresion, sesion.diaBase)}
            </span>
          ) : null}
          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
            Semana {sesion.semanaDelPlan} · Día {sesion.dayIndexInWeek}
            {config.modoProgresion === ProgressionMode.LINEAL
              ? ` · Sesión ${sesion.numero}`
              : null}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-4 overflow-y-auto p-4 pt-0">
        {sesion.secciones.map((grupo, i) => (
          <SeccionPreviewBlock
            key={`${sesion.numero}-${grupo.titulo}-${i}`}
            grupo={grupo}
            sessionNum={sesion.numero}
          />
        ))}
        {sesion.secciones.length === 0 ? (
          <p className="text-center text-xs text-zinc-400">Sin ejercicios</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
