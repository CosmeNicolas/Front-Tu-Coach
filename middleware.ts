import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/auth/constants';

const PUBLIC_PATHS = [
  '/login',
  '/registro',
  '/registro/entrenar',
  '/recuperar',
  '/recuperar/nueva',
  '/terminos',
  '/privacidad',
  '/contacto',
];
const PROTECTED_PREFIXES = [
  '/super-admin',
  '/owner',
  '/profesor',
  '/alumno',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const authenticated = Boolean(token);

  // Landing pública siempre accesible (incluso logueado).
  // El redirect al dashboard ocurre post-login, no al visitar "/".
  if (pathname === '/') {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !authenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/registro',
    '/registro/entrenar',
    '/recuperar',
    '/recuperar/:path*',
    '/terminos',
    '/privacidad',
    '/contacto',
    '/super-admin/:path*',
    '/owner/:path*',
    '/profesor/:path*',
    '/alumno/:path*',
  ],
};
