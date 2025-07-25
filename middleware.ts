// ruangriung/ruangriung-generator-app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Hapus import { getToken } from 'next-auth/jwt';
// Hapus const ALLOWED_ADMIN_EMAILS = ...;
// Hapus const NEXTAUTH_SECRET = ...;

export function middleware(request: NextRequest) { // Kembali ke function middleware tanpa async
  // Hanya jalankan middleware untuk path yang dimulai dengan /premium
  if (request.nextUrl.pathname.startsWith('/premium')) {
    // Izinkan akses ke halaman login dan API-nya
    if (
      request.nextUrl.pathname.startsWith('/premium/login') ||
      request.nextUrl.pathname.startsWith('/premium/api/login')
    ) {
      return NextResponse.next();
    }

    // Cek cookie otentikasi kustom
    const authCookie = request.cookies.get('premium-auth');

    if (!authCookie || authCookie.value !== 'true') {
      // Jika tidak ada cookie, alihkan ke halaman login premium
      const loginUrl = new URL('/premium/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Untuk semua rute lain yang tidak dicocokkan oleh matcher (termasuk /admin), lanjutkan
  return NextResponse.next();
}

// Konfigurasi matcher: Hanya melindungi jalur /premium
export const config = {
  matcher: '/premium/:path*',
};