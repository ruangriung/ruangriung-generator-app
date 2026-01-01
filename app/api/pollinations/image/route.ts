
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Construct the target URL. 
    // The prompt is usually part of the path in the original URL, but here we can pass it as a query param or handle it differently.
    // Based on user request, the format is 'https://gen.pollinations.ai/image/PROMPT?params...'
    // So we need to extract the 'prompt' from searchParams and put it in the path.
    
    const prompt = searchParams.get('prompt');
    if (!prompt) {
         return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // Remove prompt from params to avoid duplication if it's there, 
    // though keeping it usually doesn't hurt. 
    // Let's just forward the entire query string as is, but append the prompt to the path.
    // Actually, let's look at how the user provided the example:
    // request('https://gen.pollinations.ai/image/a beautiful sunset...?model=zimage&...')
    
    // We will assume the client sends all parameters including 'prompt' as query params to THIS route.
    // e.g. /api/pollinations/image?prompt=foo&model=bar
    
    // We need to reconstruct the Pollinations URL.
    const baseUrl = 'https://gen.pollinations.ai/image';
    const finalUrl = `${baseUrl}/${encodeURIComponent(prompt)}?${queryString}`;

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

    const headers: HeadersInit = {};
    if (POLLINATIONS_API_KEY) {
        headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
    }

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: `Pollinations API Error: ${response.statusText}`, error: errorText }, { status: response.status });
    }

    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
        status: 200
    });

  } catch (error: any) {
    console.error('Error in Pollinations Image Proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
