import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/auth/constants';
import { Role } from '@/types/auth';

const PUBLIC_PATHS = ['/login'];
const PROTECTED_PREFIXES = [
  '/super-admin',
  '/owner',
  '/profesor',
  '/alumno',
];

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/super-admin/dashboard',
  [Role.OWNER_GIMNASIO]: '/owner/dashboard',
  [Role.PROFESOR]: '/profesor/dashboard',
  [Role.ALUMNO]: '/alumno/mi-planificacion',
};

function hasToken(request: NextRequest): boolean {
  return Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);
}

function getRoleFromToken(token: string): Role | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf-8'),
    ) as { role?: Role };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const authenticated = Boolean(token);

  if (pathname === '/') {
    if (authenticated && token) {
      const role = getRoleFromToken(token);
      const dest = role ? DASHBOARD_BY_ROLE[role] : '/login';
      return NextResponse.redirect(new URL(dest, request.url));
    }
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
    '/super-admin/:path*',
    '/owner/:path*',
    '/profesor/:path*',
    '/alumno/:path*',
  ],
};
