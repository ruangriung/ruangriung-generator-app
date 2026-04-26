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
    const supportedParams = [
      'width', 'height', 'seed', 'model', 'nologo', 'enhance', 
      'private', 'safe', 'transparent', 'referrer', 
      'guidance_scale', 'negative_prompt', 'aspectRatio', 
      'duration', 'image', 'audio'
    ];

    supportedParams.forEach(param => {
      const val = searchParams.get(param);
      if (val) pollParams.append(param, val);
    });

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = requestObj.headers.get('x-pollinations-key') || 
                      requestObj.headers.get('Authorization')?.replace('Bearer ', '');
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    const baseUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    console.log('[API] GET Request:', apiUrl.substring(0, 100) + '...');

    const headers: Record<string, string> = {
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
    };

    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    // Proxy the request with extended timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('[API] Upstream Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] Pollinations API Error:', response.status, errorText);
        return NextResponse.json(
          { message: `Pollinations API Error: ${response.status}`, error: errorText },
          { status: response.status }
        );
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        status: 200,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error in Pollinations Image Proxy:', error.name === 'AbortError' ? 'Timeout' : error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
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

    const baseUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    console.log('[API] POST Request:', apiUrl.substring(0, 100) + '...');
    
    const headers: Record<string, string> = { 
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
    };
    
    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(apiUrl, { method: 'GET', headers, signal: controller.signal });
      clearTimeout(timeoutId);
      console.log('[API] POST Upstream Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ message: `Pollinations API Error: ${response.status}`, error: errorText }, { status: response.status });
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        status: 200,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error: any) {
    console.error('[API] POST Error:', error.name === 'AbortError' ? 'Timeout' : error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
