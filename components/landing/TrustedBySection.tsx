import Image from 'next/image';
import { TRUSTED_BY_ENTRIES } from '@/lib/landing/footer';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

export function TrustedBySection() {
  const logos = TRUSTED_BY_ENTRIES.filter(
    (entry): entry is (typeof TRUSTED_BY_ENTRIES)[number] & { kind: 'logo' } =>
      entry.kind === 'logo',
  );

  return (
    <section
      aria-label="Profesionales que confían en TuCoach"
      className="border-y border-white/6 bg-[#0A0A0A] py-10 sm:py-12"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#737373] sm:mb-10">
            MARCAS Y PROFESIONALES QUE CONFÍAN EN TUCOACH
          </p>
          <ul
            className={cn(
              'mx-auto grid max-w-[20rem] grid-cols-2 place-items-center',
              'gap-x-6 gap-y-8',
              'sm:max-w-2xl sm:grid-cols-4 sm:gap-x-8 sm:gap-y-9',
              'lg:flex lg:max-w-none lg:flex-nowrap lg:items-center lg:justify-center',
              'lg:gap-x-10 lg:gap-y-0 xl:gap-x-12',
            )}
          >
            {logos.map((entry) => (
              <li
                key={entry.src}
                className={cn(
                  'flex h-11 items-center justify-center px-1',
                  'sm:h-12',
                  'lg:h-14',
                  'last:col-span-2 sm:last:col-span-4',
                )}
              >
                <Image
                  src={entry.src}
                  alt={entry.alt}
                  width={440}
                  height={130}
                  unoptimized={entry.unoptimized}
                  priority={entry.src.includes('CEMD')}
                  className={cn(
                    'h-full w-auto max-w-[8.5rem] object-contain object-center',
                    'sm:max-w-[9rem]',
                    'lg:max-w-[10.5rem]',
                    entry.imageClassName,
                    entry.sizeClassName,
                  )}
                />
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
