import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/articles';

export async function GET() {
  try {
    const allArticles = getAllArticles();
    // Ambil 3 artikel terbaru
    const latestArticles = allArticles.slice(0, 3).map(a => ({
      title: a.title,
      slug: a.slug,
      date: a.date,
      summary: a.summary
    }));

    return NextResponse.json(latestArticles);
  } catch (error) {
    console.error('Error fetching articles for dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
