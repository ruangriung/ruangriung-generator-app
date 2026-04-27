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

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = requestObj.headers.get('x-pollinations-key') || 
                      requestObj.headers.get('Authorization')?.replace('Bearer ', '');
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    // Build the query parameters for Pollinations
    const pollParams = new URLSearchParams();
    
    // Official parameters from documentation
    const supportedParams = [
      'model', 'width', 'height', 'seed', 'enhance', 'nologo',
      'negative_prompt', 'safe', 'quality', 'transparent',
      'image', 'duration', 'aspectRatio', 'audio', 't'
    ];

    searchParams.forEach((value, key) => {
      if (supportedParams.includes(key) && value !== 'undefined' && value !== 'null') {
        if (key === 'model') {
          pollParams.set(key, value.toLowerCase());
        } else {
          pollParams.set(key, value);
        }
      }
    });

    // Add key as query parameter for maximum compatibility (crucial for some PAID models)
    if (activeApiKey) {
      pollParams.set('key', activeApiKey);
    }

    const baseUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    console.log(`[API] Image GET: model=${pollParams.get('model')} auth=${activeApiKey ? 'YES' : 'NO'} prompt=${prompt.substring(0, 30)}...`);
 
    const headers: Record<string, string> = {
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
 
    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] Pollinations Error:', response.status, errorText);
        return NextResponse.json(
          { message: `Pollinations API Error: ${response.status}`, error: errorText },
          { status: response.status }
        );
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
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

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = requestObj.headers.get('x-pollinations-key') || 
                      requestObj.headers.get('Authorization')?.replace('Bearer ', '');
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    const pollParams = new URLSearchParams();
    const supportedParams = [
      'model', 'width', 'height', 'seed', 'enhance', 'nologo',
      'negative_prompt', 'safe', 'quality', 'transparent',
      'image', 'duration', 'aspectRatio', 'audio', 't'
    ];

    supportedParams.forEach(param => {
      if (body[param] !== undefined && body[param] !== null && body[param] !== 'undefined') {
        if (param === 'model') {
          pollParams.set(param, body[param].toString().toLowerCase());
        } else {
          pollParams.set(param, body[param].toString());
        }
      }
    });

    if (activeApiKey) {
      pollParams.set('key', activeApiKey);
    }

    const baseUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    const apiUrl = `${baseUrl}?${pollParams.toString()}`;
    
    console.log(`[API] Image POST: model=${pollParams.get('model')} auth=${activeApiKey ? 'YES' : 'NO'} prompt=${prompt.substring(0, 30)}...`);
    
    const headers: Record<string, string> = { 
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(apiUrl, { 
        method: 'GET', 
        headers, 
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ message: `Pollinations API Error: ${response.status}`, error: errorText }, { status: response.status });
      }

      return new NextResponse(response.body, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
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
