
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const prompt = searchParams.get('prompt');

        if (!prompt) {
            return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
        }

        // Determine base URL, usually Pollinations uses /prompt for everything or specific endpoints.
        // Assuming /video exists for specialized models like veo/seedance based on recent updates,
        // or it's just /image with a video model. 
        // However, if the user requested 'veo' and 'seedance', these are video models.
        // Let's try https://gen.pollinations.ai/video. If 404, we might fallback to /image?model=voe
        // But for now, let's stick to the plan: /video

        // Pollinations sometimes uses sending GET request to URL/prompt
        const baseUrl = 'https://gen.pollinations.ai/video';
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

        // Video response might be a stream (mp4) or json? 
        // Usually standard generations return the binary.
        const contentType = response.headers.get('Content-Type') || 'video/mp4';

        // If it's a redirect or something else, fetch handles it usually.
        // If it returns JSON with a URL, we might need to handle that, but Gen API usually returns content.
        const videoBlob = await response.blob();

        return new NextResponse(videoBlob, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
            status: 200
        });

    } catch (error: any) {
        console.error('Error in Pollinations Video Proxy:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
