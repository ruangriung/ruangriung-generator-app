import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    '/video-prompt',
    '/id-card-generator',
    '/storyteller',
    '/v1/video-prompt',
    '/v1/random-spinner.html'
  ];

  // Check if the current route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      // Redirect to home or login page if not authenticated
      // Since we don't have a dedicated login page yet, we redirect to home
      // where the AuthButton is available.
      const url = new URL('/', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/video-prompt/:path*',
    '/id-card-generator/:path*',
    '/storyteller/:path*',
    '/v1/video-prompt/:path*',
    '/v1/random-spinner.html',
  ],
};