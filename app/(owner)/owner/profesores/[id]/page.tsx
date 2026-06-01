'use client';

import { use } from 'react';
import { ProfesorAlumnosView } from '@/components/owner/ProfesorAlumnosView';

export default function OwnerProfesorDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="p-4 sm:p-8">
      <ProfesorAlumnosView profesorId={id} />
    </div>
  );
}
