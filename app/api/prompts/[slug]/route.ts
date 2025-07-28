// ruangriung/ruangriung-generator-app/app/api/prompts/[slug]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prompt as PromptInterface } from '@/lib/prompts';

// PERBAIKAN: Definisikan tipe model Prisma dengan menyimpulkan dari Prisma Client
type PromptFromPrisma = Awaited<ReturnType<typeof prisma.prompt.findUnique>>;

// Endpoint GET: Mengambil prompt tunggal berdasarkan slug
export async function GET(
  _request: Request,
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
  _request: Request,
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

// Endpoint PUT: Memperbarui prompt berdasarkan slug
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    // Destrukturisasi data yang bisa diperbarui
    const {
      title,
      author, // Biasanya author tidak diubah, tapi disertakan jika skema Anda memungkinkan
      category,
      toolsUsed,
      thumbnailUrl,
      shortDescription,
      fullPrompt,
      negativePrompt,
      notes,
    } = body;

    // Perbarui prompt di database
    const updatedPrompt = await prisma.prompt.update({
      where: {
        slug: slug,
      },
      data: {
        title: title,
        author: author, // Pastikan author tidak kosong jika itu bidang wajib
        category: category,
        toolsUsed: toolsUsed, // Pastikan tipe data sesuai dengan Prisma schema (misalnya, string array)
        thumbnailUrl: thumbnailUrl,
        shortDescription: shortDescription,
        fullPrompt: fullPrompt,
        negativePrompt: negativePrompt || null, // Pastikan menyetel ke null jika undefined/kosong untuk opsional
        notes: notes || null, // Pastikan menyetel ke null jika undefined/kosong untuk opsional
        date: new Date(), // Perbarui tanggal modifikasi
      },
    });

    // Format respons agar konsisten dengan `PromptInterface` frontend
    const formattedUpdatedPrompt: PromptInterface = {
      id: updatedPrompt.id,
      slug: updatedPrompt.slug,
      title: updatedPrompt.title,
      author: updatedPrompt.author,
      date: updatedPrompt.date.toISOString(),
      category: updatedPrompt.category,
      toolsUsed: updatedPrompt.toolsUsed,
      thumbnailUrl: updatedPrompt.thumbnailUrl,
      shortDescription: updatedPrompt.shortDescription,
      fullPrompt: updatedPrompt.fullPrompt,
      negativePrompt: updatedPrompt.negativePrompt || undefined,
      notes: updatedPrompt.notes || undefined,
    };

    return NextResponse.json(formattedUpdatedPrompt, { status: 200 });
  } catch (error) {
    console.error(`Error updating prompt with slug ${slug}:`, error);
    // Tangani error jika prompt tidak ditemukan
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ message: 'Prompt tidak ditemukan.', error: (error as Error).message }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal memperbarui prompt.', error: (error as Error).message }, { status: 500 });
  }
}