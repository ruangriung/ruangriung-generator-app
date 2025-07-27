// ruangriung/ruangriung-generator-app/app/api/prompts/route.ts
import { NextResponse, NextRequest } from 'next/server'; // Tambahkan NextRequest
import prisma from '@/lib/prisma';
import { Prompt as PromptInterface } from '@/lib/prompts';

type PromptFromPrisma = Awaited<ReturnType<typeof prisma.prompt.findMany>>[number];

export async function GET() {
  try {
    const prompts: PromptFromPrisma[] = await prisma.prompt.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    const formattedPrompts: PromptInterface[] = prompts.map((p: PromptFromPrisma) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      author: p.author,
      date: p.date.toISOString(),
      category: p.category,
      toolsUsed: p.toolsUsed,
      thumbnailUrl: p.thumbnailUrl,
      shortDescription: p.shortDescription,
      fullPrompt: p.fullPrompt,
      negativePrompt: p.negativePrompt || undefined,
      notes: p.notes || undefined,
    }));

    return NextResponse.json(formattedPrompts, { status: 200 });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat mengambil prompt.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) { // Gunakan NextRequest
  try {
    const newPromptData: PromptInterface & { turnstileToken?: string | null } = await request.json();
    const { turnstileToken, ...restOfPromptData } = newPromptData;

    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY not set.');
        return NextResponse.json({ message: 'Server error: Turnstile configuration missing.' }, { status: 500 });
    }

    if (!turnstileToken) {
        return NextResponse.json({ message: 'Turnstile token missing.' }, { status: 400 });
    }

    // --- PERBAIKAN: Dapatkan IP pengguna tanpa request.ip ---
    const ip = request.headers.get('x-forwarded-for') || ''; // Mendapatkan IP pengguna

    const turnstileVerificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const turnstileResponse = await fetch(turnstileVerificationUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: secretKey,
            response: turnstileToken,
            remoteip: ip,
        }).toString(),
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
        console.warn('Turnstile verification failed:', turnstileResult['error-codes']);
        return NextResponse.json({ message: 'Verifikasi keamanan gagal. Mohon coba lagi.' }, { status: 403 });
    }

    if (!restOfPromptData.title.trim() || !restOfPromptData.author.trim() || !restOfPromptData.slug.trim() || !restOfPromptData.fullPrompt.trim()) {
      return NextResponse.json({ message: 'Judul, Penulis, Slug, dan Isi Prompt lengkap wajib diisi.' }, { status: 400 });
    }

    const createdPrompt = await prisma.prompt.create({
      data: {
        slug: restOfPromptData.slug,
        title: restOfPromptData.title,
        author: restOfPromptData.author,
        date: new Date(restOfPromptData.date || Date.now()),
        category: restOfPromptData.category,
        toolsUsed: restOfPromptData.toolsUsed,
        thumbnailUrl: restOfPromptData.thumbnailUrl,
        shortDescription: restOfPromptData.shortDescription,
        fullPrompt: restOfPromptData.fullPrompt,
        negativePrompt: restOfPromptData.negativePrompt || null,
        notes: restOfPromptData.notes || null,
      },
    });

    return NextResponse.json({ message: 'Prompt berhasil ditambahkan!', prompt: createdPrompt }, { status: 201 });
  } catch (error) {
    console.error('Error adding prompt:', error);
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ message: 'Slug ini sudah ada. Harap gunakan slug lain.', error: (error as any).meta?.target }, { status: 409 });
    }
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.', error: (error as Error).message }, { status: 500 });
  }
}