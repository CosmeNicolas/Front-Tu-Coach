import Image from 'next/image';

/** Captura del panel del profesor en TuCoach. */
export function DashboardPlaceholder() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <Image
        src="/landing/DashboardAminCemd.png"
        alt="Panel del profesor en TuCoach — resumen de alumnos, planificaciones y actividad"
        width={1575}
        height={663}
        className="h-auto w-full object-cover object-top"
        unoptimized
      />
    </div>
  );
}
