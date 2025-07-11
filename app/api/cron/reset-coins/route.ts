import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    const result = await prisma.user.updateMany({
      data: {
        coins: 500, // Reset koin semua pengguna menjadi 500
      },
    });

    console.log(`[CRON JOB] Berhasil mereset koin untuk ${result.count} pengguna.`);
    return NextResponse.json({
      ok: true,
      message: `Successfully reset coins for ${result.count} users.`,
    });
  } catch (error) {
    console.error("[CRON JOB] Gagal menjalankan reset koin:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to reset coins." },
      { status: 500 }
    );
  }
}