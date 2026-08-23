import Image from 'next/image';
import { TRUSTED_BY_ENTRIES } from '@/lib/landing/footer';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

export function TrustedBySection() {
  const logos = TRUSTED_BY_ENTRIES.filter((entry) => entry.kind === 'logo');

  return (
    <section
      aria-label="Profesionales que confían en TuCoach"
      className="border-y border-white/6 bg-[#0A0A0A] py-10 sm:py-12"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
          MARCAS Y PROFESIONALES QUE CONFÍAN EN TUCOACH
          </p>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 items-center justify-items-center gap-14 px-2 sm:grid-cols-3 sm:gap-8 sm:px-4 md:gap-12">
            {logos.map((entry) => (
              <li
                key={entry.src}
                className={cn(
                  'flex w-full items-center justify-center py-1 sm:h-20 sm:py-0',
                  entry.scale
                    ? 'min-h-32 overflow-visible sm:min-h-0'
                    : 'min-h-20 overflow-hidden sm:min-h-16',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center',
                    entry.scale && 'scale-[4.5]',
                  )}
                >
                  <Image
                    src={entry.src}
                    alt={entry.alt}
                    width={entry.width ?? 160}
                    height={entry.height ?? 48}
                    unoptimized={entry.unoptimized}
                    className={
                      entry.imageClassName ??
                      'h-10 w-full max-w-[140px] object-contain object-center opacity-80'
                    }
                    priority={entry.src.includes('CEMD')}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
