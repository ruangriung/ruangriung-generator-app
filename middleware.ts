import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Maintenance Mode Configuration
const MAINTENANCE_MODE = true; // Set to true to enable
const MAINTENANCE_END_DATE = new Date('2026-06-06T00:00:00Z');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const now = new Date();

  // 1. Maintenance Mode Redirection
  const isDevelopment = process.env.NODE_ENV === 'development';
  const bypassCookie = request.cookies.get('maintenance_bypass');
  const bypassQuery = request.nextUrl.searchParams.get('bypass');
  const BYPASS_KEY = 'ruangriung2026'; // Secret key to bypass maintenance

  // If user provides correct bypass key in URL, set cookie and allow access
  if (bypassQuery === BYPASS_KEY) {
    const response = NextResponse.next();
    response.cookies.set('maintenance_bypass', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
    return response;
  }

  if (MAINTENANCE_MODE && now < MAINTENANCE_END_DATE && !isDevelopment && !bypassCookie) {
    // Allow access to maintenance page and static assets
    const isAsset = pathname.startsWith('/_next') || 
                    pathname.startsWith('/api') || 
                    pathname.startsWith('/assets') || 
                    pathname.includes('.') ||
                    pathname === '/favicon.ico' ||
                    pathname === '/logo.webp';
    
    if (pathname !== '/maintenance' && !isAsset) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  // 2. Protected Routes Logic
  const protectedRoutes = [
    '/video-prompt',
    '/v1/video-prompt',
    '/v1/random-spinner.html'
  ];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      const url = new URL('/', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};