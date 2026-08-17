import Image from 'next/image';
import { TRUSTED_BY_ENTRIES } from '@/lib/landing/footer';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

export function TrustedBySection() {
  return (
    <section
      aria-label="Profesionales que confían en TuCoach"
      className="border-y border-white/6 bg-[#0A0A0A] py-10 sm:py-12"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            Profesionales que confían en TuCoach
          </p>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {TRUSTED_BY_ENTRIES.map((entry) => (
              <li
                key={entry.kind === 'placeholder' ? entry.label : entry.src}
                className={cn(
                  'flex h-16 items-center justify-center rounded-lg border border-dashed border-white/10 px-2 transition-opacity hover:opacity-90 sm:px-3',
                  entry.kind === 'logo' && entry.scale
                    ? 'overflow-visible'
                    : 'overflow-hidden',
                )}
              >
                {entry.kind === 'logo' ? (
                  <div
                    className="flex items-center justify-center"
                    style={
                      entry.scale
                        ? {
                            transform: `scale(${entry.scale})`,
                            transformOrigin: 'center center',
                          }
                        : undefined
                    }
                  >
                    <Image
                      key={entry.src}
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
                ) : (
                  <span className="text-center text-sm font-medium text-[#737373] opacity-60">
                    {entry.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
