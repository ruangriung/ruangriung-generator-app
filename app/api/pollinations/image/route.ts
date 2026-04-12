import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extend duration for image generation (Pro/Enterprise)

export async function GET(requestObj: Request) {
  try {
    const { searchParams } = new URL(requestObj.url);
    const prompt = searchParams.get('prompt');

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // Bangun query parameter Pollinations secara eksplisit
    const pollParams = new URLSearchParams();

    // Copy basic parameters
    const width = searchParams.get('width');
    if (width) pollParams.append('width', width);

    const height = searchParams.get('height');
    if (height) pollParams.append('height', height);

    const seed = searchParams.get('seed');
    if (seed) pollParams.append('seed', seed);

    const model = searchParams.get('model');
    if (model) pollParams.append('model', model);

    const nologo = searchParams.get('nologo');
    if (nologo) pollParams.append('nologo', nologo);

    const enhance = searchParams.get('enhance');
    if (enhance) pollParams.append('enhance', enhance);

    const privateParam = searchParams.get('private');
    if (privateParam) pollParams.append('private', privateParam);

    const safe = searchParams.get('safe');
    if (safe) pollParams.append('safe', safe);

    const transparent = searchParams.get('transparent');
    if (transparent) pollParams.append('transparent', transparent);

    const referrer = searchParams.get('referrer');
    if (referrer) pollParams.append('referrer', referrer);

    const cfg_scale = searchParams.get('guidance_scale') || searchParams.get('cfg_scale');
    if (cfg_scale) pollParams.append('guidance_scale', cfg_scale);

    const negative_prompt = searchParams.get('negative_prompt');
    if (negative_prompt) pollParams.append('negative_prompt', negative_prompt);

    const aspectRatio = searchParams.get('aspectRatio');
    if (aspectRatio) {
      pollParams.append('aspectRatio', aspectRatio);
    }

    // Add optional parameters jika ada
    const duration = searchParams.get('duration');
    if (duration && !isNaN(Number(duration))) {
      pollParams.append('duration', duration);
    }

    const image = searchParams.get('image');
    if (image) {
      pollParams.append('image', image);
    }

    const audio = searchParams.get('audio');
    if (audio === 'true') {
      pollParams.append('audio', 'true');
    }

    const apiUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${pollParams.toString()}`;
    
    console.log('[API] Image Request:', apiUrl);

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

    const headers: Record<string, string> = {
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
    };

    if (POLLINATIONS_API_KEY) {
      headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
    }

    // Use global fetch (built-in in Vercel/Node 18+)
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Pollinations API Error:', response.status, errorText);
      return NextResponse.json(
        { message: `Pollinations API Error: ${response.status}`, error: errorText },
        { status: response.status }
      );
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in Pollinations Image Proxy:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
