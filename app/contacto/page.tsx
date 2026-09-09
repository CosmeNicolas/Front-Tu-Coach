import type { Metadata } from 'next';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ContactForm } from '@/components/landing/ContactForm';
import { CONTACT_EMAIL, LANDING_CONTAINER } from '@/lib/landing/constants';

export const metadata: Metadata = {
  title: 'Contacto — TuCoach',
  description:
    'Escribinos para pedir una demo, consultar planes o implementar TuCoach en tu gimnasio.',
};

export default function ContactoPage() {
  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar />
      <main className={`${LANDING_CONTAINER} pb-20 pt-28 sm:pb-28 sm:pt-32`}>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            Contacto
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] tracking-wide text-white">
            Escribinos tu consulta
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A3A3A3]">
            Pedí una demo, consultá por planes Pro o Plus, o contanos cómo querés usar TuCoach
            en tu gimnasio. Te respondemos a la brevedad.
          </p>
          <p className="mt-2 text-sm text-[#737373]">
            También podés escribirnos directo a{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#A3A3A3] underline underline-offset-4 transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
