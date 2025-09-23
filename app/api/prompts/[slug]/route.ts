import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePromptBySlug } from '@/lib/prompts';

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const configuredToken = process.env.PROMPT_EDIT_TOKEN;

    if (!configuredToken) {
      console.error('PROMPT_EDIT_TOKEN is not configured.');
      return NextResponse.json(
        { message: 'Konfigurasi server belum lengkap.' },
        { status: 500 },
      );
    }

    const requestToken = request.headers.get('x-admin-token');

    if (!requestToken || requestToken !== configuredToken) {
      return NextResponse.json(
        { message: 'Token admin tidak valid atau tidak diberikan.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      author,
      email,
      facebook,
      image,
      link,
      title,
      promptContent,
      tool,
      tags,
      date,
    } = body;

    if (!author || !title || !promptContent || !tool) {
      return NextResponse.json(
        { message: 'Kolom wajib tidak boleh kosong.' },
        { status: 400 },
      );
    }

    const prompt = await updatePromptBySlug(params.slug, {
      author,
      email,
      facebook,
      image,
      link,
      title,
      promptContent,
      tool,
      tags: Array.isArray(tags) ? tags : [],
      date,
    });

    revalidatePath('/kumpulan-prompt');
    revalidatePath(`/kumpulan-prompt/${prompt.slug}`);

    return NextResponse.json(
      { message: 'Prompt berhasil diperbarui!', prompt },
      { status: 200 },
    );
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    console.error('Gagal memperbarui prompt:', error);
    return NextResponse.json(
      {
        message: 'Gagal memperbarui prompt.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
