import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth"; // Impor dari pusat konfigurasi yang sama
import prisma from '@/lib/prisma';

const GUEST_SESSION_COOKIE = 'ruangriung_guest_session';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

async function handleGuestSession(request: NextRequest) {
  const guestSessionId = request.cookies.get(GUEST_SESSION_COOKIE)?.value;

  if (guestSessionId) {
    const guest = await prisma.guestSession.findUnique({ where: { id: guestSessionId } });
    if (guest) {
      const timeSinceLastUpdate = Date.now() - new Date(guest.updatedAt).getTime();
      if (timeSinceLastUpdate > TWENTY_FOUR_HOURS_IN_MS) {
        const resetGuest = await prisma.guestSession.update({
          where: { id: guestSessionId },
          data: { coins: 10 },
        });
        return NextResponse.json({ coins: resetGuest.coins });
      }
      return NextResponse.json({ coins: guest.coins });
    }
  }

  const newGuest = await prisma.guestSession.create({ data: { coins: 10 } });
  const response = NextResponse.json({ coins: newGuest.coins });
  response.cookies.set(GUEST_SESSION_COOKIE, newGuest.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      return NextResponse.json({ coins: user?.coins ?? 0 });
    }
    return await handleGuestSession(request);
  } catch (error) {
    console.error("!!! [GET /api/coins] CRASH TERDETEKSI !!!", error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal pada server.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const { amount } = await request.json();
    const amountToDeduct = Number(amount);

    if (!amountToDeduct || amountToDeduct <= 0) {
        return NextResponse.json({ success: false, error: 'Jumlah tidak valid' }, { status: 400 });
    }

    if (session?.user) {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.coins < amountToDeduct) {
        return NextResponse.json({ success: false, error: 'Koin tidak cukup' }, { status: 400 });
        }
        const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { coins: { decrement: amountToDeduct } },
        });
        return NextResponse.json({ success: true, coins: updatedUser.coins });
    }
    
    const guestSessionId = request.cookies.get(GUEST_SESSION_COOKIE)?.value;
    if (!guestSessionId) {
        return NextResponse.json({ success: false, error: 'Sesi tamu tidak ditemukan.' }, { status: 400 });
    }

    const guest = await prisma.guestSession.findUnique({ where: { id: guestSessionId } });
    if (!guest || guest.coins < amountToDeduct) {
        return NextResponse.json({ success: false, error: 'Koin tamu tidak cukup' }, { status: 400 });
    }

    const updatedGuest = await prisma.guestSession.update({
        where: { id: guestSessionId },
        data: { coins: { decrement: amountToDeduct } },
    });
    return NextResponse.json({ success: true, coins: updatedGuest.coins });
}