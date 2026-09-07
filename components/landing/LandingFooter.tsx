import Image from 'next/image';
import Link from 'next/link';
import { LANDING_FOOTER_GROUPS } from '@/lib/landing/footer';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  LANDING_CONTAINER,
  LANDING_HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTRO_ROUTE,
} from '@/lib/landing/constants';

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="border-t border-white/[0.06] bg-[#050505] pb-10 pt-16">
      <div className={LANDING_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href={LANDING_HOME_ROUTE} className="inline-flex items-center gap-2.5">
              <Image
                src="/branding/LGO600PX.png"
                alt=""
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-display text-xl tracking-wider text-white">TuCoach</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#737373]">
              Plataforma para crear, asignar y gestionar planificaciones de entrenamiento,
              acompañar alumnos y analizar su progreso.
            </p>
            <a
              href={CONTACT_MAILTO}
              className="mt-3 inline-block text-sm text-[#A3A3A3] transition-colors hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {LANDING_FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                      <Link
                        href={link.href}
                        className="text-sm text-[#737373] transition-colors hover:text-[#A3A3A3]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-[#737373] transition-colors hover:text-[#A3A3A3]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#737373]">
            © {year} TuCoach. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href={LOGIN_ROUTE} className="text-[#737373] hover:text-[#A3A3A3]">
              Iniciar sesión
            </Link>
            <Link href={REGISTRO_ROUTE} className="text-[#737373] hover:text-[#A3A3A3]">
              Crear cuenta
            </Link>
            <Link href="/terminos" className="text-[#737373] hover:text-[#A3A3A3]">
              Términos
            </Link>
            <Link href="/privacidad" className="text-[#737373] hover:text-[#A3A3A3]">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
