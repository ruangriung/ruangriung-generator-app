// ruangriung/ruangriung-generator-app/app/api/prompts/[slug]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prompt as PromptInterface } from '@/lib/prompts';
// Hapus import type { Prisma as PrismaTypes } from '@prisma/client/runtime/library';

// PERBAIKAN: Definisikan tipe model Prisma dengan menyimpulkan dari Prisma Client
type PromptFromPrisma = Awaited<ReturnType<typeof prisma.prompt.findUnique>>;

// Endpoint GET: Mengambil prompt tunggal berdasarkan slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } 
) {
  const { slug } = await params;

  try {
    // PERBAIKAN: Gunakan tipe PromptFromPrisma
    const prompt: PromptFromPrisma | null = await prisma.prompt.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 });
    }

    const formattedPrompt: PromptInterface = {
      id: prompt.id,
      slug: prompt.slug,
      title: prompt.title,
      author: prompt.author,
      date: prompt.date.toISOString(),
      category: prompt.category,
      toolsUsed: prompt.toolsUsed,
      thumbnailUrl: prompt.thumbnailUrl,
      shortDescription: prompt.shortDescription,
      fullPrompt: prompt.fullPrompt,
      negativePrompt: prompt.negativePrompt || undefined,
      notes: prompt.notes || undefined,
    };

    return NextResponse.json(formattedPrompt);
  } catch (error) {
    console.error(`Error fetching prompt with slug ${slug}:`, error);
    return NextResponse.json({ message: 'Failed to fetch prompt', error: (error as Error).message }, { status: 500 });
  }
}

// Implementasi fungsi DELETE untuk menghapus prompt berdasarkan slug (Sekarang publik)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } 
) {
  const { slug } = await params;

  try {
    await prisma.prompt.delete({
      where: {
        slug: slug,
      },
    });

    return NextResponse.json({ message: `Prompt dengan slug '${slug}' berhasil dihapus.` }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting prompt with slug ${slug}:`, error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Prompt tidak ditemukan.', error: (error as Error).message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal menghapus prompt.', error: (error as Error).message }, { status: 500 });
  }
}