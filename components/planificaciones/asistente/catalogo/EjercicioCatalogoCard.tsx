'use client';

import { EjercicioCatalogo, nombreVisible } from '@/lib/ejercicios/catalogo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EjercicioMediaPreview } from '@/components/ejercicios/EjercicioMediaPreview';
import { CEMD } from '../constants';

interface Props {
  ejercicio: EjercicioCatalogo;
  onSeleccionar: (ejercicio: EjercicioCatalogo) => void;
  eagerImage?: boolean;
}

export function EjercicioCatalogoCard({
  ejercicio,
  onSeleccionar,
  eagerImage = false,
}: Props) {
  const nombre = nombreVisible(ejercicio);

  return (
    <Card
      className={`cursor-pointer transition hover:border-primary hover:shadow-md ${CEMD.borderClass}`}
      onClick={() => onSeleccionar(ejercicio)}
    >
      <CardContent className="flex h-full flex-col p-2">
        <EjercicioMediaPreview
          src={ejercicio.gif}
          alt={nombre}
          mediaType={ejercicio.mediaType}
          eager={eagerImage}
        />
        <span className="mt-2 line-clamp-2 text-center text-xs font-semibold text-foreground">
          {nombre}
        </span>
        {ejercicio.source === 'private' ? (
          <Badge variant="secondary" className="mx-auto mt-1 w-fit text-[10px]">
            Propio
          </Badge>
        ) : null}
        {ejercicio.descripcion ? (
          <p className="mt-1 line-clamp-2 text-center text-[10px] leading-snug text-muted-foreground">
            {ejercicio.descripcion}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
