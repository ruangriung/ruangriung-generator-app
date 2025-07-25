// ruangriung/ruangriung-generator-app/app/api/prompts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prompt as PromptInterface } from '@/lib/prompts';
// Hapus import type { Prisma as PrismaTypes } from '@prisma/client/runtime/library';

// PERBAIKAN: Definisikan tipe model Prisma dengan menyimpulkan dari Prisma Client
type PromptFromPrisma = Awaited<ReturnType<typeof prisma.prompt.findMany>>[number];

// Endpoint GET: Mengambil semua prompt dari database
export async function GET() {
  try {
    // PERBAIKAN: Gunakan tipe PromptFromPrisma
    const prompts: PromptFromPrisma[] = await prisma.prompt.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    
    // PERBAIKAN: Gunakan tipe PromptFromPrisma
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

    return NextResponse.json(formattedPrompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ message: 'Failed to fetch prompts', error: (error as Error).message }, { status: 500 });
  }
}

// Endpoint POST: Menambahkan prompt baru ke database (Sekarang publik)
export async function POST(request: Request) {
  try {
    const newPromptData: PromptInterface = await request.json();

    if (!newPromptData.title.trim() || !newPromptData.author.trim() || !newPromptData.slug.trim() || !newPromptData.fullPrompt.trim()) {
      return NextResponse.json({ message: 'Judul, Penulis, Slug, dan Isi Prompt lengkap wajib diisi.' }, { status: 400 });
    }

    const createdPrompt = await prisma.prompt.create({
      data: {
        slug: newPromptData.slug,
        title: newPromptData.title,
        author: newPromptData.author,
        date: new Date(newPromptData.date || Date.now()), 
        category: newPromptData.category,
        toolsUsed: newPromptData.toolsUsed,
        thumbnailUrl: newPromptData.thumbnailUrl,
        shortDescription: newPromptData.shortDescription,
        fullPrompt: newPromptData.fullPrompt,
        negativePrompt: newPromptData.negativePrompt || null, 
        notes: newPromptData.notes || null, 
      },
    });

    return NextResponse.json({ message: 'Prompt berhasil ditambahkan!', prompt: createdPrompt }, { status: 201 });
  } catch (error) {
    console.error('Error adding prompt:', error);
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ message: 'Slug ini sudah ada. Harap gunakan slug lain.', error: (error as Error).message }, { status: 409 });
    }
    return NextResponse.json({ message: 'Gagal menambahkan prompt.', error: (error as Error).message }, { status: 500 });
  }
}