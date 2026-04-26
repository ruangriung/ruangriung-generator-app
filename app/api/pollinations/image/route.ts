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

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    
    // Support BYOP: Check if client provided their own key in headers
    const clientKey = requestObj.headers.get('x-pollinations-key') || 
                      requestObj.headers.get('Authorization')?.replace('Bearer ', '');
    
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    // Gunakan endpoint gen.pollinations.ai jika ada API Key (Pro), 
    // jika tidak ada, gunakan endpoint publik pollinations.ai/p/
    const baseUrl = activeApiKey 
      ? `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`
      : `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;

    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    console.log('[API] Image Request:', apiUrl, clientKey ? '(Using Client BYOP Key)' : '(Using Server Key)');

    const headers: Record<string, string> = {
      'Accept': 'image/*, application/json',
    };

    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }


    // === OPTIMIZATION: Redirect for GET only (Public/BYOP) ===
    // If it's a GET request and we are NOT using a server-side private key,
    // we can redirect the browser to fetch the image directly.
    if (requestObj.method === 'GET' && (!process.env.POLLINATIONS_API_KEY || clientKey)) {
      return NextResponse.redirect(apiUrl, { status: 307 });
    }

    // If using server key, we still need to proxy to keep the key secret
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

    // Stream the response directly to the client to save memory and execution time
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
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
export async function POST(requestObj: Request) {
  try {
    const body = await requestObj.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const pollParams = new URLSearchParams();
    const supportedParams = [
      'width', 'height', 'seed', 'model', 'nologo', 'enhance', 
      'private', 'safe', 'transparent', 'referrer', 
      'guidance_scale', 'negative_prompt', 'aspectRatio', 
      'duration', 'image', 'audio'
    ];

    supportedParams.forEach(param => {
      if (body[param] !== undefined) {
        pollParams.append(param, body[param].toString());
      }
    });

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = requestObj.headers.get('x-pollinations-key') || 
                      requestObj.headers.get('Authorization')?.replace('Bearer ', '');
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    const baseUrl = activeApiKey 
      ? `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`
      : `https://pollinations.ai/p/${encodeURIComponent(prompt)}`;

    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    const headers: Record<string, string> = { 'Accept': 'image/*, application/json' };
    if (activeApiKey) headers['Authorization'] = `Bearer ${activeApiKey}`;

    // Proxy POST request (don't redirect as it will fail method switch)
    const response = await fetch(apiUrl, { method: 'GET', headers });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: `Pollinations API Error: ${response.status}`, error: errorText }, { status: response.status });
    }

    // Stream the response
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
