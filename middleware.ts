import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Hanya jalankan middleware untuk path yang dimulai dengan /premium
  if (request.nextUrl.pathname.startsWith('/premium')) {
    
    // Izinkan akses ke halaman login dan API-nya
    if (
      request.nextUrl.pathname.startsWith('/premium/login') ||
      request.nextUrl.pathname.startsWith('/premium/api/login')
    ) {
      return NextResponse.next();
    }

    // Cek cookie otentikasi
    const authCookie = request.cookies.get('premium-auth');

    if (!authCookie || authCookie.value !== 'true') {
      // Jika tidak ada cookie, alihkan ke halaman login
      const loginUrl = new URL('/premium/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Konfigurasi ini memastikan middleware hanya berjalan pada path /premium
export const config = {
  matcher: '/premium/:path*',
};