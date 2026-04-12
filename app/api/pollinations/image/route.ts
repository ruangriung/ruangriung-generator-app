
import { NextResponse } from 'next/server';
import { request } from 'undici';

export const dynamic = 'force-dynamic';

// Parse image quality to Pollinations quality parameter
const qualityMap: Record<string, string> = {
  'Standar': 'medium',
  'HD': 'high',
  'Ultra': 'ultra',
  'medium': 'medium',
  'high': 'high',
  'ultra': 'ultra',
  'standard': 'medium',
};

// Parse aspect ratio format
const parseAspectRatio = (width?: string, height?: string): string | undefined => {
  if (!width || !height) return undefined;
  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  
  if (isNaN(w) || isNaN(h)) return undefined;
  
  // Calculate aspect ratio
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(w, h);
  const ratioW = w / divisor;
  const ratioH = h / divisor;
  
  return `${ratioW}:${ratioH}`;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');
    
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // Extract all parameters dengan nilai default
    const model = searchParams.get('model') || 'flux';
    const width = searchParams.get('width') || '1024';
    const height = searchParams.get('height') || '1024';
    const seed = searchParams.get('seed') || '0';
    const quality = qualityMap[searchParams.get('quality') || 'medium'] || 'medium';
    const enhance = searchParams.get('enhance') === 'true' ? 'true' : 'false';
    const negative_prompt = searchParams.get('negative_prompt') || 'worst quality, blurry';
    const safe = searchParams.get('safe') === 'false' ? 'false' : 'true';
    const transparent = searchParams.get('transparent') === 'true' ? 'true' : 'false';
    const nologo = searchParams.get('nologo') === 'true' ? 'true' : 'false';
    
    const aspectRatio = parseAspectRatio(width, height) || '';

    // Build Pollinations API URL dengan parameter terbaru
    const pollParams = new URLSearchParams({
      model,
      width,
      height,
      seed,
      enhance,
      negative_prompt,
      safe,
      quality,
      transparent,
    });

    if (nologo === 'true') {
      pollParams.append('nologo', 'true');
    }

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
    
    console.log('[v0] Image API URL:', apiUrl);

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

    const headers: Record<string, string> = {};
    if (POLLINATIONS_API_KEY) {
      headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
    }

    // Use undici for the request
    const { statusCode, body, headers: responseHeaders } = await request(apiUrl, {
      method: 'GET',
      headers,
    });

    if (statusCode !== 200) {
      const errorText = await body.text();
      console.error('[v0] Pollinations API Error:', statusCode, errorText);
      return NextResponse.json(
        { message: `Pollinations API Error: ${statusCode}`, error: errorText },
        { status: statusCode }
      );
    }

    // Get the image buffer
    const imageBuffer = await body.arrayBuffer();
    const contentType = responseHeaders['content-type'] as string || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('[v0] Error in Pollinations Image Proxy:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
