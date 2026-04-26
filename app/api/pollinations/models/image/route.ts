import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        
        // Check for key in headers (BYOP)
        const clientKey = request.headers.get('x-pollinations-key') || 
                          request.headers.get('Authorization')?.replace('Bearer ', '');
        
        const activeKey = clientKey || POLLINATIONS_API_KEY;

        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Referer': 'https://ruangriung.my.id',
            'User-Agent': 'RuangRiung-Generator/1.0',
        };

        if (activeKey) {
            headers['Authorization'] = `Bearer ${activeKey}`;
        }

        // Switch endpoint based on whether we have an API Key
        // gen.pollinations.ai is for authenticated (Pro/Enterprise) users
        // image.pollinations.ai is for public users
        const apiUrl = activeKey 
            ? 'https://gen.pollinations.ai/image/models' 
            : 'https://image.pollinations.ai/models';

        const response = await fetch(apiUrl, {
            headers: headers,
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image models: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching image models:', error);
        // Basic fallback models
        const fallbackModels = ['flux', 'flux-realism', 'any-dark', 'flux-anime', 'flux-3d', 'flux-pro', 'turbo'];
        return NextResponse.json(fallbackModels);
    }
}
