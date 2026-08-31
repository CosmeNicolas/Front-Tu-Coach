import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LANDING_CONTAINER } from '@/lib/landing/constants';

interface LegalDocumentProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalDocument({ title, updated, children }: LegalDocumentProps) {
  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar />
      <main className={`${LANDING_CONTAINER} pb-20 pt-28 sm:pb-28 sm:pt-32`}>
        <article className="mx-auto max-w-2xl">
          <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] tracking-wide text-white">
            {title}
          </h1>
          <p className="mt-3 text-sm text-[#737373]">Actualizado {updated}</p>
          <div className="mt-10 space-y-6 text-sm leading-relaxed text-[#A3A3A3] [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-wide [&_h2]:text-white [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4">
            {children}
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
