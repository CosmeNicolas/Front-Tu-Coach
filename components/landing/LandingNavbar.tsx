'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LANDING_NAV_ITEMS } from '@/lib/landing/nav';
import {
  LANDING_CONTAINER,
  LOGIN_ROUTE,
  REGISTRO_ROUTE,
  TRIAL_DAYS,
} from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function handleNavClick() {
    setMobileOpen(false);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <nav
        className={cn(LANDING_CONTAINER, 'flex h-16 items-center justify-between lg:h-[4.5rem]')}
        aria-label="Navegación principal"
      >
        <Link
          href={LOGIN_ROUTE}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          onClick={handleNavClick}
        >
          <Image
            src="/branding/LGO600PX.png"
            alt=""
            width={36}
            height={36}
            className="object-contain"
            priority
          />
          <span className="font-display text-xl tracking-wider text-white">TuCoach</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LANDING_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[#A3A3A3] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LandingButton href={LOGIN_ROUTE} variant="ghost" className="px-4 py-2">
            Iniciar sesión
          </LandingButton>
          <LandingButton href={REGISTRO_ROUTE} variant="primary" className="px-5 py-2.5">
            {`Probar ${TRIAL_DAYS} días`}
          </LandingButton>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-menu"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="landing-mobile-menu"
              className="fixed inset-x-0 top-16 z-50 border-b border-white/10 bg-[#0A0A0A]/98 px-4 pb-6 pt-4 backdrop-blur-xl lg:hidden"
              initial={reduced ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col gap-1">
                {LANDING_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-base text-[#A3A3A3] transition-colors hover:bg-white/5 hover:text-white"
                      onClick={handleNavClick}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3">
                <LandingButton href={LOGIN_ROUTE} variant="secondary" className="w-full">
                  Iniciar sesión
                </LandingButton>
                <LandingButton href={REGISTRO_ROUTE} variant="primary" className="w-full">
                  {`Probar ${TRIAL_DAYS} días`}
                </LandingButton>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
