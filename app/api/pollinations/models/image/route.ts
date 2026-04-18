import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Referer': 'https://ruangriung.my.id',
            'User-Agent': 'RuangRiung-Generator/1.0',
        };

        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        // Try getting from v1/models endpoint first for consistency with text models
        let response = await fetch('https://gen.pollinations.ai/image/models', {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image models from primary endpoint: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching image models:', error);
        // Fallback to a basic list if both fail
        const fallbackModels = ['flux', 'flux-realism', 'any-dark', 'flux-anime', 'flux-3d', 'flux-pro', 'turbo'];
        return NextResponse.json(fallbackModels);
    }
}
